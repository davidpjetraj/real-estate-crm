import React from "react";
import { generateHTML } from "@tiptap/react";
import { simpleEditorExtensions } from "../Editor/extensions";

const EditorContent = ({ jsonContent }: any) => {
  const htmlContent = generateHTML(jsonContent, [...simpleEditorExtensions]); // Add other extensions you used in the editor

  return (
    <div
      className="tiptap-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default EditorContent;
