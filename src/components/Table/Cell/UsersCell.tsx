'use client';
import { Avatar, AvatarGroup, styled, Tooltip, useTheme } from '@mui/material';

const Wrapper = styled('div')<{ noHover?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    background: ${({ noHover, theme }) =>
      noHover === true ? 'none' : theme.palette.action.hover};
    border: 1px solid
      ${({ noHover, theme }) =>
        noHover === true ? 'none' : theme.palette.action.selected};
  }
`;

export function UsersCell({ data, noHover }: { data: any; noHover?: boolean }) {
  const theme = useTheme();
  const maxAvatars = 4;
  if (!data) return null;

  const ExtraUsersTooltip = () => (
    <div>
      {data.slice(maxAvatars).map((user: any, index: number) => (
        <div key={index}>
          {user.first_name} {user.last_name}
        </div>
      ))}
    </div>
  );

  const extraUsersCount = data.length - maxAvatars;

  return (
    <Wrapper noHover={noHover}>
      <AvatarGroup
        max={maxAvatars}
        sx={{
          backgroundColor: data.user_color,
          '.MuiAvatar-root': {
            width: 30,
            height: 30,
          },
        }}>
        {/* Render the avatars up to maxAvatars-1 */}
        {data.slice(0, maxAvatars - 1).map((user: any, index: number) => (
          <Tooltip
            key={index}
            title={`${user.first_name} ${user.last_name}`}
            arrow>
            <Avatar
              src={user.avatar as string}
              style={{
                width: 30,
                height: 30,
                minWidth: 30,
                backgroundColor: user?.user_color,
                color: '#FFF',
                fontSize: 14,
                textTransform: 'uppercase',
              }}>
              {user?.first_name![0]}
            </Avatar>
          </Tooltip>
        ))}
        {extraUsersCount > 0 && (
          <Tooltip title={<ExtraUsersTooltip />} placement="right" arrow>
            <Avatar
              style={{
                width: 30,
                height: 30,
                minWidth: 30,
                backgroundColor: theme.palette.primary.light,
                color: '#FFF',
                fontSize: 14,
                textTransform: 'uppercase',
              }}>
              +{extraUsersCount}
            </Avatar>
          </Tooltip>
        )}
      </AvatarGroup>
    </Wrapper>
  );
}
