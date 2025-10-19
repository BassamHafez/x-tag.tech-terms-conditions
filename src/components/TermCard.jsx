const TermCard = ({ tcData, index }) => {
  return (
    <div className="bg-gray-100 shadow-sm rounded-2xl p-5">
      <div className="space-y-6 text-start">
        <div dir="ltr">
          <h2 className="font-bold text-lg text-[#ce9615]">
            {index + 1}- {tcData?.enTitle}
          </h2>
          <p className="whitespace-pre-wrap text-gray-700">
            {tcData?.enContent}
          </p>
        </div>

        <div dir="rtl">
          <h2 className="font-bold text-lg text-[#ce9615]">
            {index + 1}- {tcData?.arTitle}
          </h2>
          <p className="whitespace-pre-wrap text-gray-700">
            {tcData?.arContent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermCard;
