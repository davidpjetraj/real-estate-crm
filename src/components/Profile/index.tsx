"use client";

import { Box, Divider, IconButton, MenuItem, Typography } from "@mui/material";
import { CustomPopover, usePopover } from "../shared/popover";
import MemberAvatar from "../shared/Avatar";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/lib/graphql/user";

export default function Profile() {
  const popover = usePopover();
  const router = useRouter();
  const anchorRef = useRef<HTMLButtonElement>(null);

  const { data } = useQuery(GET_CURRENT_USER);

  const handleLogout = () => {
    popover.onClose();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  // Use real user data if available, otherwise show loading or fallback
  const user = data?.me;
  const displayName = user
    ? `${user.first_name} ${user.last_name}`
    : "Loading...";
  const displayEmail = user?.email || "";

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
        <MenuItem sx={{ m: 1 }} onClick={popover.onClose}>
          Preferences
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
