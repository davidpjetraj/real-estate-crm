"use client";

import { Button, styled } from "@mui/material";
import React from "react";

import { FormikProps } from "formik";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";

const Wrapper = styled("div")`
  height: 60px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-top: 1px solid ${({ theme }) => theme.palette.divider};
  padding: 0 16px;
  width: 100%;
  .footer-content {
    width: 100%;
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .footer-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
`;

export default function Footer({
  formik,
  editPage = false,
  onBack,
  onContinue,
  isLastStep = false,
  isFirstStep = false,
  currentStep = 0,
  onCancel,
  rightActions,
  createLabel,
}: {
  formik: FormikProps<any>;
  editPage?: boolean;
  onBack: () => void;
  onContinue: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  currentStep?: number;
  onCancel: () => void;
  rightActions?: React.ReactNode;
  createLabel?: string;
}) {
  const getSubmitButtonLabel = () => {
    if (isLastStep) {
      if (editPage) return "Save";
      if (createLabel) return createLabel;
      return "Create";
    }
    return "Continue";
  };

  return (
    <Wrapper>
      <div className="footer-content">
        <div className="actions">
          {currentStep === 0 ? (
            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              onClick={onCancel}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              onClick={onBack}
            >
              {isFirstStep ? "Cancel" : "Back"}
            </Button>
          )}
          <div className="footer-right">
            {rightActions}
            <Button
              variant="contained"
              size="medium"
              color="primary"
              sx={{
                backgroundColor: (theme) => theme.palette.primary.dark,
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
              onClick={onContinue}
              disabled={formik.isSubmitting}
              endIcon={<ArrowRightIcon width={20} height={20} />}
            >
              {getSubmitButtonLabel()}
            </Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
