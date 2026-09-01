import { requireSession } from '@/lib/auth';
import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const session = await requireSession();

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-heading-1">Perfil</h1>
      <ProfileForm
        defaultValues={{
          name: session.user.name,
          personType: session.user.personType,
          document: session.user.document,
        }}
      />
    </div>
  );
}
