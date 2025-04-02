import React from "react";
import { useToast } from "./ToastContext";
import Button from "./Button";

interface ConfirmToastProps {
  onSuccess?: () => void;
  onError?: () => void;
  successMessage?: string;
  errorMessage?: string;
  label?: string;
  confirmAction: () => Promise<boolean> | boolean;
  variant?: "primary" | "secondary" | "success" | "danger";
}

const ConfirmToast: React.FC<ConfirmToastProps> = ({
  onSuccess,
  onError,
  successMessage = "Operation completed successfully!",
  errorMessage = "An error occurred. Please try again.",
  label = "Confirm",
  confirmAction,
  variant = "primary",
}) => {
  const { showToast } = useToast();

  const handleAction = async () => {
    try {
      const result = await confirmAction();

      if (result) {
        showToast(successMessage, "success");
        onSuccess?.();
      } else {
        showToast(errorMessage, "error");
        onError?.();
      }
    } catch (error) {
      showToast(errorMessage, "error");
      onError?.();
    }
  };

  return (
    <Button variant={variant} onClick={handleAction}>
      {label}
    </Button>
  );
};

export default ConfirmToast;

// Example usage:
/*
  <ConfirmToast
    label="Submit Form"
    confirmAction={async () => {
      // Your async logic here, e.g., API call
      try {
        await submitFormData(formData);
        return true; // Return true for success
      } catch (error) {
        return false; // Return false for error
      }
    }}
    successMessage="Form submitted successfully!"
    errorMessage="Failed to submit form. Please try again."
    onSuccess={() => {
      // Additional success actions
      resetForm();
    }}
  />
*/
