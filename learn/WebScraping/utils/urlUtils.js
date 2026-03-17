export const normalizeUrl = (url) => {
  return url.split("#")[0].replace(/\/$/, "");
};

export function isInternalLink(baseUrl, linkUrl) {
  try {
    return new URL(linkUrl).origin === new URL(baseUrl).origin;
  } catch (error) {
    return false;
  }
}
