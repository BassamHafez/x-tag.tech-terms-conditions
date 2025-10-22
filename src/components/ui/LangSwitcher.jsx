import { useTranslation } from "@/shared/hooks";
import { sa, usa } from "@/shared/images";

const LangSwitcher = () => {
  const { i18n } = useTranslation();
  const isArLang = i18n.language === "ar";

  const toggleLanguage = () => {
    i18n.changeLanguage(isArLang ? "en" : "ar");
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex gap-3 items-center px-2 py-1 rounded bg-[#181818] text-main-darker font-bold border-0 hover:bg-main-darker hover:text-white duration-400`}
    >
      <img className="size-5" src={isArLang ? usa : sa} alt="country" />
      <p className="text-lg font-[monospace]">{isArLang ? "En" : "ع"}</p>
    </button>
  );
};

export default LangSwitcher;
