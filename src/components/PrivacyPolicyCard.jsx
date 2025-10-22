const PrivacyPolicyCard = ({ ppData, index }) => {
  return (
    <>
      <div className="bg-gray-100 shadow-sm rounded-2xl p-5">
        <div className="space-y-6 text-start">
          <div dir="ltr">
            <h2 className="font-bold text-xl mb-1">
              <span className="text-main">{index + 1}-</span> {ppData?.enTitle}
            </h2>
            <p className="whitespace-pre-wrap">{ppData?.enContent}</p>
          </div>
          <div dir="rtl">
            <h2 className="font-bold text-xl mb-1">
              <span className="text-main">{index + 1}-</span> {ppData?.arTitle}
            </h2>
            <p className="whitespace-pre-wrap">{ppData?.arContent}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyCard;
