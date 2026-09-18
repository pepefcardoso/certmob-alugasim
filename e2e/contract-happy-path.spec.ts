import { expect, test, type Page } from '@playwright/test';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const RENT_VALUE = 3200;

function isoDateLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function firstOfMonth(monthsAgo: number, from = new Date()): Date {
  return new Date(from.getFullYear(), from.getMonth() - monthsAgo, 1);
}

async function pickDate(page: Page, labelText: string, date: Date, monthsBack = 0) {
  const group = page.getByText(labelText, { exact: true }).locator('xpath=..');
  await group.getByRole('button').click();
  for (let i = 0; i < monthsBack; i++) {
    await page.getByRole('button', { name: 'Go to the Previous Month' }).click();
  }
  await page.locator(`[data-day="${isoDateLocal(date)}"] button`).click();
}

test('sign up → property → tenant → contract → adjustment → payment → dashboard/reports', async ({
  page,
}) => {
  const stamp = Date.now();
  const ownerEmail = `e2e-owner-${stamp}@alugasim.test`;

  await page.goto('/sign-up');
  await page.getByLabel('Nome').fill('Ana Proprietária');
  await page.getByLabel('E-mail').fill(ownerEmail);
  await page.getByLabel('Senha').fill('SenhaForte123');
  await page.getByLabel('CPF/CNPJ').fill('12345678901');
  await page.getByRole('checkbox').click();
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL('/dashboard');

  await page.goto('/dashboard/properties/new');
  await page.getByLabel('Nome do imóvel').fill('Apartamento Centro');
  await page.getByLabel('Rua').fill('Rua das Flores');
  await page.getByLabel('Número').fill('123');
  await page.getByLabel('Bairro').fill('Centro');
  await page.getByLabel('Cidade').fill('Florianópolis');
  await page.getByLabel('UF').fill('SC');
  await page.getByLabel('CEP').fill('88000-000');
  await page.getByRole('button', { name: 'Salvar imóvel' }).click();
  await expect(page).toHaveURL('/dashboard/properties');
  await expect(page.getByText('Apartamento Centro').first()).toBeVisible();

  await page.goto('/dashboard/tenants/new');
  await page.getByLabel('Nome').fill('Maria Silva');
  await page.getByLabel('E-mail').fill(`e2e-tenant-${stamp}@alugasim.test`);
  await page.getByLabel('Telefone').fill('47999998888');
  await page.getByRole('button', { name: 'Salvar locatário' }).click();
  await expect(page).toHaveURL('/dashboard/tenants');
  await expect(page.getByText('Maria Silva').first()).toBeVisible();

  await page.goto('/dashboard/contracts/new');
  await page.getByRole('button', { name: 'Selecione um imóvel' }).click();
  await page.getByRole('option', { name: 'Apartamento Centro' }).click();
  await page.getByRole('button', { name: 'Selecione um locatário' }).click();
  await page.getByRole('option', { name: 'Maria Silva' }).click();
  await page.getByLabel('Valor do aluguel').fill(String(RENT_VALUE));
  await pickDate(page, 'Data base', firstOfMonth(13), 13);
  await pickDate(page, 'Data de início', firstOfMonth(0));
  await page.getByRole('button', { name: 'Salvar contrato' }).click();
  await expect(page).toHaveURL('/dashboard/contracts');

  await page.getByRole('table').getByRole('link', { name: 'Ver detalhes' }).click();
  await expect(page).toHaveURL(/\/dashboard\/contracts\/.+/);

  await page.getByRole('button', { name: 'Aplicar reajuste' }).click();
  const dialog = page.getByRole('dialog');
  const formula = dialog.getByText(/×\s*\(1\s*\+.*%\)\s*=/);
  await expect(formula).toBeVisible({ timeout: 20_000 });
  const formulaText = (await formula.textContent()) ?? '';
  const newValueText = formulaText.split('=').at(-1)?.trim();

  await dialog.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByText('Reajuste aplicado')).toBeVisible();
  await expect(dialog).toBeHidden();
  if (newValueText) {
    await expect(page.getByText(newValueText)).toBeVisible();
  }

  await page
    .getByRole('table')
    .locator('tbody tr')
    .first()
    .getByRole('button', { name: 'Marcar como pago' })
    .click();
  await expect(page.getByText('Pagamento marcado como pago')).toBeVisible();

  await page.goto('/dashboard');
  await expect(page.getByText(currency.format(RENT_VALUE)).first()).toBeVisible();

  await page.goto('/dashboard/reports');
  const revenueTable = page.locator('table').first();
  await expect(revenueTable.locator('tbody tr').last()).toContainText(
    currency.format(RENT_VALUE),
  );
});