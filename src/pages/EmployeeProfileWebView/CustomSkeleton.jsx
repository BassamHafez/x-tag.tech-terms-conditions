import { imgClasses, slideClasses, titleClasses } from "./staticData";

const CustomSkeleton = () => {
  return (
    <div className={slideClasses}>
      <div className={imgClasses}>
        <div className="w-full aspect-video bg-gray-300 animate-pulse rounded-md" />
      </div>
      <p className={titleClasses}>
        <div className="h-4 w-[110px] md:w-[150px] bg-gray-300 animate-pulse rounded-md" />
      </p>
    </div>
  );
};

export default CustomSkeleton;
