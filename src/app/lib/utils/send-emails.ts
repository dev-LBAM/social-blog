import nodemailer from "nodemailer";

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

// Function to send HTML email
export async function sendVerificationEmail(userEmail: string, code: string) {
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: userEmail,
      subject: "Your new code to check the email",
      html: `
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f7f7f7;
              color: #333;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #FFEDD5;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #000000;
              font-size: 24px;
            }
            .content {
              text-align: center;
              margin-bottom: 20px;
            }
            .content p {
              font-size: 16px;
              margin-bottom: 20px;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #000000;
              background-color: #ffffff;
              padding: 10px 20px;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #888;
            }
            .footer a {
              color: #1a73e8;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Social Blog Verification</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to verify your email address. Please use the code below to complete the verification process:</p>
              <div class="code">
                ${code}
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, you can ignore this email.</p>
            </div>
            <div class="footer">
              <p>Thank you for using our service! <br> If you have any questions, feel free to contact us at <a href="mailto:support@example.com">app.tester.lbam@gmail.com
</a>.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { status: 200, message: "Email sent successfully!" };
  } catch (error) {
    return { status: 500, message: "Error sending email", error };
  }
}
