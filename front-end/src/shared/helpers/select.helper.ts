export const selectOptionHelper = (id: string, label: string) => ({
  value: id,
  label,
});
export const selectOptionsHelper = (values: { id: string; name: string }[]) =>
  values.map((v) => selectOptionHelper(v.id, v.name));
