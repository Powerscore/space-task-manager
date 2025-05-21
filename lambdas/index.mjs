import { Client } from "pg";

// Configure your database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false, // For development only - consider true for production with CA cert
  },
};

export const handler = async (event, context) => {
  console.log("Event received:", JSON.stringify(event, null, 2));
  // console.log(event)
  // This is triggered by Cognito Post Confirmation event
  if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
    // Get the user attributes from the correct location in the event
    const userAttributes = event.request.userAttributes;

    if (!userAttributes) {
      console.error("userAttributes is undefined in the event");
      return event; // Return event to prevent Cognito workflow disruption
    }

    // Extract user attributes with null checks
    const cognitoSub = userAttributes.sub; // Get the cognito_sub (user's unique ID)
    const email = userAttributes.email || "";
    const firstName = userAttributes.given_name || "";
    const lastName = userAttributes.family_name || "";
    const phoneNumber = userAttributes.phone_number || "";

    // Note: passwordHashed will be NULL since Cognito handles authentication

    if (!cognitoSub) {
      console.error("cognito_sub (userAttributes.sub) is missing from userAttributes");
      return event; // Return event to prevent Cognito workflow disruption
    }

    if (!email) {
      console.error("email is missing from userAttributes");
      // Depending on your requirements, you might still want to proceed if email is optional
      // but cognito_sub is the critical part. For now, keeping this check.
      return event;
    }

    let client;

    try {
      // Connect to your PostgreSQL RDS database
      client = new Client(dbConfig);
      await client.connect();

      // Insert the user data into your database
      // The primary key is now cognito_sub
      const query = `
        INSERT INTO users (cognito_sub, firstName, lastName, phoneNumber, email)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (cognito_sub) DO UPDATE 
        SET 
          firstName = EXCLUDED.firstName, 
          lastName = EXCLUDED.lastName, 
          phoneNumber = EXCLUDED.phoneNumber, 
          email = EXCLUDED.email, -- Also update email if it changes
          updatedAt = CURRENT_TIMESTAMP
        RETURNING cognito_sub;
      `;

      const values = [cognitoSub, firstName, lastName, phoneNumber, email];
      const result = await client.query(query, values);

      console.log("User processed in database with cognito_sub:", result.rows[0].cognito_sub);
    } catch (error) {
      console.error("Error processing user in database:", error);
      // Don't throw the error - this would disrupt the Cognito flow
      // Instead, log it and let the process continue
    } finally {
      // Close the database connection
      if (client) {
        try {
          await client.end();
        } catch (e) {
          console.error("Error closing database connection:", e);
        }
      }
    }
  }

  // Always return the event to Cognito to continue the flow
  return event;
};
