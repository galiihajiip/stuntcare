import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByText('Masuk ke STUNTCARE')).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByText('Daftar STUNTCARE')).toBeVisible();
  });

  test('should show validation errors for empty login', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: 'Masuk' }).click();
    
    // HTML5 validation should prevent submission
    const emailInput = page.getByPlaceholder('nama@email.com');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByText('Daftar sekarang').click();
    await expect(page).toHaveURL(/.*register/);
    
    await page.getByText('Masuk di sini').click();
    await expect(page).toHaveURL(/.*login/);
  });
});
