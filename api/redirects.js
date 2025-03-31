// API route for handling language redirects
module.exports = (req, res) => {
  const { headers } = req;
  const acceptLanguage = headers["accept-language"] || "";

  // Extract the browser's preferred language
  const preferredLanguage = acceptLanguage
    .split(",")[0]
    .split("-")[0]
    .toLowerCase();

  // Map the preferred language to our supported languages
  let redirectLang = "en"; // Default to English

  if (preferredLanguage === "es") {
    redirectLang = "es";
  } else if (preferredLanguage === "pt") {
    redirectLang = "pt";
  } else if (preferredLanguage === "th") {
    redirectLang = "th";
  } else if (preferredLanguage === "vi") {
    redirectLang = "vi";
  }

  // Redirect to the appropriate language version
  res.setHeader("Location", `/${redirectLang}`);
  res.status(302).end();
};
