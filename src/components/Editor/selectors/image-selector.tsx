import { Tooltip } from "@mui/material";
import classNames from "classnames";
import { useCallback, useEffect, useRef } from "react";
import { useCurrentEditor } from "@tiptap/react";
import { getUri } from "@/components/utils/getUri";
import { getTokens } from "@/lib/graphql/utils";
import { EditorImageIcon } from "@/components/icons/editor";

export const ImageSelector = () => {
  const inputRef = useRef<any>(null);
  const { editor } = useCurrentEditor();

  useEffect(() => {
    inputRef.current?.focus();
  });

  const handleImageUpload = useCallback(async () => {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("files", file);

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API}/v1/files/upload-files`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${(await getTokens()).access_token}`,
                "x-lang": "en",
              },
              body: formData,
            }
          );
          const imageResponse = await res.json();
          const newUrls = imageResponse.map((item: any) => item.url);

          const singleUrl = newUrls[0];
          editor
            .chain()
            .focus()
            .setImage({ src: getUri(singleUrl) })
            .run();
        } catch (error) {
          console.error("Bild hochladen fehlgeschlagen:", error);
        }
      }
    };
    input.click();
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      <Tooltip
        title="Foto"
        placement="top"
        arrow
        disableFocusListener
        disableTouchListener
      >
        <button
          type="button"
          onClick={handleImageUpload}
          className={classNames({
            "bubble-button": true,
            active: editor.isActive("image"),
          })}
        >
          <EditorImageIcon />
        </button>
      </Tooltip>
    </>
  );
};
