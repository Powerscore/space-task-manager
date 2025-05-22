## **AWS Task Manager Steps**

---

### **Spidey**

* Created the S3 bucket so that attachments can be uploaded/downloaded.
* Created the Lambda functions:

  * One that generates a presigned URL (given task ID and file name) to allow the frontend to download attachments from S3.
  * Another that generates a presigned URL to allow the frontend to upload attachments directly to `bucket/taskId/filename`.
* Set up API Gateway and linked the Lambdas to it.
* Ensured CORS works for Lambdas.
* Handled cross-origin blocking permissions on S3 so our server can upload attachments directly using the presigned URL.
* Connected to our EC2 server, cloned the frontend repo, and deployed the application.
* Used `tmux` to keep the app running in the background even after the EC2 connection is closed.
* Connected the frontend to multiple Lambdas including:

  * Attachment-related Lambdas
  * Edit and Delete Task Lambdas
* Tested APIs using ReqBin first, then connected them to the frontend.
* In the frontend:

  * Created a calendar view to display tasks by date.
  * Added a grid view with analytical summaries (status, percentages of completed/in-progress tasks).
  * Made the site mobile responsive (hamburger menu on smaller screens).

---

### **Awesome Bob**

* Added `POST /task` route to the API Gateway.

* Created a Lambda function called `create-task` and added a trigger to API Gateway.

* Wrote the code to insert request items into DynamoDB.

* Added an IAM role to allow Lambda to write to DynamoDB.

* Allowed Lambda access to CloudWatch to view logs and debug errors.

* Tested the API Gateway endpoint using Postman.

* In CloudWatch:

  * Created a dashboard and added widgets like line graphs, pie charts, and numeric stats (e.g., S3 usage, RDS metrics).
  * Organized widgets cleanly.
  * Added CloudWatch alarms (e.g., EC2 CPU > 80% for 3 data points within 15 minutes).

---

### **Roaa**

* Implemented early versions of:

  * `deleteTask`
  * `getTasks`
  * `getTask`
    (These were later heavily modified for compatibility.)

* Set up the task update email flow:

  * Created SNS topic.
  * Set up SQS queue and DLQ.
  * Subscribed the `TaskNotificationQueue` to the SNS topic.
  * Linked it to `sendTaskUpdateEmail` Lambda.
  * Configured SES and verified sender emails.

* Ensured API Gateways were correctly connected to Lambda functions.

* Designed the system architecture diagram with detailed connections and simple color coding.

---

### **Yousef**

#### Phase 1:

* Created API Gateway with Alaa and chose a deployment stage (`stage-cors`) to link all routes and Lambdas.
* Created `update task` Lambda, connected it to RDS, and placed it within the VPC.
* Accessed the RDS database via EC2 and created tables.

#### Phase 2:

* Refactored database table structure for better functionality.
* Created AWS Cognito User Pool and App Client.
* Configured Cognito with hosted UI/managed login.
* Integrated authentication in the frontend using `useAuth`.
* Set up redirect routes for login/register/logout to AWS Cognito.
* Built post-signup Lambda trigger to add users to the RDS.
* Solved RDS connection issues by adjusting security groups and placing Lambda in the same subnet as the DB.
* Worked on frontend pages:

  * Home
  * Tasks
  * Task Creation
  * Task Edit
* Connected frontend to API Gateway endpoints.

#### Phase 3:

* Researched options to switch from HTTP to HTTPS.

  * Found `Let's Encrypt` but chose `nip.io` as a simpler solution to map IPs to HTTPS-enabled hostnames.
* Deployed the web app using Nginx:

  * Configured the server.
  * Built frontend.
  * Copied `/dist` folder contents to Nginx public directory.
* Fixed frontend bugs and minor backend logic issues.
