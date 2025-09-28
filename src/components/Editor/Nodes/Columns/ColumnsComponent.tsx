import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { styled } from '@mui/material';

const ColumnsWrapper = styled(NodeViewWrapper)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 12px;
`;

const ColumnsGrid = styled('div')`
  > div {
    > div {
      display: grid;
      gap: 16px;
      grid-template-columns: 1fr 1fr; /* for exactly 2 columns */
      width: 100%;
    }
  }
`;

const ColumnsComponent = () => {
  return (
    <ColumnsWrapper>
      <ColumnsGrid>
        <NodeViewContent />
      </ColumnsGrid>
    </ColumnsWrapper>
  );
};

export default ColumnsComponent;
