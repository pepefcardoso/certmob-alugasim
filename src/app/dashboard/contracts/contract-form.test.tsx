import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { ContractForm } from './contract-form';
import { createContract } from './actions';

vi.mock('./actions', () => ({
  createContract: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, back: vi.fn() }),
}));

vi.mock('@/components/ui/combobox', () => ({
  Combobox: ({
    options,
    value,
    onChange,
    placeholder,
  }: {
    options: { value: string; label: string }[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }) => (
    <select aria-label={placeholder} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      <option value="" />
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock('@/components/ui/date-picker', () => ({
  DatePicker: ({
    value,
    onChange,
  }: {
    value?: Date;
    onChange: (date: Date | undefined) => void;
  }) => (
    <input
      type="date"
      value={value ? value.toISOString().slice(0, 10) : ''}
      onChange={(e) =>
        onChange(e.target.value ? new Date(`${e.target.value}T00:00:00.000Z`) : undefined)
      }
    />
  ),
}));

const properties = [{ value: 'prop-1', label: 'Apartamento Centro' }];
const tenants = [{ value: 'tenant-1', label: 'Maria Silva' }];

function dateInputFor(labelText: string) {
  const label = screen.getByText(labelText);
  const input = label.parentElement?.querySelector('input[type="date"]');
  if (!input) throw new Error(`date input not found for label "${labelText}"`);
  return input as HTMLInputElement;
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText('Selecione um imóvel'), 'prop-1');
  await user.selectOptions(screen.getByLabelText('Selecione um locatário'), 'tenant-1');

  const rentInput = screen.getByLabelText('Valor do aluguel');
  await user.clear(rentInput);
  await user.type(rentInput, '2000');

  fireEvent.change(dateInputFor('Data base'), { target: { value: '2024-01-15' } });
  fireEvent.change(dateInputFor('Data de início'), { target: { value: '2024-02-01' } });
}

beforeEach(() => {
  vi.mocked(createContract).mockReset();
  vi.mocked(toast.success).mockReset();
  vi.mocked(toast.error).mockReset();
  pushMock.mockReset();
});

describe('ContractForm — client-side validation', () => {
  it('blocks submission and shows required-field errors when empty', async () => {
    const user = userEvent.setup();
    render(<ContractForm properties={properties} tenants={tenants} />);

    await user.click(screen.getByRole('button', { name: 'Salvar contrato' }));

    await waitFor(() => {
      expect(screen.getByText('Selecione um imóvel')).toBeInTheDocument();
      expect(screen.getByText('Selecione um locatário')).toBeInTheDocument();
      expect(screen.getByText('Valor deve ser maior que zero')).toBeInTheDocument();
    });
    expect(createContract).not.toHaveBeenCalled();
  });

  it('rejects a non-positive rent value', async () => {
    const user = userEvent.setup();
    render(<ContractForm properties={properties} tenants={tenants} />);

    const rentInput = screen.getByLabelText('Valor do aluguel');
    await user.clear(rentInput);
    await user.type(rentInput, '0');
    await user.click(screen.getByRole('button', { name: 'Salvar contrato' }));

    expect(await screen.findByText('Valor deve ser maior que zero')).toBeInTheDocument();
    expect(createContract).not.toHaveBeenCalled();
  });

  it('rejects an end date that is not after the start date', async () => {
    const user = userEvent.setup();
    render(<ContractForm properties={properties} tenants={tenants} />);

    await fillValidForm(user);
    fireEvent.change(dateInputFor('Data de término'), { target: { value: '2024-01-31' } });
    await user.click(screen.getByRole('button', { name: 'Salvar contrato' }));

    expect(
      await screen.findByText('Data de término deve ser depois da data de início'),
    ).toBeInTheDocument();
    expect(createContract).not.toHaveBeenCalled();
  });

  it('submits the coerced payload once every field is valid', async () => {
    const user = userEvent.setup();
    vi.mocked(createContract).mockResolvedValueOnce(undefined);
    render(<ContractForm properties={properties} tenants={tenants} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Salvar contrato' }));

    await waitFor(() => expect(createContract).toHaveBeenCalledTimes(1));
    expect(createContract).toHaveBeenCalledWith(
      expect.objectContaining({
        propertyId: 'prop-1',
        tenantId: 'tenant-1',
        rentValue: 2000,
        adjustmentIndex: 'IGPM',
      }),
    );
    expect(toast.success).toHaveBeenCalledWith('Contrato criado');
    expect(pushMock).toHaveBeenCalledWith('/dashboard/contracts');
  });
});

describe('ContractForm — cross-owner rejection (mocked)', () => {
  it('surfaces a generic error and does not navigate when the server rejects a tampered id', async () => {
    const user = userEvent.setup();
    vi.mocked(createContract).mockRejectedValueOnce(new Error('Imóvel não encontrado'));
    render(<ContractForm properties={properties} tenants={tenants} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Salvar contrato' }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao criar contrato'));
    expect(pushMock).not.toHaveBeenCalled();
  });
});
