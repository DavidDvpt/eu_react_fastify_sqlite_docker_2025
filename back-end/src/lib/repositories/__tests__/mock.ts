const usersMock = () => [
  {
    firstname: "John",
    lastname: "Doe",
    pseudo: `john-${Date.now()}`,
    password_hash: "hashed",
    role: "ADMIN" as const,
    date_created: new Date().toISOString(),
    date_updated: null,
    is_active: true,
  },
  {
    firstname: "Marie",
    lastname: "Doerty",
    pseudo: `marie-${Date.now()}`,
    password_hash: "hashed",
    role: "USER" as const,
    date_created: new Date().toISOString(),
    date_updated: null,
    is_active: true,
  },
];

const itemCategoriesMock = () => [
  {
    date_created: new Date().toISOString(),
    date_updated: null,
    is_active: true,
    name: `Material-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
  },
  {
    date_created: new Date().toISOString(),
    date_updated: null,
    is_active: true,
    name: `Tools-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
  },
];

const itemTypesMock = (categoryId: string) => {
  const base = `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
  return [
    {
      category_id: categoryId,
      date_created: new Date().toISOString(),
      date_updated: null,
      is_active: true,
      name: `Type-${base}-a`,
    },
    {
      category_id: categoryId,
      date_created: new Date().toISOString(),
      date_updated: null,
      is_active: true,
      name: `Type-${base}-b`,
    },
  ];
};

export { itemCategoriesMock, itemTypesMock, usersMock };
