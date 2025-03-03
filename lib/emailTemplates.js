// emailTemplates.js

const emailTemplates = {
  confirmationEmail: ({ userName, confirmationLink }) => ({
    subject: "Confirm Your Email Address",
    body: `
      <p>Hi ${userName},</p>
      <p>Thank you for signing up! Please confirm your email by clicking the link below:</p>
      <p><a href="${confirmationLink}">Confirm Email</a></p>
      <p>If you didn't sign up, you can ignore this email.</p>
      <p>Best,</p>
      <p>Your Company Team</p>
    `,
  }),

  resetPasswordEmail: ({ userName, resetLink }) => ({
    subject: "Reset Your Password",
    body: `
      <p>Hi ${userName},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best Regards,</p>
      <p>CoLab</p>
    `,
  }),

  welcomeEmail: ({ userName }) => ({
    subject: "Welcome to Our Service!",
    body: `
      <p>Hi ${userName},</p>
      <p>We're excited to have you on board. Let us know if you have any questions!</p>
      <p>Best,</p>
      <p>Your Company Team</p>
    `,
  }),
};

export default emailTemplates;