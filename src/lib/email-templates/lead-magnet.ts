type LeadMagnetInput = {
  propertyCount: number;
};

export function leadMagnetHtml({ propertyCount }: LeadMagnetInput): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="margin-bottom: 8px;">Seu cálculo de reajuste está pronto</h2>
      <p>Olá,</p>
      <p>Recebemos seus dados para ${propertyCount} imóvel${propertyCount > 1 ? 'is' : ''}. Nosso time vai te chamar no WhatsApp para configurar seus contratos e travar o preço de fundador.</p>
      <p>Enquanto isso, você pode simular novos reajustes a qualquer momento na calculadora do site.</p>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">Alugasim</p>
    </div>
  `;
}
