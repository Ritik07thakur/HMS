
import { redirect } from 'next/navigation';

export default function AdminHmsRedirectPage() {
  redirect('/admin/dashboard');
  // This return is technically unreachable due to the redirect,
  // but Next.js/React might require a component to return JSX.
  return null;
}
