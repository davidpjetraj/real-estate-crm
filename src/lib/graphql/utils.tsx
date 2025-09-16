"use client";
import { getCookie, setCookie } from "cookies-next";

export const hasValue = (value: any) => {
  if (
    value == "null" ||
    value == undefined ||
    value == "undefined" ||
    value == null ||
    value == ""
  ) {
    return false;
  }
  return value;
};

export const getTokens = async () => {
  // First try to get from cookies
  let access_token = getCookie("access_token");
  let refresh_token = getCookie("refresh_token");

  // If not found in cookies, try localStorage (for backward compatibility)
  if (!hasValue(access_token) && typeof window !== "undefined") {
    const localAccessToken = localStorage.getItem("access_token");
    if (localAccessToken) {
      access_token = localAccessToken;
    }
  }
  if (!hasValue(refresh_token) && typeof window !== "undefined") {
    const localRefreshToken = localStorage.getItem("refresh_token");
    if (localRefreshToken) {
      refresh_token = localRefreshToken;
    }
  }

  const result = {
    access_token: hasValue(access_token),
    refresh_token: hasValue(refresh_token),
  };

  return result;
};

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export const setTokens = async (payload: Tokens) => {
  if (hasValue(payload.access_token) && hasValue(payload.refresh_token)) {
    console.log("setTokens - storing tokens:", {
      access_token: payload.access_token.substring(0, 20) + "...",
      refresh_token: payload.refresh_token.substring(0, 20) + "...",
    });

    // Set cookies with a specific expiration
    setCookie("access_token", payload.access_token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/", // Make the cookie available site-wide
    });

    setCookie("refresh_token", payload.refresh_token, {
      maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
      path: "/", // Make the cookie available site-wide
    });

    // Also store in localStorage for backward compatibility
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", payload.access_token);
      localStorage.setItem("refresh_token", payload.refresh_token);
    }
  }
};

export const removeTokens = async () => {
  setCookie("access_token", "");
  setCookie("refresh_token", "");
};

export const extractNodes = (data: any) => {
  return data?.edges?.map((edge: any) => edge?.node) || [];
};

export const extractPageInfo = (data: any) => {
  return {
    startCursor: data?.pageInfo?.startCursor,
    endCursor: data?.pageInfo?.endCursor,
    hasNextPage: data?.pageInfo?.hasNextPage,
    hasPreviousPage: data?.pageInfo?.hasPreviousPage,
  };
};
