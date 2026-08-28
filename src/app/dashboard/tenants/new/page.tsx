import { TenantForm } from '../tenant-form';

export default function NewTenantPage() {
  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Novo locatário</h1>
      <TenantForm />
    </div>
  );
}
