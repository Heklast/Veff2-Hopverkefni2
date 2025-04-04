import { Suspense } from 'react';
import HomeClient from './homeClient';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Hleð vefverslun...</div>}>
      <HomeClient />
    </Suspense>
  );
}