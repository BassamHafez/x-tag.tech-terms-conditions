import styles from "./InputErrorMessage.module.css";
import { motion } from "@/shared/constants";
import { useTranslation } from "@/shared/hooks";
const Wrapper = motion.p;

const InputErrorMessage = (props) => {
  const { i18n } = useTranslation();
  const isArLang = i18n.language === "ar";
  const xShift = isArLang ? 30 : -30;

  return (
    <Wrapper
      initial={{ x: xShift, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        transition: { duration: 0.4, type: "spring", stiffness: 500 },
      }}
      exit={{ x: xShift, opacity: 0 }}
      className={`${styles.error_message} ${
        isArLang ? styles.error_message_ar : styles.error_message_en
      }`}
    >
      {props.text ? props.text : props.children.value || props.children}
    </Wrapper>
  );
};

export default InputErrorMessage;
