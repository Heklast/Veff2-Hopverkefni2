'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Signup.module.css';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Signup failed');
        return;
      }

      await res.json();
      setSuccess('Signup successful! Redirecting to login...');
      // Redirect to login after a short delay to allow user to read the message.
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Nýskráning</h1>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.message}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Sláðu inn notendanafn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
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
            Nýskrá
          </button>
        </form>
        <p>
          Nú þegar með reikning?{' '}
          <Link href="/login" className={styles.link}>
            Innskráning
          </Link>
        </p>
      </div>
    </main>
  );
}
