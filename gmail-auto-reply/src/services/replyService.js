import nodemailer from "nodemailer";

export const sendAutoReply = async (
  to,
  subject,
  options = {},
  body = "",
  name = "",
) => {
  try {
    const { threadId, originalMessageId, gmailClient } = options;

    console.log("[Reply] sendAutoReply start", { to, subject, threadId });

    const toMatch = typeof to === "string" ? to.match(/<([^>]+)>/) : null;
    const toEmail = toMatch?.[1] || to;
    const safeSubject = subject || "";

    const signature = `
--
Best regards,
Support Team
Your SaaS Name
support@yoursaas.com
`;

    const textBody = `
Hello ${name},

Thank you for contacting us.

We have received your message and our team will review it shortly.
You can expect a response from us as soon as possible.

${signature}
`;

    const htmlBody = `
<div style="background:#f3f4f6;padding:40px 15px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">

    <div style="background:#111827;color:#ffffff;padding:22px 26px;font-size:20px;font-weight:600;">
      Support Notification
    </div>

    <div style="padding:28px;color:#374151;font-size:15px;line-height:1.6;">

      <p style="margin-top:0;">Hello ${name},</p>

      <p>
        Thank you for contacting us. Your message has been successfully received.
      </p>

      <p>
        Our support team will review your request and get back to you shortly.
      </p>

      <p style="margin-top:30px;">
        Best regards,<br/>
        <strong>Support Team</strong>
      </p>

    </div>

    <div style="background:#fafafa;padding:18px 26px;font-size:13px;color:#6b7280;border-top:1px solid #e5e7eb;">

      Need help? Contact us at
      <a href="mailto:support@yoursaas.com" style="color:#2563eb;text-decoration:none;">
        support@yoursaas.com
      </a>

      <br/><br/>

      <span style="font-size:12px;color:#9ca3af;">
        This is an automated response confirming that we received your message.
      </span>

    </div>

  </div>
</div>
`;
    const boundary = "boundary_autoreply";

    const headers = [
      "From: me",
      `To: ${toEmail}`,
      `Subject: Re: ${safeSubject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "Auto-Submitted: auto-generated",
      "Precedence: bulk",
      "X-Auto-Response-Suppress: All",
    ];

    if (originalMessageId) {
      headers.push(`In-Reply-To: ${originalMessageId}`);
      headers.push(`References: ${originalMessageId}`);
    }

    const messageParts = [
      ...headers,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "",
      textBody.trim(),
      "",
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      htmlBody.trim(),
      "",
      `--${boundary}--`,
    ];

    const rawMessage = messageParts.join("\r\n");

    const encodedMessage = Buffer.from(rawMessage).toString("base64url");

    await gmailClient.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
        threadId,
      },
    });

    console.log("[Reply] sendAutoReply complete");
  } catch (error) {
    console.error("[Reply] sendAutoReply error:", error);
    throw error;
  }
};

export const sendAutoReplywithNodeMailer = async (
  to,
  subject,
  options = {},
  body = "",
  name = "",
) => {
  try {
    const { threadId, originalMessageId, gmailClient } = options;

    console.log("[Reply] sendAutoReplywithNodeMailer start", {
      to,
      subject,
      threadId,
    });

    // 1. Get OAuth2 details from the existing gmailClient
    const auth = gmailClient.context._options.auth;
    const tokens = auth.credentials;

    // 2. Get the sender's email address for Nodemailer OAuth2
    const profile = await gmailClient.users.getProfile({ userId: "me" });
    const senderEmail = profile.data.emailAddress;

    // 3. Create Nodemailer transporter with OAuth2
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: senderEmail,
        clientId: auth._clientId,
        clientSecret: auth._clientSecret,
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
      },
    });

    const toMatch = typeof to === "string" ? to.match(/<([^>]+)>/) : null;
    const toEmail = toMatch?.[1] || to;
    const safeSubject = subject || "";

    const signature = `
--
Best regards,
Support Team
Your SaaS Name
support@yoursaas.com
`;

    const textBody = `
Hello, ${name}

Thank you for your email.

We have received your message and our team will get back to you shortly.

${signature}
`;

    const htmlBody = `
<div style="background-color:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden;">
    
    <div style="background:#2563eb;color:#ffffff;padding:20px 30px;font-size:20px;font-weight:bold;">
      Your SaaS Name
    </div>

    <div style="padding:30px;color:#333;font-size:15px;line-height:1.6;">
      <p style="margin-top:0;">Hello <strong>${name}</strong>,</p>

      <p>
        Thank you for reaching out to us. We have successfully received your message.
      </p>

      <p>
        Our team is currently reviewing your request and will get back to you as soon as possible.
      </p>

      <p>
        If your matter is urgent, feel free to reply to this email.
      </p>

      <div style="margin-top:30px;">
        <p style="margin:0;">Best regards,</p>
        <p style="margin:0;font-weight:bold;">Support Team</p>
        <p style="margin:0;">Your SaaS Name</p>
      </div>
    </div>

    <div style="background:#f9fafb;padding:15px 30px;font-size:13px;color:#666;border-top:1px solid #eee;">
      Need help? Contact us at 
      <a href="mailto:support@yoursaas.com" style="color:#2563eb;text-decoration:none;">
        support@yoursaas.com
      </a>
      <br/><br/>
      <span style="color:#999;font-size:12px;">
        This is an automated email. Please do not reply to this message.
      </span>
    </div>

  </div>
</div>
`;

    // 4. Send the reply using Nodemailer
    const info = await transporter.sendMail({
      from: senderEmail,
      to: toEmail,
      subject: safeSubject.toLowerCase().startsWith("re:")
        ? safeSubject
        : `Re: ${safeSubject}`,
      text: textBody.trim(),
      html: htmlBody.trim(),
      headers: {
        "In-Reply-To": originalMessageId,
        References: originalMessageId,
        "Auto-Submitted": "auto-generated",
        "X-Auto-Response-Suppress": "All",
      },
    });

    console.log("[Reply] sendAutoReplywithNodeMailer complete", info.messageId);
  } catch (error) {
    console.error("[Reply] sendAutoReplywithNodeMailer error:", error);
    throw error;
  }
};
