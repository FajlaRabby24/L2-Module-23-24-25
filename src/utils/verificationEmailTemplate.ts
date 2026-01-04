export const verificationEmailTemplate = (
  name: string,
  verificationToken: string
) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:#4f46e5; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0;">Prisma Blog</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">
                <h2 style="color:#111827;">Verify your email address</h2>
                <p style="color:#374151; font-size:15px; line-height:1.6;">
                  Hi <strong>${name || "there"}</strong>,
                </p>

                <p style="color:#374151; font-size:15px; line-height:1.6;">
                  Thanks for signing up for <strong>Prisma Blog</strong>.
                  Please confirm your email address by clicking the button below.
                </p>

                <!-- Button -->
                <table cellpadding="0" cellspacing="0" style="margin:30px 0;">
                  <tr>
                    <td align="center">
                      <a
                        href="${verificationToken}"
                        target="_blank"
                        style="
                          background:#4f46e5;
                          color:#ffffff;
                          text-decoration:none;
                          padding:14px 28px;
                          font-size:16px;
                          border-radius:6px;
                          display:inline-block;
                        "
                      >
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="color:#6b7280; font-size:14px; line-height:1.6;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all; font-size:14px;">
                  <a href="${verificationToken}" style="color:#4f46e5;">
                    ${verificationToken}
                  </a>
                </p>

                <p style="color:#6b7280; font-size:14px; margin-top:30px;">
                  This link will expire in 24 hours.
                  If you didn’t create an account, you can safely ignore this email.
                </p>

                <p style="color:#374151; font-size:15px;">
                  — Prisma Blog Team
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:20px; text-align:center; font-size:13px; color:#9ca3af;">
                © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
