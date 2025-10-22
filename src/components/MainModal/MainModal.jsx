import { useEffect, useTranslation } from "@/shared/hooks";
import { createPortal } from "react-dom";
import { AnimatePresence } from "@/shared/wrappers";
import { motion } from "@/shared/constants";
import { X } from "lucide-react";
import { MainFormBtn } from "@/shared/components";
const MotionDiv = motion.div;

const MainModal = ({
  isOpen,
  onClose,
  onConfirm,
  confirmTxt,
  children,
  myWidth,
  myHeight = "max-h-[90%]",
  noActions,
  title,
  headerClasses = "",
  customBackground = "bg-white",
  dangerAction = false,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/65"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <MotionDiv
            onClick={(e) => e.stopPropagation()}
            className={`py-4 rounded shadow-xs overflow-y-auto ${customBackground} ${myHeight} ${
              myWidth ? myWidth : "min-w-[300px]"
            }`}
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <header
              className={`flex items-center justify-between ${headerClasses}`}
            >
              {title && (
                <h1 className="text-2xl leading-none font-semibold">{title}</h1>
              )}
              <button onClick={onClose} className="me-2 ms-auto">
                <X className="size-6 text-gray-400 hover:text-black duration-200" />
              </button>
            </header>
            <section>{children}</section>
            {!noActions && (
              <div className="flex justify-end gap-2 items-center mt-4 px-4">
                <button
                  className="bg-gray-100 py-1 min-w-18 rounded"
                  onClick={onClose}
                >
                  {t("cancel")}
                </button>

                {confirmTxt && (
                  <MainFormBtn
                    onClick={onConfirm}
                    dangerAction={dangerAction}
                    classes="min-w-24"
                    small
                  >
                    {confirmTxt}
                  </MainFormBtn>
                )}
              </div>
            )}
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default MainModal;
