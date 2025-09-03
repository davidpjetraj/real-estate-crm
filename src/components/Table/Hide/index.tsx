import { EyeClosedIcon } from "@/components/icons/EyeClosed";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { Card, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import classNames from "classnames";
import { memo, useState } from "react";
import TableButton from "../components/TableButton";
import Items from "./Items";

const DropDownCard = styled(Card)`
  z-index: 99999999 !important;
  overflow: inherit !important;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  max-width: 280px;
  width: 100%;

  .content-wrapper {
    padding: 15px;
    gap: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;

    .header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      height: 40px;
      overflow: hidden;

      h3 {
        margin: 0;
      }
    }
  }
`;

function Hide({ store }: { store: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, refs, strategy, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const headingId = useId();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <TableButton
        key="hide"
        ref={refs.setReference}
        {...getReferenceProps()}
        className={classNames({
          open: isOpen,
        })}
        startIcon={<EyeClosedIcon width={18} height={18} />}
      >
        {!isMobile && <span className="text">Fshih</span>}
      </TableButton>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <DropDownCard
            variant="outlined"
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <div className="content-wrapper">
              <div className="header">
                <h3>Fshih</h3>
              </div>
              <Items store={store} />
            </div>
          </DropDownCard>
        </FloatingFocusManager>
      )}
    </>
  );
}
export default memo(Hide);
