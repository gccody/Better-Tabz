import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type DialogType = "alert" | "confirm" | "prompt" | "custom";

export interface DialogConfig {
  id: string;
  type: DialogType;
  title: string;
  message?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  fields?: Array<{
    name: string;
    label: string;
    type?: "text" | "url" | "password" | "number";
    defaultValue?: string;
    required?: boolean;
  }>;
  onConfirm?: (result: unknown) => void;
  onCancel?: () => void;
}

interface DialogContextType {
  dialogs: DialogConfig[];
  showAlert: (title: string, message: string, onClose?: () => void) => void;
  showConfirm: (title: string, message: string, onConfirm: (confirmed: boolean) => void, confirmText?: string, cancelText?: string) => void;
  showPrompt: (title: string, message?: string, defaultValue?: string, onConfirm?: (value: string) => void, onCancel?: () => void) => void;
  showDialog: (config: Omit<DialogConfig, "id">) => void;
  closeDialog: (id: string) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

let dialogIdCounter = 0;

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogs, setDialogs] = useState<DialogConfig[]>([]);

  const closeDialog = useCallback((id: string) => {
    setDialogs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const showDialog = useCallback((config: Omit<DialogConfig, "id">) => {
    const id = `dialog-${++dialogIdCounter}`;
    setDialogs((prev) => [...prev, { ...config, id } as DialogConfig]);
  }, []);

  const showAlert = useCallback((title: string, message: string, onClose?: () => void) => {
    showDialog({
      type: "alert",
      title,
      message,
      confirmText: "OK",
      onConfirm: () => {
        onClose?.();
      },
    });
  }, [showDialog]);

  const showConfirm = useCallback((title: string, message: string, onConfirm: (confirmed: boolean) => void, confirmText = "OK", cancelText = "Cancel") => {
    showDialog({
      type: "confirm",
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: (result) => {
        onConfirm(!!result);
      },
      onCancel: () => {
        onConfirm(false);
      },
    });
  }, [showDialog]);

  const showPrompt = useCallback((title: string, message?: string, defaultValue = "", onConfirm?: (value: string) => void, onCancel?: () => void) => {
    showDialog({
      type: "prompt",
      title,
      message,
      defaultValue,
      confirmText: "OK",
      cancelText: "Cancel",
      onConfirm: (result) => {
        onConfirm?.(result as string);
      },
      onCancel: () => {
        onCancel?.();
      },
    });
  }, [showDialog]);

  return (
    <DialogContext.Provider value={{ dialogs, showAlert, showConfirm, showPrompt, showDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
