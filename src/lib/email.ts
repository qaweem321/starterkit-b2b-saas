type Email = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail({ to, subject, text }: Email) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`\n--- Email (dev mode, not sent) ---\nTo: ${to}\nSubject: ${subject}\n\n${text}\n---------------------------------\n`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "StarterKit <onboarding@resend.dev>",
      to,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Sending email failed: ${response.status} ${await response.text()}`);
  }
}
