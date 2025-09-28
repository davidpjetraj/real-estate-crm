import { alpha, FormHelperText, styled } from "@mui/material";
import { AdvancedEditor, Editor } from ".";

const DescriptionWrapper = styled("div")`
  border: 1.5px solid ${({ theme }) => alpha(theme.palette.grey[400], 0.3)};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  height: 350px;
  position: relative;
  overflow: auto;

  &:hover,
  &:focus-within {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }

  &.error {
    border-color: ${({ theme }) => theme.palette.error.main};
  }

  .prose-mirror-editor-wrapper {
    margin: 0;

    .editor-menu {
      margin: 0;
    }
  }

  .editor-content,
  .ProseMirror {
    position: relative;
    overflow: auto;
  }

  .editor-menu {
    position: sticky;
    bottom: 0;
    left: 0;
    z-index: 99;

    .bubble-button {
      width: 24px;
      height: 24px;
      padding: 4px;
      border-radius: 6px;

      svg {
        width: 14px;
        height: 14px;
      }
    }
  }

  p {
    margin-top: 0;
  }
`;

export default function FormikTextEditor({
  props,
  formik_name,
  formik_name_html,
  formik_name_text,
}: any) {
  const getEditorContent = () => {
    const content = props.values?.[formik_name];

    if (typeof content === "string") {
      try {
        return JSON.parse(content || "{}");
      } catch (error) {
        console.error("Invalid JSON string:", error);
        return {};
      }
    }

    return {};
  };
  return (
    <>
      <DescriptionWrapper
        className={
          props?.touched?.formik_name_text &&
          Boolean(props?.errors?.formik_name_text)
            ? "error"
            : ""
        }
      >
        <AdvancedEditor
          initialContent={getEditorContent()}
          onUpdate={(editor: Editor) => {
            const json = editor.getJSON();
            const text = editor.getText();
            const html = editor.getHTML();
            props.setFieldValue(formik_name, JSON.stringify(json));
            props.setFieldValue(formik_name_html, html);
            props.setFieldValue(formik_name_text, text);
          }}
        />
      </DescriptionWrapper>
      {props?.touched?.formik_name_text &&
        Boolean(props?.errors?.formik_name_text) && (
          <FormHelperText
            error
            style={{
              margin: 0,
            }}
          >
            {props.errors.formik_name_text?.toString()}
          </FormHelperText>
        )}
    </>
  );
}
