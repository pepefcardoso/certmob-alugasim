import { escapeHtml } from '@/lib/email-templates/escape-html';

type PasswordResetInput = { name: string; url: string };

export function passwordResetHtml({ name, url }: PasswordResetInput): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="margin-bottom: 8px;">Redefinir sua senha</h2>
      <p>Olá, ${escapeHtml(name)},</p>
      <p>Recebemos um pedido para redefinir a senha da sua conta no Alugasim. O link abaixo vale por 1 hora:</p>
      <p style="margin: 24px 0;">
        <a href="${escapeHtml(url)}" style="display: inline-block; background: #183447; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none;">Redefinir senha</a>
      </p>
      <p style="color: #666; font-size: 13px;">Se você não fez esse pedido, ignore este e-mail. Sua senha continua a mesma.</p>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">Alugasim</p>
    </div>
  `;
}
