import { useTranslation } from "react-i18next";
import PrivacyPolicyCard from "../components/PrivacyPolicyCard";
import { dummyPrivacyPolicy } from "../logic/staticData";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <main className="p-4 sm:p-8">
      <header className="flex justify-between flex-wrap px-2 gap-2 items-center mb-8">
        <h1 className="font-bold text-2xl">{t("privacyPolicy")}</h1>
      </header>

      <section className="flex flex-col gap-5">
        {dummyPrivacyPolicy.map((pp, index) => (
          <PrivacyPolicyCard key={pp.id} index={index} ppData={pp} />
        ))}
      </section>
    </main>
  );
};

export default PrivacyPolicy;
