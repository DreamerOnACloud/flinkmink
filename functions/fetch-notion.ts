// This page can be requested on /.netlify/functions/fetch-notion
import type { Context } from "@netlify/functions";

const { Client } = require("@notionhq/client")

// These env vars are defined and fetched from https://app.netlify.com/sites/dreameronacloud/configuration/env#content
const { NOTION_KEY, NOTION_DB } = process.env;

// Initializing a client
const notion = new Client({
  auth: NOTION_KEY,
})

export default async (req: Request, context: Context) => { // The default async request / response netlify function
  try{

     // Ensure that the required environment variable is available
     if (!NOTION_DB) {
      throw new Error("Missing Notion database ID (NOTION_DB) in environment variables.");
    }
    
    const response = await notion.databases.query({
      database_id: NOTION_DB, // update this on netlify to use another Notion database
      filter: { // check out how to filter here: https://developers.notion.com/reference/post-database-query-filter#status
        property: "Status",
        status: {
          equals: "done"
        }
      },
    })
    return new Response(JSON.stringify(response));
  }
  catch(error: any) {
    console.error(error);

    // Return an HTTP 500 response with the error message
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      message: error.message,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}