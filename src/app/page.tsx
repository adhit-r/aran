import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  return null; // Redirect will prevent this from rendering
}
