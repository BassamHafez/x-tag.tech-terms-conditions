import TermCard from "../components/TermCard";
import { dummyTermsAndConditions } from "../logic/staticData";

const TermsAndConditions = () => {
  return (
    <main className="p-4">
      <header className="flex justify-between flex-wrap px-2 gap-2 items-center mb-8">
        <h1 className="font-bold text-2xl">X Tag Terms And Conditons</h1>
      </header>

      <section className="flex flex-col gap-5">
        {dummyTermsAndConditions.map((tc, index) => (
          <TermCard key={tc.id} index={index} tcData={tc} />
        ))}
      </section>
    </main>
  );
};

export default TermsAndConditions;
