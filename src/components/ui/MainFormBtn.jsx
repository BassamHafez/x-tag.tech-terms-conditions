import { motion } from "@/shared/constants";

const MainFormBtn = ({
  text,
  onClick,
  type,
  children,
  classes,
  disabled,
  small,
  dangerAction=false
}) => {
  const MotionBtn = motion.button;

  return (
    <MotionBtn
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.2 },
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0px 2px 3px rgba(0,0,0,0.2)",
        transition: { type: "tween", duration: 0.2 },
      }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      type={type ? type : "button"}
      className={`rounded ${
        small ? "text-sm py-1.5" : "text-lg py-2"
      } font-semibold border ${dangerAction?"bg-red-600":"bg-main"} text-white  border-transparent  min-w-3/5 ${classes}`}
      disabled={disabled}
    >
      {text ? text : children}
    </MotionBtn>
  );
};

export default MainFormBtn;
