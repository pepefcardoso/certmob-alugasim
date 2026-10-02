import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { SignUpForm } from './sign-up-form';

export default async function SignUpPage() {
  if (await getSession()) redirect('/dashboard');
  return <SignUpForm />;
}
