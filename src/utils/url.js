export const getUrlBase = (path = "") => {
  const l = window.location;

  if (!/^\/(br_)/.test(l.pathname)) return path;

  return `/${l.pathname.split("/")[1]}${/^\//.test(path) ? path : `/${path}`}`;
};
