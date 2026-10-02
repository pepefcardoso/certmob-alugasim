import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResetPasswordForm } from './reset-password-form';
import { resetPassword } from '@/lib/auth-client';

vi.mock('@/lib/auth-client', () => ({ resetPassword: vi.fn() }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock }) }));

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('bloqueia quando as senhas não coincidem', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token="tok" />);

    await user.type(screen.getByLabelText('Nova senha'), 'SenhaForte123');
    await user.type(screen.getByLabelText('Confirmar nova senha'), 'Outra12345');
    await user.click(screen.getByRole('button', { name: 'Redefinir senha' }));

    expect(await screen.findByText('As senhas não coincidem')).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it('redefine com o token e redireciona para o login', async () => {
    vi.mocked(resetPassword).mockResolvedValue({ data: { status: true }, error: null } as never);
    const user = userEvent.setup();
    render(<ResetPasswordForm token="tok" />);

    await user.type(screen.getByLabelText('Nova senha'), 'SenhaForte123');
    await user.type(screen.getByLabelText('Confirmar nova senha'), 'SenhaForte123');
    await user.click(screen.getByRole('button', { name: 'Redefinir senha' }));

    await vi.waitFor(() =>
      expect(resetPassword).toHaveBeenCalledWith({ newPassword: 'SenhaForte123', token: 'tok' }),
    );
    await vi.waitFor(() => expect(pushMock).toHaveBeenCalledWith('/sign-in'));
  });
});
