import React, { useState, useCallback, useEffect } from "react";
import { useCurrentEditor } from "@tiptap/react";
import { TextField, Tooltip, Typography, styled, Grid } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { CustomPopover, usePopover } from "@/components/shared/popover";

const presetColors = [
  "#000000",
  "#E57353",
  "#F4A261",
  "#F9C74F",
  "#90BE6D",
  "#43AA8B",
  "#4ECBC4",
  "#00B4D8",
  "#4573D2",
  "#A69FF3",
  "#CD95EA",
  "#FC6D6D",
];

const Trigger = styled("div")`
  width: 25px;
  height: 25px;
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
`;

const PopoverContent = styled("div")`
  padding: 12px;
  max-width: 220px;
`;

const ColorButton = styled("button")<{ $color: string; $selected: boolean }>`
  background-color: ${({ $color }) => $color};
  width: 24px;
  height: 24px;
  border-radius: 5px;
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.palette.primary.main : theme.palette.divider};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export function ColorPickerInput() {
  const { editor } = useCurrentEditor();

  const value = editor?.getAttributes("textStyle").color || "#000000";

  const [textInput, setTextInput] = useState(value);
  const [inputError, setInputError] = useState("");

  const popover = usePopover();
  const isValidHex = useCallback(
    (color: string) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color),
    []
  );

  const setColor = useCallback(
    (color: string) => {
      setTextInput(color);
      setInputError("");
      editor?.chain().focus().setColor(color).run();
    },
    [editor]
  );

  useEffect(() => {
    setTextInput(value);
  }, [value]);

  return (
    <>
      <Tooltip title="Color picker" arrow placement="top">
        <Trigger onClick={popover.onOpen} style={{ backgroundColor: value }} />
      </Tooltip>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <PopoverContent>
          <HexColorPicker
            color={value}
            onChange={(color) => isValidHex(color) && setColor(color)}
            style={{ width: "100%" }}
          />

          <TextField
            fullWidth
            margin="dense"
            placeholder="#000000"
            variant="outlined"
            size="small"
            value={textInput}
            onChange={(e) => {
              const newValue = e.target.value;
              setTextInput(newValue);

              if (isValidHex(newValue)) {
                setColor(newValue);
              } else {
                setInputError("Invalid hex code.");
              }
            }}
            error={!!inputError}
            helperText={inputError}
          />

          <Grid container spacing={1} mt={1} justifyContent="center">
            {presetColors.map((color) => (
              <Grid key={color}>
                <ColorButton
                  $color={color}
                  $selected={value === color}
                  onClick={() => setColor(color)}
                >
                  {value === color && (
                    <Typography
                      component="span"
                      sx={{ color: "#fff", fontSize: 12 }}
                    >
                      ✓
                    </Typography>
                  )}
                </ColorButton>
              </Grid>
            ))}
          </Grid>
        </PopoverContent>
      </CustomPopover>
    </>
  );
}
