import { styled } from "@mui/material/styles";

const Wrapper = styled("div")`
  background: ${({ theme }) => theme.palette.background.paper};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 16px;
  overflow: hidden;
  height: 350px;

  ${({ theme }) => theme.breakpoints.down("md")} {
    height: auto !important;
  }

  .header {
    padding: 20px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      color: ${({ theme }) => theme.palette.text.primary};
    }
  }

  .content {
    position: relative;

    ${({ theme }) => theme.breakpoints.down("xs")} {
      padding: 5px;
    }
  }

  .actions {
    display: flex;
    gap: 10px;
    margin-top: 5px;
    align-items: center;
    justify-content: flex-end;
  }
`;

export default function Card({
  title,
  children,
  style = {},
  actions,
}: {
  title?: string;
  children?: any;
  style?: any;
  actions?: any;
}) {
  return (
    <Wrapper style={style}>
      <div className="header">
        <h3>{title}</h3>
        {actions && <div className="actions">{actions}</div>}
      </div>
      <div className="content">{children}</div>
    </Wrapper>
  );
}
