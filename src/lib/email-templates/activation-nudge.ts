type ActivationNudgeInput = {
    name: string;
    propertiesUrl: string;
};

export function activationNudgeHtml({ name, propertiesUrl }: ActivationNudgeInput): string {
    return `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="margin-bottom: 8px;">Seu primeiro contrato está te esperando</h2>
        <p>Olá, ${name}.</p>
        <p>Você criou sua conta no Alugasim mas ainda não cadastrou nenhum contrato. Leva menos de 2 minutos para começar a acompanhar seus reajustes automaticamente.</p>
        <p style="margin: 24px 0;">
          <a href="${propertiesUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
            Cadastrar meu primeiro imóvel
          </a>
        </p>
        <p style="color: #999; font-size: 12px;">Alugasim</p>
      </div>
    `;
}