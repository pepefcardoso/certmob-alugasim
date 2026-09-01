import { TenantForm } from '../tenant-form';

export default function NewTenantPage() {
  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-heading-1">Novo locatário</h1>
      <TenantForm />
    </div>
  );
}
