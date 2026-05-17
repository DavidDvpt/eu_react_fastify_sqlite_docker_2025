const getScopeLabel = (rowUserId: string | null | undefined, currentUserId?: string): string => {
  if (!rowUserId) {
    return 'System';
  }

  if (currentUserId && rowUserId === currentUserId) {
    return 'Custom';
  }

  return 'System';
};

export { getScopeLabel };
