import { useTranslation } from "react-i18next";

import Modal from "./Modal";

import "./ConfirmDialog.css";

interface ConfirmDialogProps {
  open: boolean;

  title: string;

  message: string;

  confirmLabel?: string;

  cancelLabel?: string;

  danger?: boolean;

  loading?: boolean;

  onConfirm: () => void;

  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal open={open} title={title} onClose={loading ? () => {} : onCancel}>
      <div className="confirm-dialog">
        <p className="confirm-dialog__message">{message}</p>

        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="confirm-dialog__cancel"
            disabled={loading}
            onClick={onCancel}
          >
            {cancelLabel ?? t("common.cancel")}
          </button>

          <button
            type="button"
            className={
              danger
                ? "confirm-dialog__confirm confirm-dialog__confirm--danger"
                : "confirm-dialog__confirm"
            }
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "..." : (confirmLabel ?? t("common.confirm"))}
          </button>
        </div>
      </div>
    </Modal>
  );
}
