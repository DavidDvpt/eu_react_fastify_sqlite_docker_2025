async function meParser(data: UserApi) {
  try {
    if (!data) throw new Error("No data found");
    if (!data.id) throw new Error("No userId found");
    if (!data.pseudo) throw new Error("No pseudo found");
    if (!data.role) throw new Error("No role found");

    const user = {
      id: data.id,
      pseudo: data.pseudo,
      role: data.role,
      isActive: data.is_active,
    };

    return user;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function userParser(data: UserApi) {
  try {
    if (!data) throw new Error("No data found");
    if (!data.id) throw new Error("No userId found");
    if (!data.pseudo) throw new Error("No pseudo found");
    if (!data.email) throw new Error("No email found");
    if (!data.role) throw new Error("No role found");

    const user = {
      id: data.id,
      firstname: data.firstname ?? null,
      lastname: data.lastname ?? null,
      pseudo: data.pseudo,
      email: data.email,
      role: data.role,
      createdAt: data.date_created,
      updatedAt: data.date_updated ?? null,
      isActive: data.is_active,
    };

    return user;
  } catch (error) {
    return Promise.reject(error);
  }
}

export { meParser, userParser };
