import { styled } from '@mui/material';
import { LinkSelector } from '../selectors/link-selector';
import { NodeSelector } from '../selectors/node-selector';

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  padding: 4px;
  gap: 5px;
  margin-left: 8px;

  .bubble-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    border: none;
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

  .info {
    margin-left: auto;
  }
`;

const Container = styled('div')`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-right: 12px;
`;

const FormikTextEditorMenu = ({ info }: { info?: any }) => {
  return (
    <Container>
      <Wrapper className="editor-menu">
        <NodeSelector />
        <LinkSelector />
      </Wrapper>
      {info && <div className="info">{info}</div>}
    </Container>
  );
};

export default FormikTextEditorMenu;
