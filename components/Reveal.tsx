 "use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function Reveal({children, delay=0}:{children:ReactNode;delay?:number}) {
  return (
    <motion.div
      initial={{opacity:0,y:28}}
      whileInView={{opacity:1,y:0}}
      viewport={{once:true,amount:.18}}
      transition={{duration:.75,ease:[.2,.7,.2,1],delay}}
    >
      {children}
    </motion.div>
  );
}
