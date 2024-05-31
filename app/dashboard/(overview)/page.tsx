import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
 
export default async function Page() {
  // Remove `const latestInvoices = await fetchLatestInvoices()`
 
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
    </main>
  );
}