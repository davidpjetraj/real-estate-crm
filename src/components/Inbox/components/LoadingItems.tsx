'use client';
import { Skeleton, styled } from '@mui/material';

const Wrapper = styled('div')`
  position: relative;
  .item {
    padding: 8px;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    position: relative;
    .left {
      display: flex;
      align-items: flex-start;
      gap: 7px;
      width: 100%;
      .info {
        width: 100%;
      }
    }
  }
`;

export default function LoadingItems({
  showAvatar = true,
}: {
  showAvatar?: boolean;
}) {
  return (
    <Wrapper>
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="item" key={index}>
          <div className="left">
            {showAvatar && (
              <Skeleton
                style={{
                  width: '42px',
                  height: '42px',
                  minWidth: '42px',
                }}
                variant="circular"
              />
            )}

            <div className="info">
              <div className="title">
                <Skeleton
                  style={{
                    width: '120px',
                    height: '19.2px',
                    marginBottom: '4px',
                  }}
                  variant="text"
                />
              </div>

              <Skeleton
                style={{
                  width: '98%',
                  height: '19.2px',
                }}
                variant="text"
              />
              <Skeleton
                style={{
                  width: '45%',
                  height: '19.2px',
                  borderRadius: '16px',
                }}
                variant="text"
              />
            </div>
          </div>
        </div>
      ))}
    </Wrapper>
  );
}
