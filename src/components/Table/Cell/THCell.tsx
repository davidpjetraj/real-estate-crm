'use client';
import { styled } from '@mui/material';
const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  padding: 0px 8px;
  width: 100%;
  overflow: hidden;
`;

export function THCell({ title, align }: { title: string; align?: string }) {
  return (
    <Wrapper
      sx={{
        justifyContent: align === 'center' ? 'center' : 'flex-start',
      }}>
      <div className="left">
        <span>{title}</span>
      </div>
      <div className="right"></div>
    </Wrapper>
  );
}
