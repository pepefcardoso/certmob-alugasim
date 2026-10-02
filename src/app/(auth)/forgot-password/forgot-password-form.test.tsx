import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { ForgotPasswordForm } from './forgot-password-form';
import { requestPasswordReset } from '@/lib/auth-client';

vi.mock('@/lib/auth-client', () => ({ requestPasswordReset: vi.fn() }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('valida o e-mail antes de enviar', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText('E-mail'), 'abc');
    await user.click(screen.getByRole('button', { name: 'Enviar link' }));

    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument();
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  it('envia com redirectTo e mostra a mensagem neutra', async () => {
    vi.mocked(requestPasswordReset).mockResolvedValue({
      data: { status: true },
      error: null,
    } as never);
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com');
    await user.click(screen.getByRole('button', { name: 'Enviar link' }));

    expect(requestPasswordReset).toHaveBeenCalledWith({
      email: 'ana@exemplo.com',
      redirectTo: '/reset-password',
    });
    expect(await screen.findByText(/Se esse e-mail estiver cadastrado/)).toBeInTheDocument();
  });

  it('mostra toast quando a API falha', async () => {
    vi.mocked(requestPasswordReset).mockResolvedValue({
      data: null,
      error: { message: 'x' },
    } as never);
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com');
    await user.click(screen.getByRole('button', { name: 'Enviar link' }));

    await vi.waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(screen.queryByText(/Se esse e-mail estiver cadastrado/)).not.toBeInTheDocument();
  });
});
