type LeadNotificationInput = {
  whatsapp: string;
  propertyCount: number;
  source: string;
};

export function leadNotificationHtml({
  whatsapp,
  propertyCount,
  source,
}: LeadNotificationInput): string {
  const waLink = `https://wa.me/55${whatsapp}`;
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="margin-bottom: 8px;">Novo lead - Alugasim</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 4px 0; color: #666;">WhatsApp</td>
          <td style="padding: 4px 0; text-align: right;">${whatsapp}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #666;">Imóveis</td>
          <td style="padding: 4px 0; text-align: right;">${propertyCount}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #666;">Origem</td>
          <td style="padding: 4px 0; text-align: right;">${source}</td>
        </tr>
      </table>
      <p>
        <a href="${waLink}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
          Chamar no WhatsApp
        </a>
      </p>
    </div>
  `;
}
