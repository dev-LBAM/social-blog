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
              background-color: #f4f4f4; /* Background: Neutral light gray */
              color: #333; /* Dark gray text */
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff; /* White background for the container */
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #333333; /* Dark gray for the heading */
              font-size: 24px;
            }
            .content {
              text-align: center;
              margin-bottom: 20px;
            }
            .content p {
              font-size: 16px;
              margin-bottom: 20px;
              color: #555; /* Medium gray text for the paragraph */
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #333333; /* Dark gray code text */
              background-color: #f1f1f1; /* Light gray background for code box */
              padding: 10px 20px;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #888; /* Light gray for footer text */
            }
            .footer a {
              color: #555; /* Medium gray for the link */
              text-decoration: none;
            }
            .footer a:hover {
              color: #1a73e8; /* Blue color on hover */
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
              <p>Thank you for using our service! <br> If you have any questions, feel free to contact us at <a href="mailto:app.tester.lbam@gmail.com">app.tester.lbam@gmail.com</a>.</p>
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
