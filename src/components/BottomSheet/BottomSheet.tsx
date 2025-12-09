import { useEffect, useRef } from "react";

import styles from "./BottomSheet.module.css";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function BottomSheet(props: BottomSheetProps) {
  const { isOpen, onClose, children } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (dialogElement) {
      if (isOpen) {
        dialogElement.showModal();
      } else {
        dialogElement.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (dialogElement) {
      const handleCloseEvent = () => {
        onClose();
      };

      dialogElement.addEventListener("close", handleCloseEvent);
      return () => {
        dialogElement.removeEventListener("close", handleCloseEvent);
      };
    }
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className={styles.bottomSheet}>
      <button type="button" className={styles.closeBtn} onClick={onClose}>
        &times;
      </button>

      <div className={styles.content}>{children}</div>
    </dialog>
  );
}

export default BottomSheet;
