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

export { meParser };
