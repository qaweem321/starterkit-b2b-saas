import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { buttonEmailHtml, sendEmail } from "@/lib/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendEmail({
          to: user.email,
          subject: "Reset your password",
          text: `Hi ${user.name},\n\nClick the link below to choose a new password:\n${url}\n\nThis link expires in 1 hour. If you didn't ask for this, you can ignore this email.`,
          html: buttonEmailHtml({
            heading: "Reset your password",
            message: `Hi ${user.name}, click the button below to choose a new password.`,
            buttonText: "Reset password",
            url,
            footer: "This link expires in 1 hour. If you didn't ask for this, you can ignore this email.",
          }),
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
  plugins: [nextCookies()],
});
