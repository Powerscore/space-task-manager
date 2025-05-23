
![image](https://github.com/user-attachments/assets/ab6cc4ca-3d0c-4aa7-b508-9722411525e8)


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


# Space Task Manager User Manual

Welcome to the **Space Task Manager**! This guide will help you navigate and use the key features of the site to manage your tasks efficiently.

## Table of Contents

* [1. Getting Started](#1-getting-started)

  * [1.1 Sign Up](#11-sign-up)
  * [1.2 Log In](#12-log-in)
* [2. Home Page](#2-home-page)
* [3. Task List](#3-task-list)

  * [3.1 Grid View](#31-grid-view)
  * [3.2 Calendar View](#32-calendar-view)
* [4. Creating a New Task](#4-creating-a-new-task)
* [5. Task Details](#5-task-details)

  * [5.1 Viewing Details](#51-viewing-details)
  * [5.2 Editing a Task](#52-editing-a-task)
  * [5.3 Deleting a Task](#53-deleting-a-task)
  * [5.4 File Attachments](#54-file-attachments)
* [6. Account Management](#6-account-management)
* [7. FAQ](#7-faq)
* [8. Support](#8-support)

---

## 1. Getting Started

To begin using Space Task Manager, navigate to the website and either sign up for a new account or log in to your existing account.

### 1.1 Sign Up

1. Click on **Sign Up** in the top navigation.
2. Fill in your details:

   * **Email Address**
   * **Password** (and confirm)
3. Click **Create Account**.
4. You will be redirected to the Home Page upon successful registration.

### 1.2 Log In

1. Click on **Log In** in the top navigation.
2. Enter your **Email Address** and **Password**.
3. Click **Log In**.
4. If credentials are valid, you will be taken to the Home Page.

---

## 2. Home Page

The Home Page provides an overview of your tasks and quick access to key actions.

* **Navigation Bar**: Links to Home, My Tasks, Calendar.
* **My Tasks**: A button to view the list of tasks you have
---

## 3. Task List

Navigate to **My Tasks** to view all your tasks in one place.

* Use the **View Mode** toggle in the top-right to switch between **Grid View** and **Calendar View**.

### 3.1 Grid View

* Displays tasks as cards in a grid layout.
* Each card shows:

  * Title
  * Due Date
  * Priority
  * Status
* Click a card to open its detailed view.

### 3.2 Calendar View

* Opens the **Calendar** page.
* Tasks are shown on their respective due dates.
* Click a date to see tasks due on that day.

---

## 4. Creating a New Task

1. On the grid view of tasks, click **New Task**.
2. Fill in the task form:

   * **Title** (required)
   * **Description** 
   * **Priority** (e.g., Low, Medium, High)
   * **Status** (e.g., To Do, In Progress, Done, Cancelled)
   * **Due Date** 
   * **Attachment** (optional): Upload a file if needed.
3. Click **Save** to create the task.

---

## 5. Task Details

Click a task (from grid or calendar) to open its detail page.

### 5.1 Viewing Details

* **Header**: Displays Title, Priority, Status, and Due Date.
* **Description**: Full description text.
* **Attachment**: Link/button to download any attached file.

### 5.2 Editing a Task

1. On the task detail page, click **Edit**.
2. Update any fields in the form.
3. Click **Save** to apply changes.

### 5.3 Deleting a Task

1. On the task detail page, click **Delete**.
2. Confirm the deletion in the pop-up dialog.
3. Task will be permanently removed.

### 5.4 File Attachments

* When creating or editing a task, use the **Attachment** drop-box to upload a file.
* On the task detail page, click **Download** to retrieve the file.


Thank you for choosing **Space Task Manager** to organize your tasks!
