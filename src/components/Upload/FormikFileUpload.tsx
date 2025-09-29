import { Skeleton, styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import { JSX, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import FormikFileActions from "./FormikFileActions";
import { getTokens } from "@/lib/graphql/utils";
import { FormikProps } from "formik";
import PdfIcon from "../icons/file-upload/PdfIcon";
import DocXIcon from "../icons/file-upload/DocXIcon";
import DocIcon from "../icons/file-upload/DocIcon";
import PngIcon from "../icons/file-upload/PngIcon";
import JpegIcon from "../icons/file-upload/JpegIcon";
import JpgIcon from "../icons/file-upload/JpgIcon";
import { useDropzone } from "react-dropzone";
import { getUri } from "../utils/getUri";
import { formatFileSize } from "../shared/helpers";
import EmptyFile from "../icons/file-upload/EmptyFile";
import { PlusIcon } from "../icons/PlusIcon";

const Wrapper = styled("div")`
  position: relative;
  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
  }
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin: 0;
  }

  .upload-wrapper {
    .dropzone {
      border: 2px dashed ${({ theme }) => theme.palette.divider};
      border-radius: 8px;
      padding: 21px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: 0.2s ease-in-out;
      &:hover,
      &.dragging {
        border-color: ${({ theme }) => theme.palette.primary.main};
        background-color: ${({ theme }) => theme.palette.action.hover};
      }
      span {
        margin-right: 8px;
      }
      p {
        font-size: 14px;
        color: ${({ theme }) => theme.palette.text.secondary};
        margin: 0;
        span {
          color: ${({ theme }) => theme.palette.text.primary};
        }
      }
      svg {
        display: flex;
      }
    }
  }
  .error {
    margin: 0;
    font-size: 12px;
    color: ${({ theme }) => theme.palette.error.main};
    width: 100%;
    text-align: start;
  }

  .uploaded-file {
    padding: 10px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    background-color: ${({ theme }) => theme.palette.background.paper};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    .text {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      overflow: hidden;
      width: calc(100% - 50px);
      .name {
        color: ${({ theme }) => theme.palette.text.primary};
        font-size: 14px;
        font-weight: 500;
        display: flex;
        flex-direction: column;
        width: calc(100% - 50px);
        .file-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          width: 100%;
        }
        .type {
          margin-top: 3px;
          font-size: 14px;
          color: ${({ theme }) => theme.palette.text.secondary};

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          width: 100%;
        }
        .size {
          font-size: 12px;
          color: ${({ theme }) => theme.palette.text.secondary};
          white-space: nowrap;
        }
      }
    }
  }
`;

type FileExtensions =
  | "application/pdf"
  | "docx"
  | "doc"
  | "image/png"
  | "image/jpeg"
  | "image/jpg";

const fileTypeIcons: Record<FileExtensions, JSX.Element> = {
  "application/pdf": <PdfIcon />,
  docx: <DocXIcon />,
  doc: <DocIcon />,
  "image/png": <PngIcon />,
  "image/jpeg": <JpegIcon />,
  "image/jpg": <JpgIcon />,
};

export default function FormikFileUpload({
  name,
  files: initialFiles,
  onChange,
  multiple = true,
  endpoint = "files/upload-documents",
  formik,
}: {
  name: string;
  files: any;
  onChange: (key: string, value: any) => void;
  multiple?: boolean;
  endpoint?: string;
  formik?: FormikProps<any>;
}) {
  const [loading, setLoading] = useState(false);
  const [uploadingFilesCount, setUploadingFilesCount] = useState(0);

  const [files, setFiles] = useState<any[]>(
    initialFiles?.map((file: any) => ({
      file_name: file.file_name,
      mimetype: file.mimetype,
      mime_type: file.mime_type,
      file_size: file?.file_size,
    })) || []
  );

  useEffect(() => {
    setFiles(
      initialFiles?.map((file: any) => ({
        id: file.id,
        file_name: file.file_name,
        mimetype: file.mimetype,
        mime_type: file.mime_type,
        file_size: file?.file_size,
        url: file.url,
      })) || []
    );
  }, [initialFiles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setLoading(true);
        setUploadingFilesCount(acceptedFiles.length);

        const formData = new FormData();

        acceptedFiles.forEach((file) => {
          const normalizedFileName = encodeURIComponent(file.name);
          const renamedFile = new File([file], normalizedFileName, {
            type: file.type,
          });
          formData.append("files", renamedFile);
        });

        const res = await await fetch(
          `${process.env.NEXT_PUBLIC_API}/${endpoint}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${(await getTokens()).access_token}`,
              "x-lang": "en",
            },
            body: formData,
          }
        );
        const json = await res.json();

        const newFiles = json?.map((file: any) => ({
          id: file.id,
          file_name: decodeURIComponent(file.file_name),
          mimetype: file.mimetype,
          mime_type: file.mime_type,
          file_size: file?.file_size,
          url: file.url,
        }));
        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles, ...newFiles];

          onChange(name, updatedFiles);

          return updatedFiles;
        });

        toast.success("Datei erfolgreich hochgeladen");
      } catch (error) {
        console.error("Fehler beim Hochladen der Datei:", error);
        if ((error as any)?.response?.status !== 500) {
          toast.error("Etwas ist schiefgelaufen");
        }
      } finally {
        setUploadingFilesCount(0);
        setLoading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        const errorMessages = errors.map((e) => e.message).join(", ");
        toast.error(`${file.name}: ${errorMessages}`);
      });
    },
    multiple: multiple,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/rtf": [".rtf"],
      "application/vnd.oasis.opendocument.text": [".odt"],
      "text/plain": [".txt"],
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
      "image/tiff": [".tiff"],
      "image/bmp": [".bmp"],
    },
  });

  return (
    <Wrapper>
      <Grid container spacing={1}>
        {files.map((file) => {
          const foundExtension =
            file?.mimetype?.toLowerCase() || file?.mime_type?.toLowerCase();

          const extension = (foundExtension || "pdf") as FileExtensions;
          return (
            <Grid size={{ xs: 12, md: 6 }} key={file.id}>
              <div
                className="uploaded-file"
                onClick={() => window.open(getUri(file.url), "_blank")}
              >
                <div className="text">
                  {fileTypeIcons[extension] || <EmptyFile />}
                  <div className="name">
                    <div className="file-name">
                      {decodeURIComponent(file.file_name)}
                    </div>
                    <div className="size">
                      {formatFileSize(file.file_size) || 0}
                    </div>
                  </div>
                </div>
                <div className="actions">
                  <FormikFileActions
                    name={name}
                    fileName={file?.file_name}
                    files={files}
                    setFiles={setFiles}
                    onChange={onChange}
                    item={file}
                  />
                </div>
              </div>
            </Grid>
          );
        })}

        {loading &&
          Array.from({ length: uploadingFilesCount }).map((_, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={`loading-skeleton-${index}`}>
              <Skeleton
                style={{
                  maxWidth: "100%",
                  height: "69px",
                  borderRadius: "12px",
                }}
                variant="rounded"
              />
            </Grid>
          ))}
        {!multiple && files.length >= 1 ? null : (
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="upload-wrapper">
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? "dragging" : ""}`}
              >
                <input {...getInputProps()} />
                {isDragActive ? <p>Datei hier ablegen</p> : <PlusIcon />}
              </div>
            </div>
          </Grid>
        )}
      </Grid>

      <p className="error">
        {formik?.touched[name] &&
          typeof formik.errors[name] === "string" &&
          formik.errors[name]}
      </p>
    </Wrapper>
  );
}
