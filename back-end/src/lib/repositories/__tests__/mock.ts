const baseUser = () => ({
  firstname: "John",
  lastname: "Doe",
  pseudo: `john-${Date.now()}`,
  password_hash: "hashed",
  role: "ADMIN" as const,
  date_created: new Date().toISOString(),
  date_updated: null,
  is_active: true,
});

export { baseUser };
