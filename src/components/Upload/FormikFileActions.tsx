import {
  CircularProgress,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "sonner";
import { CustomPopover, usePopover } from "../shared/popover";
import { getTokens } from "@/lib/graphql/utils";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";

export default function FileActions({
  name,
  fileName,
  setFiles,
  item,
  onChange,
}: any) {
  const popover = usePopover();

  const [downloading, setDownloading] = useState(false);

  const handleRemoveFile = (fileId: string) => {
    setFiles((prevFiles: any) => {
      const updatedFiles = prevFiles.filter((file: any) => file.id !== fileId);

      onChange(
        name,
        updatedFiles.map((file: any) => file)
      );

      return updatedFiles;
    });
  };

  async function downloadFile() {
    try {
      setDownloading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/v1/private-files/${item?.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${(await getTokens()).access_token}`,
            "x-lang": "en",
          },
        }
      );

      const blob = new Blob([await response.blob()], {
        type: response?.headers?.get("content-type") || "",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      link.download = decodeURIComponent(fileName) || "downloaded-file";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (error) {
      setDownloading(false);
      console.error("Fehler beim Verarbeiten des Dokuments: ", error);
      toast.error("Etwas ist schiefgelaufen");
    }
  }

  return (
    <>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          popover.onOpen();
        }}
      >
        <ChevronDownIcon />
      </IconButton>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
        }}
        sx={{
          padding: 0,
          overflow: "hidden",
        }}
      >
        <List
          disablePadding
          sx={{
            padding: 0,
          }}
        >
          <ListItemButton onClick={() => downloadFile()}>
            {downloading && (
              <CircularProgress
                size={16}
                color="inherit"
                sx={{ marginRight: "6px" }}
              />
            )}
            <ListItemText
              primary={downloading ? "Herunterladen" : "Herunterladen"}
            />
          </ListItemButton>
          <ListItemButton
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile(item?.id);
            }}
            sx={{
              color: "error.main",
            }}
          >
            <ListItemText primary="Löschen" />
          </ListItemButton>
        </List>
      </CustomPopover>
    </>
  );
}
