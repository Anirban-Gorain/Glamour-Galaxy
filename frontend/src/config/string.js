export function capitalize(str) {
  if (!str) return;

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function replaceAll(what, by, str) {
  if (!str) return;

  const regex = new RegExp(what, "g");
  str = str.replace(regex, by);
  return str;
}
