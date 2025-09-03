export const getUri = (path: string) => {
  if (!path) {
    return "";
  }

  if (path?.startsWith("/images/dummy/")) {
    return path;
  }

  return `${process.env.NEXT_PUBLIC_GC_PUBLIC}/${path}`;
};
