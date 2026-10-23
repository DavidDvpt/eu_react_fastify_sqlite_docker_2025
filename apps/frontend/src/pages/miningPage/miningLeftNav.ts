import type { NavbarButtonType } from '@/shared/types';

const MINING_NAV_LINKS: NavbarButtonType[] = [
  {
    key: 'Créer',
    content: 'Créer',
    route: '/mining/create',
    variant: 'navVertical',
  },
  {
    key: 'Sessions',
    content: 'Sessions',
    route: '/mining',
    variant: 'navVertical',
  },
  {
    key: 'En cours',
    content: 'En cours',
    route: '/mining/current',
    variant: 'navVertical',
  },
];

export { MINING_NAV_LINKS };
