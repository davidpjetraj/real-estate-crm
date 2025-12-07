import { CircleIcon } from "@/components/icons/CircleIcon";
import { TickIcon } from "@/components/icons/TickIcon";
import { Divider, styled } from "@mui/material";
import Scrollbars from "react-custom-scrollbars-2";

const Wrapper = styled("div")`
  background-color: ${({ theme }) => theme.palette.background.paper};
  position: relative;
  border-right: 1px solid ${({ theme }) => theme.palette.divider};

  @media (max-width: 900px) {
    display: none;
  }
  .content {
    padding: 30px 16px;
    @media (max-width: 900px) {
      padding: 16px;
    }
    .sidebar-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      opacity: 0.6;

      &.active {
        opacity: 1;
      }
      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        @media (max-width: 900px) {
          .MuiDivider-root {
            height: 20px !important;
          }
        }
      }
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        width: 48px;
        border: 1px solid ${({ theme }) => theme.palette.divider};
        background-color: ${({ theme }) => theme.palette.background.paper};
        border-radius: ${({ theme }) => theme.shape.borderRadius}px;
        @media (max-width: 900px) {
          width: 35px;
          height: 35px;
          svg {
            width: 18px;
            height: 18px;
          }
        }
      }
      h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        @media (max-width: 900px) {
          font-size: 14px;
        }
      }
      p {
        font-size: 14px;
        color: ${({ theme }) => theme.palette.text.secondary};
        margin: 0;
        @media (max-width: 900px) {
          font-size: 12px;
        }
      }
    }
  }
`;
export default function Sidebar({
  step,
  options,
  onStepClick,
}: {
  step: number;
  options: { title: string; description: string }[];
  onStepClick?: (targetStep: number) => void;
}) {
  const getIcon = (index: number) => {
    if (index < step) {
      return <TickIcon />;
    } else {
      return <CircleIcon />;
    }
  };

  return (
    <Wrapper>
      <Scrollbars
        style={{ height: "calc(100vh - 120px)" }}
        className="scrollbar"
      >
        <div className="content">
          {options.map((option, idx) => (
            <div
              key={idx}
              className={`sidebar-item ${step === idx ? "active" : ""}`}
              onClick={onStepClick ? () => onStepClick(idx) : undefined}
              style={onStepClick ? { cursor: "pointer" } : undefined}
            >
              <div className="left">
                <div className="icon">{getIcon(idx)}</div>
                {idx !== options.length - 1 && (
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    style={{
                      height: "34px",
                      width: "2px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  />
                )}
              </div>
              <div className="right">
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Scrollbars>
    </Wrapper>
  );
}
