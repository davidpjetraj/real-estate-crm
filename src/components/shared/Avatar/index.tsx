import { CheckIcon } from "@/components/icons/CheckIcon";
import { getUri } from "@/components/utils/getUri";
import { AccountModel } from "@/lib/graphql/generated/graphql";
import MuiAvatar from "@mui/material/Avatar";

export default function MemberAvatar({
  user,
  size = 36,
  style,
  showCompleted = false,
  completed = false,
}: {
  user: AccountModel;
  size?: number;
  style?: any;
  showCompleted?: boolean;
  completed?: boolean;
}) {
  const userInitial = user?.name && user.name.length > 0 ? user.name[0] : "?";
  const disabledStyles = completed
    ? {
        bgcolor: "#e0e0e0 !important",
        color: "#9e9e9e !important",
        opacity: 0.6,
      }
    : {};

  if (!user) {
    return null;
  }

  const avatarCompleted = () => {
    return (
      <MuiAvatar
        alt={user?.name as string}
        src={""}
        sx={[
          {
            width: size,
            height: size,
            fontSize: size,
            minWidth: size,
            bgcolor: "#66a88b",
          },
          style,
        ]}
        style={{
          fontSize: size / 2,
          textTransform: "uppercase",
        }}
      >
        <CheckIcon />
      </MuiAvatar>
    );
  };
  const renderAvatar = () => {
    return (
      <MuiAvatar
        alt={user?.name as string}
        src={getUri(user?.avatar as string)}
        sx={[
          {
            width: size,
            height: size,
            fontSize: size,
            minWidth: size,
            color: "#fff",
            bgcolor: "primary.main",
            ...disabledStyles,
          },
          style,
        ]}
        style={{
          fontSize: size / 2,
          textTransform: "uppercase",
        }}
      >
        {userInitial}
      </MuiAvatar>
    );
  };

  if (showCompleted) {
    return avatarCompleted();
  }

  return renderAvatar();
}
