import { notFound, redirect } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LoginForm from '@/components/quiz/LoginForm';
import { quizzesEnabled, isLocal, getTeacher, safeNext } from '@/lib/quiz/server';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Teacher sign in',
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }) {
  if (!quizzesEnabled()) notFound();
  const next = safeNext(searchParams?.next);
  if (await getTeacher()) redirect(next);
  return (
    <>
      <Nav />
      <LoginForm next={next} local={isLocal()} error={typeof searchParams?.error === 'string' ? searchParams.error : ''} />
      <Footer />
    </>
  );
}
