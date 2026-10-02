import { expect, test } from '@playwright/test';

test('landing → entrar → esqueci minha senha', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('banner').getByRole('link', { name: 'Entrar' }).click();
  await expect(page).toHaveURL('/sign-in');

  await page.getByRole('link', { name: 'Esqueci minha senha' }).click();
  await expect(page).toHaveURL('/forgot-password');

  await page.getByLabel('E-mail').fill('nao-existe@alugasim.test');
  await page.getByRole('button', { name: 'Enviar link' }).click();
  await expect(page.getByText(/Se esse e-mail estiver cadastrado/)).toBeVisible();
});
