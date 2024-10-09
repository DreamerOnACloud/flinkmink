const { Client } = require("@notionhq/client");

// Fetching environment variables
const { NOTION_KEY, NOTION_DB } = process.env;

// Initializing the Notion client
const notion = new Client({
  auth: NOTION_KEY,
});

const handler = async (req, context) => {
  try {
    // Ensure that the Notion database ID is available
    if (!NOTION_DB) {
      throw new Error("Missing Notion database ID (NOTION_DB) in environment variables.");
    }

    // Query the Notion database (https://developers.notion.com/reference/post-database-query)
    const response = await notion.databases.query({
      database_id: NOTION_DB,
      filter: {
        property: "Status",
        status: {
          equals: "done",
        },
      },
    });

    // Return the response as a JSON string
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error querying Notion database:", error.message);

    // Return a JSON-formatted error response
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    };
  }
};

module.exports = { handler };
