import { useState } from "react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
}

interface ConfirmState extends ConfirmOptions {
  onConfirm: () => void;
  onCancel: () => void;
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ConfirmState>({
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        onConfirm: () => {
          setIsOpen(false);
          resolve(true);
        },
        onCancel: () => {
          setIsOpen(false);
          resolve(false);
        },
      });
      setIsOpen(true);
    });
  };

  return {
    confirm,
    confirmProps: {
      isOpen,
      title: state.title,
      message: state.message,
      confirmLabel: state.confirmLabel,
      cancelLabel: state.cancelLabel,
      isDangerous: state.isDangerous,
      onConfirm: state.onConfirm,
      onCancel: state.onCancel,
    },
  };
}
