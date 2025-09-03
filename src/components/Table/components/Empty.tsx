import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IDataStore } from "../interfaces/DataStore";
import StyledIcon from "@/components/shared/StyledIcon";

const SvgComponent = (props: any) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.68663 18.8334C13.2701 18.8334 16.2681 16.3269 17.0232 12.9715C17.1779 12.2842 17.2552 11.9405 17.0043 11.627C16.7535 11.3134 16.3475 11.3134 15.5355 11.3134H9.68663M9.68663 18.8334C5.53344 18.8334 2.16663 15.4665 2.16663 11.3134C2.16663 7.72991 4.67312 4.73186 8.02855 3.97678C8.7158 3.82213 9.05946 3.7448 9.37304 3.99567C9.68663 4.24654 9.68663 4.65252 9.68663 5.46449V11.3134M9.68663 18.8334V11.3134"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinejoin="round"
    />
    <path
      d="M18.4617 6.35535C17.7754 4.61319 16.3867 3.22457 14.6445 2.53825C13.7319 2.17869 13.2755 1.99891 12.721 2.3764C12.1666 2.75389 12.1666 3.37132 12.1666 4.60618V6.29703C12.1666 7.49263 12.1666 8.09043 12.538 8.46187C12.9095 8.83329 13.5073 8.83329 14.7029 8.83329H16.3937C17.6286 8.83329 18.246 8.83329 18.6235 8.27885C19.001 7.72442 18.8212 7.26806 18.4617 6.35535Z"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinejoin="round"
    />
  </svg>
);

const Wrapper = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh;
  width: calc(100vw - 283);

  .emptyC {
    max-width: 477px;
    width: 100%;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  svg {
    margin: 7px;
  }

  h1 {
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0%;
    margin-bottom: 8px;
  }
  p {
    font-weight: 400;
    font-size: 14px;
    line-height: 17.07px;
    letter-spacing: 0px;
  }

  button {
    margin-top: 30px;
  }

  @media (max-width: 768px) {
    width: 100vw;
  }
`;

export default function Empty({ store, title, desc, style }: any) {
  let filters: any[] = [];
  let clearFilters: (() => void) | undefined;
  let hasFilters = false;
  if (typeof store === "function") {
    const state = store((state: IDataStore) => state);
    filters = state.filters;
    clearFilters = state.clearFilters;
    hasFilters = Array.isArray(filters) && filters.length > 0;
  }

  return (
    <Wrapper style={style}>
      <div className="emptyC">
        <StyledIcon>
          <SvgComponent />
        </StyledIcon>
        <h1>{title || "No data available!"}</h1>
        <p>{desc || "There are currently no data."}</p>
        {hasFilters && clearFilters && (
          <Button
            onClick={() => {
              clearFilters();
            }}
            variant="outlined"
          >
            {"Clear Filters"}
          </Button>
        )}
      </div>
    </Wrapper>
  );
}
