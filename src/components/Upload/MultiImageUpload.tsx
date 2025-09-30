import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FormikProps } from "formik";
import { styled, CircularProgress, IconButton } from "@mui/material";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getTokens } from "@/lib/graphql/utils";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { CloseIcon } from "@/components/icons/Close";
import { getUri } from "@/components/utils/getUri";

interface FileItem {
  id: string;
  url: string;
  original_name?: string;
  size?: number;
  type?: string;
  mime_type?: string;
}

const UploadWrapper = styled("div")`
  .dropzone {
    border: 1px dashed ${({ theme }) => theme.palette.divider};
    border-radius: 6px;
    padding: 36px 24px;
    width: 100%;
    cursor: pointer;
    text-align: center;
    transition: 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    &.uploaded-files {
      width: calc(50% - 8px);
    }

    &:hover {
      background-color: ${({ theme }) => theme.palette.action.hover};
    }
    .title {
      font-size: 14px;
      color: ${({ theme }) => theme.palette.text.primary};
      margin-top: 6px;
      margin-bottom: 4px;
    }
    span {
      display: block;
      font-size: 12px;
      color: ${({ theme }) => theme.palette.text.secondary};
    }
  }
  .error {
    margin-left: 14px;
    font-size: 12px;
    color: ${({ theme }) => theme.palette.error.main};
    width: 100%;
    text-align: start;
  }

  .uploaded-file {
    position: relative;
    width: calc(50% - 8px);
    .MuiIconButton-root {
      border-radius: ${({ theme }) => theme.shape.borderRadius}px;
      background-color: ${({ theme }) => theme.palette.background.paper};
      position: absolute;
      top: 5px;
      right: 5px;
      &:hover {
        background-color: ${({ theme }) => theme.palette.action.hover};
      }
    }
    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .uploaded-files {
    margin-bottom: 16px;
  }
`;

// Sortable item component
function SortableItem({
  id,
  url,
  onRemove,
}: {
  id: string;
  url: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} className="uploaded-file">
      <img src={getUri(url)} alt="preview" {...attributes} {...listeners} />
      <IconButton
        size="small"
        className="delete"
        color="error"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}

export default function MultiImageUpload({
  formik,
  name,
  endpoint = "medias",
}: {
  formik: FormikProps<any>;
  name: string;
  endpoint?: string;
}) {
  const [loading, setLoading] = useState(false);
  const initial: FileItem[] = formik.values[name] || [];
  const [files, setFiles] = useState<FileItem[]>(initial);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return;
      setLoading(true);
      try {
        const formData = new FormData();
        accepted.forEach((file) => {
          const normalizedFileName = encodeURIComponent(file.name);
          const renamedFile = new File([file], normalizedFileName, {
            type: file.type,
          });
          formData.append("images", renamedFile);
        });

        const baseUrl = process.env.NEXT_PUBLIC_API?.replace(/\/$/, "");
        if (!baseUrl) {
          throw new Error("NEXT_PUBLIC_API is not defined");
        }

        const uploadUrl = `${baseUrl}/${endpoint}`;
        console.log("Upload URL:", uploadUrl);
        console.log("NEXT_PUBLIC_API:", process.env.NEXT_PUBLIC_API);

        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${(await getTokens()).access_token}`,
            "x-lang": "en",
          },
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server error response:", errorText);
          throw new Error(
            `HTTP ${res.status}: ${res.statusText} - ${errorText}`
          );
        }

        const json = await res.json();
        console.log("API Response:", json); // Debug log
        console.log("First file object:", json[0]); // Debug log
        console.log("First file URL:", json[0]?.url); // Debug log

        // Handle response like FormikFileUpload does
        const newItems: FileItem[] =
          json?.map((file: any) => {
            // Try different possible URL fields
            const imageUrl =
              file.url || file.file_url || file.image_url || file.path;
            console.log("File object:", file);
            console.log("Image URL from file:", imageUrl);

            return {
              id: file.id,
              url: imageUrl,
              original_name: file.original_name || file.file_name,
              size: file.size || file.file_size,
              type: file.type || file.mimetype,
              mime_type: file.mime_type || file.mimetype,
            };
          }) || [];

        const updated = [...files, ...newItems];
        setFiles(updated);
        formik.setFieldValue(name, updated);
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setLoading(false);
      }
    },
    [files, formik, name, endpoint]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/*": [] },
  });

  const removeById = (id: string) => {
    const updated = files.filter((file) => file.id !== id);
    setFiles(updated);
    formik.setFieldValue(name, updated);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = files.findIndex((file) => file.id === active.id);
    const newIndex = files.findIndex((file) => file.id === over.id);
    const reordered = arrayMove(files, oldIndex, newIndex);
    setFiles(reordered);
    formik.setFieldValue(name, reordered);
  };

  return (
    <UploadWrapper>
      <div className="list">
        <div
          {...getRootProps()}
          className={`dropzone ${files.length ? "uploaded-files" : ""}`}
        >
          <input {...getInputProps()} />
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <PlusIcon width={24} height={24} />
          )}
          <p className="title">Kliko për të ngarkuar ose tërhiq dhe lësho</p>
          <span>PNG, JPG, JPEG</span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={files.map((file) => file.id)}>
            {files.map((file) => (
              <SortableItem
                key={file.id}
                id={file.id}
                url={file.url}
                onRemove={() => removeById(file.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <p className="error">
        {formik.touched[name] &&
          typeof formik.errors[name] === "string" &&
          formik.errors[name]}
      </p>
    </UploadWrapper>
  );
}
