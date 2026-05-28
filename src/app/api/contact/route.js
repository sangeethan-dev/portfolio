import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

function escape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req) {
  try {
    const { name, email, service, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio" <${process.env.GMAIL_USER}>`,
      replyTo: `"${escape(name)}" <${escape(email)}>`,
      to: process.env.GMAIL_USER,
      subject: `New inquiry${service ? ` — ${escape(service)}` : ""} from ${escape(name)}`,
      text: `Name: ${name}\nEmail: ${email}${service ? `\nService: ${service}` : ""}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;background:#fff;padding:40px;border-radius:8px;">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#999;margin:0 0 24px;">New project inquiry</p>
          <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.7;">
            <tr>
              <td style="padding:10px 0;color:#999;width:110px;vertical-align:top;border-bottom:1px solid #f0f0f0;">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${escape(name)}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#999;vertical-align:top;border-bottom:1px solid #f0f0f0;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;"><a href="mailto:${escape(email)}" style="color:#1a1a1a;">${escape(email)}</a></td>
            </tr>
            ${service ? `
            <tr>
              <td style="padding:10px 0;color:#999;vertical-align:top;border-bottom:1px solid #f0f0f0;">Service</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${escape(service)}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:10px 0;color:#999;vertical-align:top;">Message</td>
              <td style="padding:10px 0;">${escape(message).replace(/\n/g, "<br>")}</td>
            </tr>
          </table>
          <p style="margin:32px 0 0;font-size:12px;color:#bbb;">Reply directly to this email to respond to ${escape(name)}.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err.message);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
