import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { SignInForm } from './sign-in-form';

export default async function SignInPage() {
  if (await getSession()) redirect('/dashboard');
  return <SignInForm />;
}
