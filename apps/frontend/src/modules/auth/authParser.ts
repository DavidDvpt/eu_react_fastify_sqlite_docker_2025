type MeApiResponse = {
  id: string;
  pseudo: string;
  role: UserRoleType | string | null;
  email?: string;
  date_created?: string;
  is_active?: boolean;
  isActive?: boolean;
};

async function meParser(data: MeApiResponse) {
  try {
    if (!data) throw new Error("No data found");
    if (!data.id) throw new Error("No userId found");
    if (!data.pseudo) throw new Error("No pseudo found");
    if (!data.role) throw new Error("No role found");

    const user = {
      id: data.id,
      pseudo: data.pseudo,
      role: data.role as UserRoleType,
      // The generated MeResponse does not currently expose the active flag.
      isActive: data.is_active ?? data.isActive ?? true,
    };

    return user;
  } catch (error) {
    return Promise.reject(error);
  }
}

export { meParser };
