const handleSave = async (data) => {
  console.log('[LOG] handleSave: start', { data, isNew, id, file });
  try {
    const token = await fetchUserAuthToken();
    console.log('[LOG] handleSave: token:', token);

    let taskId = id;
    const urlBase = 'https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/task';

    if (isNew) {
      console.log('[LOG] handleSave: creating new task first');
      const resp = await axios.post(urlBase, data, { headers: { Authorization: token } });
      console.log('[LOG] handleSave: create response:', resp.data);
      taskId = resp.data.id;
    }

    let attachmentUrl = data.attachmentUrl || '';
    if (file) {
      const filename = file.name;
      console.log('[LOG] handleSave: file present, filename:', filename);
      const presignUrl = `${urlBase}/${taskId}/attachments`;
      console.log('[LOG] handleSave: presign endpoint:', presignUrl);

      const presignResp = await axios.get(presignUrl, {
        headers: { Authorization: token },
        params: { key: filename }
      });
      console.log('[LOG] handleSave: presign response:', presignResp.data);

      // Upload directly to S3 using presigned URL from API
      console.log('[LOG] handleSave: uploading file to S3');
      const uploadResp = await fetch(presignResp.data.downloadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream'
        }
      });
      console.log('[LOG] handleSave: S3 upload response status:', uploadResp.status);

      if (!uploadResp.ok) {
        throw new Error(`File upload failed with status ${uploadResp.status}`);
      }

      // Set attachmentUrl to the path/key expected by backend
      attachmentUrl = `${taskId}/${filename}`;
      console.log('[LOG] handleSave: attachmentUrl set to', attachmentUrl);
    }

    // Only patch if attachmentUrl is not empty
    if (attachmentUrl !== "") {
      const payload = {
        ...data,
        title: data.title?.trim(),
        dueDate: data.dueDate,
        priority: data.priority || 'Medium',
        status: data.status || 'Not Started',
        attachmentUrl,
      };
      console.log('[LOG] handleSave: payload for final save:', payload);

      const saveUrl = `${urlBase}/${taskId}`;
      console.log('[LOG] handleSave: final PATCH to', saveUrl);

      const saveResp = await axios.patch(saveUrl, payload, { headers: { Authorization: token } });
      console.log('[LOG] handleSave: save response:', saveResp.data);
    } else {
      console.log('[LOG] handleSave: skipping PATCH because attachmentUrl is empty');
    }

    console.log('[LOG] handleSave: navigate to', `/tasks/${taskId}`);
    navigate(`/tasks/${taskId}`);
  } catch (err) {
    console.error('[ERROR] handleSave:', err);
    alert(`Failed to save task: ${err.message || 'Unknown error'}`);
  } finally {
    console.log('[LOG] handleSave: end');
  }
};
