import { motion } from 'framer-motion';

const NoScheduleMessage = ({ message }: { message: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="text-center p-4 bg-[#A8DCE7] dark:bg-[#272B3B] rounded-full text-[#272B3B] dark:text-[#A8DCE7]"
    >
      <p>{message}</p>
    </motion.div>
  );
  

export default NoScheduleMessage;