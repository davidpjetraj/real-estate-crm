import { Chip as MuiChip, useTheme } from '@mui/material';

export function Chip({ label, color }: { label: string; color: string }) {
  const theme = useTheme();
  return (
    <MuiChip
      size="small"
      label={label}
      style={{
        backgroundColor: color,
        fontWeight: 600,
        color: theme.palette.getContrastText(color),
      }}
    />
  );
}
