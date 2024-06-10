import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { cookies } from 'next/headers'

export default async function Page() {

  const admin = cookies().get('admin')?.value === 'true' ? true : false;
  let name = cookies().get('name')?.value;
  if(name == undefined){
    let name = cookies().get('email')?.value;
  }

  if(!admin){
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome back {name || '!'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Quests</h2>
          <Link href="/dashboard/quests/add-item" className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
            <span>Create a new quest</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Battle</h2>
          <Link href="/dashboard/combat/new" className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
            <span>Start a new battle</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Map</h2>
          <Link href="/dashboard/map/add-item" className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
            <span>Add encounters to the map</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
      </div>
      </div>
    );
  }
  return (
    <main>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Quests</h2>
          <Link href="/dashboard/quests/add-item" className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
            <span>Create a new quest</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Battle</h2>
          <Link href="/dashboard/combat/new" className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
            <span>Start a new battle</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Map</h2>
          <Link href="/dashboard/map/add-item" className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
            <span>Add encounters to the map</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
      </div>
      </div>
    </main>
  );
}