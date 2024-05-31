import CardWrapper from '@/app/ui/players/cards';
import {
  CardsSkeleton,
} from '@/app/ui/skeletons';
import { Suspense } from 'react';

export default function Page() {
    return (
      <>
        <h1 className="text-2xl font-semibold mb-6">Players: Coming Soon</h1>
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </>
    )
  }