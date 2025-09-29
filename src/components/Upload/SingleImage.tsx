import { getTokens } from "@/lib/graphql/utils";
import { CloseIcon } from "@/components/icons/Close";

import { CircularProgress, IconButton, styled } from "@mui/material";
import { FormikProps } from "formik";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { getUri } from "@/components/utils/getUri";

const UploadWrapper = styled("div")`
  .dropzone {
    border: 1px dashed ${({ theme }) => theme.palette.divider};
    border-radius: 6px;
    padding: 36px 24px;
    cursor: pointer;
    text-align: center;
    transition: 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

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
      height: 100%;
    }
  }
  .uploaded-files {
    margin-bottom: 16px;
  }
`;

export default function SingleImageUpload({
  formik,
  name,
  endpoint = "files/upload-files",
}: {
  formik: FormikProps<any>;
  name: string;
  endpoint?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = React.useState<any[]>(
    formik.values[name] ? [formik.values[name]] : []
  );

  const onDrop = useCallback(
    async (acceptedFiles: any) => {
      setLoading(true);
      const formData = new FormData();
      acceptedFiles.forEach((el: any) => {
        formData.append("files", el);
      });

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/v1/${endpoint}`,
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
        formik.setFieldValue(name, singleUrl);
        setFiles([singleUrl]);
        setLoading(false);
      } catch (error: any) {
        console.log(error, "error");
        setLoading(false);
      }
    },
    [formik, files, name]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  });

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    formik.setFieldValue(name, updatedFiles.length ? updatedFiles : null);
  };
  return (
    <UploadWrapper>
      {files.length > 0 && (
        <div className="uploaded-files">
          {files.map((file, index) => (
            <div key={index} className="uploaded-file">
              <img src={getUri(file)} alt={`uploaded file ${index}`} />
              <IconButton onClick={() => handleRemoveFile(index)} color="error">
                <CloseIcon />
              </IconButton>
            </div>
          ))}
        </div>
      )}
      {files.length === 0 && (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <PlusIcon width={24} height={24} />
          )}
        </div>
      )}
      <p className="error">
        {formik.touched[name] &&
          typeof formik.errors[name] === "string" &&
          formik.errors[name]}
      </p>
    </UploadWrapper>
  );
}
