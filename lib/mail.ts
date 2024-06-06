//This is used to send the Email to the user

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  //Change in production
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  //send the email
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your Email",
    html: `<p>Click <a href="${confirmLink}">here</a> To confirm your Email</p>`,
  });
};
