export const getUri = (path: string) => {
  if (!path) {
    return "";
  }

  if (path?.startsWith("/images/dummy/")) {
    return path;
  }

  // If path is already a full URL, return it as-is
  if (path?.startsWith("http://") || path?.startsWith("https://")) {
    return path;
  }

  // Use S3 bucket URL as the primary source
  const baseUrl =
    process.env.NEXT_PUBLIC_S3_BUCKET_URL ||
    "https://real-estate-lab.s3.eu-north-1.amazonaws.com";

  const finalUrl = `${baseUrl.replace(/\/$/, "")}/${path}`;
  console.log("getUri - Input path:", path);
  console.log("getUri - Base URL:", baseUrl);
  console.log("getUri - Final URL:", finalUrl);
  return finalUrl;
};
