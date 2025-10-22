import {
  useMutation,
  useTranslation,
  useValidation,
} from "@/shared/hooks";
import { ErrorMessage, Field, Form, Formik } from "@/shared/wrappers";
import { object, toast } from "@/shared/constants";
import { FieldWrapper, InputErrorMessage } from "@/shared/components";
import { signFormsHandler } from "@/util/Http";
import MainFormBtn from "@/components/ui/MainFormBtn";

const DeleteRequestForm = ({ toggleModal }) => {
  const { emailValidation, passwordValidation } = useValidation();
  const { t } = useTranslation();

  const { mutate, isPending, isSubmitting } = useMutation({
    mutationFn: signFormsHandler,
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    try {
      toast.promise(
        new Promise((resolve, reject) => {
          mutate(
            {
              type: "login",
              formData: values,
            },
            {
              onSuccess: (response) => {
                let res = response.data;
                if (res.success || res.message === "Logged in successfully") {
                  const userToken = res?.data?.accessToken;
                  if (userToken) {
                    sessionStorage.setItem("token", userToken);
                    toggleModal(true);
                    // navigate("/delete-me");
                    resolve();
                  } else {
                    toggleModal(false);
                    reject("wrong");
                  }
                }
              },
              onError: (error) => {
                console.error(error);
                try {
                  if (
                    error?.data?.message ===
                    "You are unauthorized to perform this action"
                  ) {
                    reject(t("unAuthAction"));
                  }
                  if (error?.isCorsError) {
                    reject(t("networkError"));
                  } else if (
                    error?.data?.message === "Invalid credentials" ||
                    error?.data?.message ===
                      "The current password you entered is incorrect"
                  ) {
                    reject(t("invalidCredentials"));
                  } else {
                    reject(t("wrong"));
                  }
                } catch {
                  reject(t("wrong"));
                }
              },
            }
          );
        }),
        {
          pending: t("processingData"),
          error: {
            render({ data }) {
              return data;
            },
          },
        }
      );
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = object({
    email: emailValidation,
    password: passwordValidation,
  });

  return (
    <section className="border border-gray-600 shadow rounded-md px-4 py-8 min-w-[95%] md:min-w-[60%] lg:min-w-[50%] ">
      <div className="text-center mb-4">
        <h1 className="font-bold text-4xl text-main">{t("deleteReqTitle")}</h1>
        <p className="text-gray-400">{t("deleteReqSubTitle")}</p>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <FieldWrapper>
            <Field
              type="email"
              name="email"
              placeholder={t("enterEmail")}
              className="bg-gray-800   field"
            />
            <ErrorMessage name="email" component={InputErrorMessage} />
          </FieldWrapper>
          <FieldWrapper classes="relative">
            <Field
              type="password"
              name="password"
              placeholder={t("passwordPlaceholder")}
              className="bg-gray-800 field"
            />
            <ErrorMessage name="password" component={InputErrorMessage} />
          </FieldWrapper>
          <div className="w-full text-center">
            <MainFormBtn type="submit" disabled={isPending || isSubmitting}>
              {t("send")}
            </MainFormBtn>
          </div>
        </Form>
      </Formik>
    </section>
  );
};

export default DeleteRequestForm;
