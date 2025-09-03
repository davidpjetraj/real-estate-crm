"use client";

import { Avatar, AvatarProps } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

interface MemberAvatarProps extends Omit<AvatarProps, "children"> {
  user?: {
    name?: string | null;
    avatar?: string | null;
  };
  size?: number;
}

export default function MemberAvatar({
  user,
  size = 40,
  ...other
}: MemberAvatarProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (user?.avatar) {
    return (
      <Avatar
        src={user.avatar}
        alt={user.name || "User"}
        sx={{ width: size, height: size }}
        {...other}
      />
    );
  }

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: "primary.main",
        fontSize: size * 0.4,
      }}
      {...other}
    >
      {user?.name ? getInitials(user.name) : <PersonIcon />}
    </Avatar>
  );
}
