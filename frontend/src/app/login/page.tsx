'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Login failed');
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      setSuccess('Innskráning tókst! Fer aftur á forsíðu...');
      setTimeout(() => {
        router.push('/?forceRefresh=true');
      }, 2000);
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.loginHeading + " " + styles.heading}>Innskráning</h1>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.message}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Sláðu inn tölvupóstfang"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Sláðu inn lykilorð"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Skrá inn
          </button>
        </form>
        <p>
          Ekki með reikning?{' '}
          <Link href="/signup" className={styles.link}>
            Nýskrá
          </Link>
        </p>
      </div>
    </main>
  );
}
