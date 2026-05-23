import { redirect } from 'next/navigation';

export default function Home() {
  // Server-side redirect to dashboard (auth guard is on client in admin layout)
  redirect('/dashboard');
}
