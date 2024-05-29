import { BoltIcon } from '@heroicons/react/24/solid';
import { lusitana } from '@/app/ui/fonts';

export default function FalloutLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <BoltIcon className="h-12 w-12 rotate-[15deg] text-white" />
      <p className="text-[44px]">Fallout</p>
    </div>
  );
}
