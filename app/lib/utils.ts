import UUID from 'crypto';
import { Player, Enemy } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const generateUUID = (): string => {
  return UUID.randomUUID().toString();
};

export const getXPFromLevelAndType = (level: number, type: string) => {
  switch(type) {
    case 'Normal':
      return 3 + (level * 7);
    case 'Mighty':
      return 6 + (level * 14);
    case 'Legendary':
      return 9 + (level * 21);
  }
  return 0;
}

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const getInitiative = (entity: Player | Enemy) => {
  return entity.special[1] + entity.special[5]; // Perception + Agility
}

export const getTurnOrder = (entities: (Player | Enemy)[]) => {
  const order = entities.sort((a, b) => getInitiative(b) - getInitiative(a));
  return order.map(entity => entity.id);
}

export const wrapInGreen = (text: string) => `<span class="text-green-500">${text}</span>`;
export const wrapInRed = (text: string) => `<span class="text-red-500">${text}</span>`;
export  const wrapInYellow = (text: string) => `<span class="text-yellow-500">${text}</span>`;
export const wrapInBlue = (text: string) => `<span class="text-blue-500">${text}</span>`;

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
