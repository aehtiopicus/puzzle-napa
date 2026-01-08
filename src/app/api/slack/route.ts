import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const SlackMessageSchema = z.object({
  text: z.string(),
  subdomain: z.string(),
});

export async function POST(req: NextRequest) {
  const body = SlackMessageSchema.safeParse(await req.json());
  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  if (!body.success || !slackUrl) {
    // Handle the parsing error here
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  try {
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
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error logged successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
