import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast, { ToastVariant } from "./Toast";

interface ToastContextProps {
  showToast: (
    message: string,
    variant?: ToastVariant,
    duration?: number,
  ) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastConfig, setToastConfig] = useState<{
    message: string;
    variant: ToastVariant;
    duration: number;
    isOpen: boolean;
  }>({
    message: "",
    variant: "info",
    duration: 3000,
    isOpen: false,
  });

  const showToast = (
    message: string,
    variant: ToastVariant = "info",
    duration: number = 3000,
  ) => {
    setToastConfig({
      message,
      variant,
      duration,
      isOpen: true,
    });
  };

  const hideToast = () => {
    setToastConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={toastConfig.message}
        variant={toastConfig.variant}
        duration={toastConfig.duration}
        isOpen={toastConfig.isOpen}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
