"use client";

import { Box, Divider, IconButton, MenuItem, Typography } from "@mui/material";
import { CustomPopover, usePopover } from "../shared/popover";
import MemberAvatar from "../shared/Avatar";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import useAuth from "../../../store/useAuth";

const getAvatarUrl = (avatar: string | null | undefined) => {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }

  return `https://real-estate-lab.s3.eu-north-1.amazonaws.com/${avatar}`;
};

export default function Profile() {
  const popover = usePopover();
  const router = useRouter();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    popover.onClose();
    await logout();
    router.push("/login");
  };

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
        <MemberAvatar
          user={{
            name:
              user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.email || "User",
            avatar: getAvatarUrl(user?.avatar),
          }}
          size={35}
          style={{ margin: "0 auto" }}
        />
      </IconButton>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={anchorRef.current}
        sx={{ width: 240, p: 0 }}
      >
        <Box
          sx={{
            p: 2,
            pb: 1.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MemberAvatar
            user={{
              name:
                user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.email || "User",
              avatar: getAvatarUrl(user?.avatar),
            }}
            size={60}
          />
          <Typography variant="subtitle2" noWrap>
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.email || "User"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.email}
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
