export const getUri = (path: string) => {
  if (!path) {
    return "";
  }

  if (path?.startsWith("/images/dummy/")) {
    return path;
  }

  // Use NEXT_PUBLIC_GC_PUBLIC if available, otherwise fallback to NEXT_PUBLIC_API
  const baseUrl =
    process.env.NEXT_PUBLIC_GC_PUBLIC || process.env.NEXT_PUBLIC_API;
  if (!baseUrl) {
    console.warn(
      "Neither NEXT_PUBLIC_GC_PUBLIC nor NEXT_PUBLIC_API is defined"
    );
    return path; // Return the path as-is if no base URL is available
  }

  const finalUrl = `${baseUrl.replace(/\/$/, "")}/${path}`;
  console.log("getUri - Input path:", path);
  console.log("getUri - Base URL:", baseUrl);
  console.log("getUri - Final URL:", finalUrl);
  return finalUrl;
};
