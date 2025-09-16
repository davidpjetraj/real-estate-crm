import {
  Box,
  Grid,
  IconButton,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import { useField } from "formik";
import { useState } from "react";

const colors = [
  "#F06A6A",
  "#EC8D71",
  "#F1BD6C",
  "#F8DF72",
  "#B3DF97",
  "#83C9A9",
  "#4ECBC4",
  "#9EE7E3",
  "#4573D2",
  "#A69FF3",
  "#CD95EA",
  "#F9AAEF",
  "#F26FB2",
  "#FC979A",
];

export function ColorPickerInput({ name }: { name: string }) {
  const [field, , helpers] = useField(name);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const selectedColor = field.value || colors[0];

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorSelect = (color: string) => {
    helpers.setValue(color);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Box
        onClick={handleClick}
        sx={{
          width: "45.13px",
          height: "45.13px",
          borderRadius: "10px",
          backgroundColor: selectedColor,
          border: `2px solid rgba(255, 255, 255, 0.08)`,
          cursor: "pointer",
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box padding={1} maxWidth="232px">
          <Grid container maxWidth="232px" spacing={1}>
            {colors.map((color) => (
              <Grid key={color}>
                <IconButton
                  onClick={() => handleColorSelect(color)}
                  sx={{
                    backgroundColor: color,
                    width: 24,
                    height: 24,
                    borderRadius: "5px",
                    border:
                      selectedColor === color
                        ? `1px solid ${theme.palette.primary.main}`
                        : `1px solid ${theme.palette.divider}`,
                    transition: "border-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: color,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  {selectedColor === color && (
                    <Typography
                      component="span"
                      sx={{
                        color: "#fff",
                        fontSize: 12,
                        lineHeight: 1,
                      }}
                    >
                      &#10003;
                    </Typography>
                  )}
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </Box>
  );
}
