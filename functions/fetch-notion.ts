import type { Context } from "@netlify/functions";
const { Client } = require("@notionhq/client");

// Fetching environment variables
const { NOTION_KEY, NOTION_DB } = process.env;

// Initializing the Notion client
const notion = new Client({
  auth: NOTION_KEY,
});

export default async (req: Request, context: Context) => {
  try {
    // Ensure that the Notion database ID is available
    if (!NOTION_DB) {
      throw new Error("Missing Notion database ID (NOTION_DB) in environment variables.");
    }

    // Query the Notion database
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
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error querying Notion database:", error.message);

    // Return a JSON-formatted error response
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
