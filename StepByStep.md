- **AWS Steps:**

  - **Alaa**
    - Created the S3 bucket so that attachments can be uploaded/downloaded.
    - Created the Lambda that generates a presigned URL given the task ID and the file name to allow the frontend to access the S3 task attachment directly, as well as the Lambda that generates a presigned URL to allow the frontend to directly upload the task attachment to the `bucket/taskId/filename`.
    - Created the API Gateway and linked the Lambdas to them.
    - Ensured CORS works for the Lambdas. Dealt with cross-origin blocking permissions on the S3 to allow the server to upload attachments directly with the presigned URL.
    - Connected to the EC2 server. Cloned the frontend repo and deployed the application. Used `tmux` to run the application in the background so the deployment remains up when EC2 connect is closed.
    - Connected the frontend with multiple Lambdas like the attachment Lambdas and the edit/delete task Lambdas.
    - Tested the APIs online first with ReqBin to ensure the API Gateway is calling the Lambdas before integrating with the frontend.
    - In the frontend, created the calendar view where tasks are shown by date for better visualization.
    - In the grid view, added analytical summaries of tasks in terms of status, percentages of what's done and what's in progress.
    - Made the website mobile responsive. The navbar turns into hamburger style on mobile screens.

  - **Ali**
    - Added to the API Gateway the route of `POST /task`.
    - Created the Lambda function called `create-task`, added a trigger to the API Gateway.
    - Added the code to allow putting items from the request into DynamoDB.
    - Ensured the Lambda had the correct IAM role to access and write to DynamoDB.
    - Used the Test event to check functionality and allowed Lambda access to CloudWatch to see logs and errors.
    - Tested the API Gateway endpoint on a website like Postman.
    - In the CloudWatch dashboard:
      - Created a dashboard and added multiple widgets with useful information (line graphs, pie charts, numbers).
      - Chose metrics such as S3 usage, RDS metrics.
      - Organized all widgets in a visually pleasing way.
      - Added a CloudWatch alarm based on a selected metric (e.g., EC2 CPU utilization > 80% for 3 data points within 15 mins).

  - **Roaa**
    - Implemented the very first versions of `deleteTask`, `getTasks`, `getTask` that were later heavily modified for project compatibility.
    - Set up the flow of sending an email for task updates:
      - Created SNS topic, set up SQS queue and DLQ.
      - Had the `TaskNotificationQueue` subscribe to the SNS topic.
      - Linked it to the `sendTaskUpdateEmail` Lambda function.
      - Set up SES and verified sender emails.
    - Ensured API Gateways are connected to the correct Lambda functions.
    - Designed the architecture diagram of the entire system with detailed connections and simple color coding.

  - **Yousef**
    - **Phase 1:**
      - Created API Gateway with Alaa and chose a deployment stage (`stage-cors`) to connect all routes and Lambda functions.
      - Created Lambda function for updating tasks, connecting it to the RDS and placing it within the VPC.
      - Remotely accessed the RDS database through the EC2 instance to create the tables.
    - **Phase 2:**
      - Refactored database table architecture and tables for smooth functionality.
      - Created AWS Cognito User Pool and app client; configured it to use hosted UI/managed login.
      - Integrated authentication in the frontend using the `useAuth` hook and redirected login/register/logout to AWS Cognito managed login.
      - Worked on post-signup Lambda trigger to add users to the RDS database.
      - Addressed RDS connection issues using security groups and placing Lambda in the same subnet as the database.
      - Worked on frontend pages: home, tasks, task creation, task edit.
      - Connected frontend with API Gateway endpoints.
    - **Phase 3:**
      - Researched how to make the web server use HTTPS instead of HTTP.
      - Evaluated using Let's Encrypt vs using `nip.io` (mapped IP address to HTTPS hostname).
      - Deployed web app using Nginx, configured server, built frontend, and copied `/dist` files to the public Nginx directory.
      - Fixed frontend bugs and minor backend logic issues.
