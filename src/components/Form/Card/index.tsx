import { styled } from "@mui/material";

const Wrapper = styled("div")`
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  overflow: hidden;
  position: relative;

  .header {
    padding: 24px;

    .icon {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 20px;
    }
    h3 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      line-height: 1.2em;
      color: ${({ theme }) => theme.palette.text.primary};
    }
    p {
      margin: 0;
      margin-top: 5px;
      line-height: 1.2em;
      color: ${({ theme }) => theme.palette.text.secondary};
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;
    padding: 0px 24px;
    background-color: ${({ theme }) => theme.palette.background.default};
    height: 75px;
    align-items: center;
    @media (max-width: 430px) {
      gap: 8px;
    }

    .right {
      display: flex;
      width: 50%;
      border-radius: 12px;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
    }
    .footer-text {
      color: ${({ theme }) => theme.palette.text.secondary};
      margin: 0;
      @media (max-width: 430px) {
        font-size: 12px;
      }
    }
  }

  > .content {
    padding: 0px 24px 24px 24px;
    display: flex;
    flex-direction: column;
  }
`;

type Props = {
  children?: React.ReactNode;
  title?: React.ReactNode | string;
  description?: React.ReactNode | string;
  actions?: React.ReactNode;
  footerText?: React.ReactNode | string;
  contentStyles?: React.CSSProperties;
  footerStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  icon?: React.ReactNode;
};

export function Card({
  children,
  title,
  description,
  actions,
  footerText,
  contentStyles = {},
  footerStyle = {},
  wrapperStyle = {},
  icon,
}: Props) {
  return (
    <Wrapper style={wrapperStyle}>
      <div className="header">
        {icon && <div className="icon">{icon}</div>}
        {title && <h3>{title}</h3>}
        {description && <p>{description}</p>}
      </div>
      {children && (
        <div className="content" style={contentStyles}>
          {children}
        </div>
      )}
      {actions || footerText ? (
        <div className="footer" style={footerStyle}>
          <div className="left">
            {footerText && <p className="footer-text">{footerText}</p>}
          </div>
          <div className="right">{actions}</div>
        </div>
      ) : null}
    </Wrapper>
  );
}

const CardItemWrapper = styled("div")`
  display: flex;
  justify-content: space-between;

  .left {
    .title {
      margin: 0;
      font-size: 16px;
    }
    .description {
      margin: 0;
      font-size: 14px;
      color: ${({ theme }) => theme.palette.text.secondary};
    }
  }
`;

export function CardItem({
  children,
  title,
  description,
}: {
  children?: React.ReactNode;
  title?: React.ReactNode | string;
  description?: React.ReactNode | string;
}) {
  return (
    <CardItemWrapper>
      <div className="left">
        <p className="title">{title}</p>
        <p className="description">{description}</p>
      </div>
      <div className="right">{children}</div>
    </CardItemWrapper>
  );
}

Card.Item = CardItem;
