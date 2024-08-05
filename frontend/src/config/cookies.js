function setCookie(name, value, expirationDays) {
  const d = new Date();
  d.setTime(d.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookieValue(cookieName) {
  // Split cookies by semicolon and trim spaces
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

  // Find the cookie with the given name
  const cookie = cookies.find((cookie) => cookie.startsWith(cookieName + "="));

  if (cookie) {
    // Extract and return the value of the cookie
    return cookie.substring(cookieName.length + 1);
  } else {
    // Return null if cookie with the given name is not found
    return null;
  }
}

function deleteCookie(name) {
  document.cookie =
    name + "=" + ";" + "expires=Thu, 01 Jan 1970 00:00:01 GMT;" + ";path=/";
}

export { setCookie, getCookieValue, deleteCookie };
