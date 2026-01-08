import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const SlackMessageSchema = z.object({
  text: z.string(),
  subdomain: z.string(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = SlackMessageSchema.safeParse(await req.json());
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400, headers: corsHeaders }
      );
    }

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (!body.success || !slackUrl) {
      return NextResponse.json(
        { error: "Bad request" },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await fetch(slackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `🚨 Widget Error: ${body.data.text}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*🚨 Widget Error Occurred*`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Message:* ${body.data.text}`,
            },
          },
        ].filter(Boolean),
      }),
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: "Not able to log error" },
        { status: 400, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { message: "Error logged successfully" },
      { status: 200, headers: corsHeaders }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
