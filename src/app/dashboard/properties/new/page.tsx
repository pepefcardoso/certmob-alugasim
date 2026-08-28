import { PropertyForm } from '../property-form';

export default function NewPropertyPage() {
  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Novo imóvel</h1>
      <PropertyForm />
    </div>
  );
}
