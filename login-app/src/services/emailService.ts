import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY!;

export async function sendVerificationCodeEmail(
  toEmail: string,
  code: string
): Promise<void> {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: toEmail,
        verification_code: code,
      },
      PUBLIC_KEY
    );
    console.log("Email enviado com sucesso para:", toEmail);
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw new Error("Falha ao enviar código de verificação por email");
  }
}
