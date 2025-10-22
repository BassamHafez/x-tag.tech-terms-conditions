import { mainDeleteFunHandler } from "@/util/Http";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const DeleteAccount = ({ toggleModal }) => {
  const { t } = useTranslation();
  const token = sessionStorage.getItem("token");

  const deleteAccount = async () => {
    if (token) {
      const res = await mainDeleteFunHandler({
        type: "users",
        token: token,
      });
      console.log(res);
      if (res.status === 204 || res.status === 200) {
        toast.success(t("deletedSucc"));
        sessionStorage.removeItem("token");
        toggleModal(false);
        return;
      } else {
        toast.error(t("wrong"));
      }
    } else {
      toast.error(t("wrong"));
    }
  };

  return (
    <section className="bg-gray-800 rounded shadow p-4">
      <h1 className="font-bold text-2xl">{t("deleteAccount")}</h1>
      <p className="my-4 text-gray-300">{t("deleteAccCaption")}</p>
      <div className="text-end p-2">
        <button
          onClick={deleteAccount}
          className="bg-red-600 p-2 min-w-24 rounded"
        >
          {t("delete")}
        </button>
      </div>
    </section>
  );
};

export default DeleteAccount;
