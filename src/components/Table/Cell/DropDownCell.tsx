"use client";
import { alpha, Button, Chip, darken, styled } from "@mui/material";
import { memo, useState } from "react";

import { defaultValue, OptionProps } from "@/components/shared/utils";
import { CheckIcon } from "@/components/icons/CheckIcon";
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
import classNames from "classnames";

const Wrapper = styled("div")`
  padding: 0 8px;
  width: 100%;
  display: flex;
  overflow: hidden;
`;

const DropDownCard = styled("div")`
  z-index: 10000;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 8px;
  gap: 5px;
  min-width: 140px;
  width: 100%;

  .item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    overflow: hidden;
    position: relative;
    span {
      font-weight: 700;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:before {
      content: "";
      width: 3px;
      background-color: ${({ theme }) => theme.palette.primary.main};
      position: absolute;
      left: 0;
      top: 0%;
      height: 100%;
      opacity: 0;
      border-radius: 3px;
      transition: 0.3s ease-in-out;
    }

    &:hover {
      background-color: ${({ theme }) =>
        alpha(theme.palette.primary.main, 0.1)};

      &:before {
        opacity: 1;
      }
    }

    .left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      min-width: 24px;

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
`;

export const DropDownCell = memo(function DropDownCell({
  options,
  value,
  onChange,
}: {
  options: OptionProps[];
  value: OptionProps | null | undefined;
  onChange: (value: OptionProps) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { y, refs, strategy, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
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

  const selectedItem =
    options.find((option) => option.value === value?.value) || defaultValue;

  return (
    <Wrapper>
      <Button
        ref={refs.setReference}
        {...getReferenceProps()}
        className="tag"
        style={{
          backgroundColor: alpha(selectedItem.color!, 0.3),
          borderColor: alpha(selectedItem.color!, 0.5),
          color: darken(selectedItem.color!, 0.3),
          borderRadius: 50,
          padding: "2px 10px",
        }}
      >
        {selectedItem?.label}
      </Button>

      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <DropDownCard
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: 0,
            }}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            {options.map((el: OptionProps, index: number) => (
              <div
                className={classNames({
                  item: true,
                  selected: value?.value === el.value,
                })}
                key={index}
                onClick={async () => {
                  setIsOpen(false);
                  if (onChange && value?.value !== el.value) {
                    await onChange(el);
                  }
                }}
              >
                <div className="left">
                  {value?.value === el.value && <CheckIcon />}
                </div>
                <Chip
                  size="small"
                  style={{
                    backgroundColor: alpha(el.color!, 0.3),
                    borderColor: alpha(el.color!, 0.3),
                    color: darken(el.color!, 0.3),
                  }}
                  label={el.label}
                />
              </div>
            ))}
          </DropDownCard>
        </FloatingFocusManager>
      )}
    </Wrapper>
  );
});
