'use client';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  MapIcon,
  BookOpenIcon,
  UsersIcon,
  QueueListIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Combat', href: '/dashboard/combat', icon: ExclamationTriangleIcon},
  { name: 'Players', href: '/dashboard/players', icon: UserGroupIcon },
  { name: 'NPCs: Coming Soon', href: '/dashboard/npcs', icon: UsersIcon },
  { name: 'Map: Coming Soon', href: '/dashboard/maps', icon: MapIcon },
  { name: 'Quests: Coming Soon', href: '/dashboard/quests', icon: BookOpenIcon},
  { name: 'Past Sessions: Coming Soon', href: '/dashboard/sessions', icon: DocumentDuplicateIcon },
  { name: 'Stat Check: Coming Soon', href: '/dashboard/statcheck', icon: QueueListIcon },
]

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
