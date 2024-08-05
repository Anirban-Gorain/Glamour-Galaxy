export function oneSentence(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function convertToNumber(str) {
  return Number(str.toString().replace(/\D/g, ""));
}
