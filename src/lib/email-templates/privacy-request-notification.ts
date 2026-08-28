type PrivacyRequestNotificationInput = {
  requesterName: string;
  requesterEmail: string;
  type: 'ACCESS' | 'CORRECTION' | 'DELETION' | 'PORTABILITY';
  details?: string | null;
};

const typeLabels: Record<PrivacyRequestNotificationInput['type'], string> = {
  ACCESS: 'Acesso aos dados',
  CORRECTION: 'Correção de dados',
  DELETION: 'Exclusão de dados',
  PORTABILITY: 'Portabilidade de dados',
};

function escapeHtml(input: string): string {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function privacyRequestNotificationHtml({
  requesterName,
  requesterEmail,
  type,
  details,
}: PrivacyRequestNotificationInput): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="margin-bottom: 8px;">Nova solicitação de titular (LGPD)</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 4px 0; color: #666;">Titular</td>
          <td style="padding: 4px 0; text-align: right;">${escapeHtml(requesterName)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #666;">E-mail</td>
          <td style="padding: 4px 0; text-align: right;">${escapeHtml(requesterEmail)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #666;">Tipo</td>
          <td style="padding: 4px 0; text-align: right; font-weight: bold;">${typeLabels[type]}</td>
        </tr>
      </table>
      ${details ? `<p style="color: #666;">Detalhes:</p><p>${escapeHtml(details)}</p>` : ''}
      <p style="color: #999; font-size: 12px; margin-top: 24px;">Prazo legal de resposta: 15 dias (LGPD, Art. 18).</p>
    </div>
  `;
}
