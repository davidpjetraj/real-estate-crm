"use client";

import { Box, Divider, IconButton, MenuItem, Typography } from "@mui/material";
import { CustomPopover, usePopover } from "../shared/popover";
import MemberAvatar from "../shared/Avatar";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import { useAccountQuery } from "../../lib/graphql/generated/graphql";
import { useUserData } from "../../hooks/use-user-data";

export default function Profile() {
  const popover = usePopover();
  const router = useRouter();
  const anchorRef = useRef<HTMLButtonElement>(null);

  // Use the user store for managing user data
  const { userData } = useUserData();
  const { data, error } = useAccountQuery();

  const handleLogout = () => {
    popover.onClose();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  // Handle expired token only (not permission issues)
  useEffect(() => {
    if (
      error &&
      error.message.includes("Unauthorized") &&
      !error.message.includes("autorizimin")
    ) {
      console.log("Token expired, redirecting to login...");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/login");
    }
  }, [error, router]);

  // Use real user data if available, otherwise show loading or fallback
  const user = data?.account;

  // Use user data from query if available, otherwise fallback to user store
  const displayName = user
    ? `${user.first_name} ${user.last_name}`
    : userData?.first_name && userData?.last_name
    ? `${userData.first_name} ${userData.last_name}`
    : "Loading...";
  const displayEmail = user?.email || userData?.email || "";

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={popover.onOpen}
        style={{
          borderRadius: 50,
          padding: 3,
        }}
      >
        <MemberAvatar user={user} size={35} style={{ margin: "0 auto" }} />
      </IconButton>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={anchorRef.current}
        sx={{ width: 240, p: 0 }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {displayEmail}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          sx={{ m: 1 }}
          onClick={() => {
            popover.onClose();
            router.push("/settings");
          }}
        >
          Profile Settings
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem sx={{ m: 1 }} onClick={popover.onClose}>
          Security
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem sx={{ m: 1, color: "error.main" }} onClick={handleLogout}>
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}
