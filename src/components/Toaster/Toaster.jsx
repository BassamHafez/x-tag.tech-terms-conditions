import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";

const Toaster = () => {
  const { i18n } = useTranslation();
  const isArLang = i18n.language === "ar";
  return (
    <ToastContainer
      position={isArLang ? "bottom-right" : "bottom-left"}
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      draggable
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      className="text-sm gap-x-4"
      toastClassName="mainFont"
      rtl={isArLang}
    />
  );
};

export default Toaster;
