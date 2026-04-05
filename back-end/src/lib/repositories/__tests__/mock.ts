const usersMock = () => [
  {
    firstname: 'John',
    lastname: 'Doe',
    pseudo: `john-${Date.now()}`,
    password_hash: 'hashed',
    email: `doe-${Date.now()}-${Math.random().toString(16).slice(2, 6)}@test.com`,
    role: 'ADMIN' as const,
    date_created: new Date().toISOString(),
    date_updated: null,
    is_active: true,
  },
  {
    firstname: 'Marie',
    lastname: 'Doerty',
    pseudo: `marie-${Date.now()}`,
    email: `doerty-${Date.now()}-${Math.random().toString(16).slice(2, 6)}@test.com`,
    password_hash: 'hashed',
    role: 'USER' as const,
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

const itemMock = (typeId: string) => [
  {
    item_type_id: typeId,
    date_created: new Date().toISOString(),
    date_updated: null,
    is_active: true,
    is_limited: true,
    name: `Item-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    value: 1.23,
    image_url_id: `ItemImage-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
  },
  {
    item_type_id: typeId,
    date_created: new Date().toISOString(),
    date_updated: null,
    is_active: true,
    is_limited: true,
    name: `Item-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    value: 2.34,
    image_url_id: `ItemImage-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
  },
];

export { itemCategoriesMock, itemMock, itemTypesMock, usersMock };
