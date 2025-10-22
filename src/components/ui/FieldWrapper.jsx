import { motion } from "@/shared/constants";
const MotionDiv = motion.div;

const FieldWrapper = ({ classes, children }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className={`field ${classes}`}
    >
      {children}
    </MotionDiv>
  );
};

export default FieldWrapper;
