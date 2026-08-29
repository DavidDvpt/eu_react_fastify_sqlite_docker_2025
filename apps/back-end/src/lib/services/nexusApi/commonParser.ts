export const arrayParser = <T, K>(tab: T[], func: (t: T) => K): K[] => {
  return tab.map((m) => func(m));
};
