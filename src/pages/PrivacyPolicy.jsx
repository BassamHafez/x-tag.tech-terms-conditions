import PrivacyPolicyCard from "../components/PrivacyPolicyCard";
import { dummyPrivacyPolicy } from "../logic/staticData";

const PrivacyPolicy = () => {
  return (
    <main className="p-4">
      <header className="flex justify-between flex-wrap px-2 gap-2 items-center mb-8">
        <h1 className="font-bold text-2xl">X Tag Privacy Policy</h1>
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
