import { Divider, styled } from "@mui/material";
import { LinkSelector } from "../selectors/link-selector";
import { JobsNodeSelector } from "../selectors/jobs-node-selector";
import { ImageSelector } from "../selectors/image-selector";
import { HeadingSelector } from "../selectors/heading-selector";
import { TextAlignSelector } from "../selectors/text-align-selector";
import { UndoRedoSelector } from "../selectors/undo-redo-selector";
import { BlockSelector } from "../selectors/block-selector";
import { ColorPickerInput } from "../selectors/color-selector";

const Wrapper = styled("div")`
  background-color: ${({ theme }) => theme.palette.background.paper};
  max-width: 100% !important;
  width: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 0px;
  padding: 4px;
  gap: 5px;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  box-shadow: ${({ theme }) => theme.shadows[4]};
  position: sticky;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;

  .bubble-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    border: none;
    width: fit-content;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    justify-content: center;
    height: 34px;
    width: 34px;
    color: ${({ theme }) => theme.palette.text.primary};

    svg {
      width: 16px;
      height: 16px;
    }

    &.active {
      background-color: ${({ theme }) => theme.palette.action.selected};
      color: ${({ theme }) => theme.palette.primary.main};
    }

    &:hover {
      background-color: ${({ theme }) => theme.palette.action.hover};
    }
  }
`;

const EditorMenu = () => {
  return (
    <Wrapper className="editor-menu">
      <HeadingSelector />
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{
          mt: 0.2,
          mb: 0.2,
        }}
      />
      <ColorPickerInput />
      <JobsNodeSelector />
      <TextAlignSelector />
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{
          mt: 0.2,
          mb: 0.2,
        }}
      />
      <LinkSelector />
      <ImageSelector />
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{
          mt: 0.2,
          mb: 0.2,
        }}
      />
      <UndoRedoSelector />
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{
          mt: 0.2,
          mb: 0.2,
        }}
      />
      <BlockSelector />
    </Wrapper>
  );
};

export default EditorMenu;
