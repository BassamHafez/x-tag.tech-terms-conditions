import { useTranslation } from "react-i18next";
import { string } from "@/shared/constants";

const useValidation = () => {
  const { t } = useTranslation();

  //user data
  const emailValidation = string()
    .email(t("emailValidation1"))
    .required(t("emailValidation2"))
    .trim();

  const passwordValidation = string()
    .min(8, t("min8"))
    .required(t("fieldReq"))
    .matches(/[A-Z]+/, t("validationUpperCase"))
    .matches(/[a-z]+/, t("validationLowerCase"))
    .matches(/[0-9]+/, t("validationNumber"));

  return {
    passwordValidation,
    emailValidation,
  };
};

export default useValidation;
