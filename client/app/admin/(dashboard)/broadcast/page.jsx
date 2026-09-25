"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BroadcastInput from "@/app/libs/ui/admin/broadcast/input";
import { useSummary } from "../../api/summary";
import Audience from "@/app/libs/ui/admin/broadcast/audience";
import { containerVariants, itemVariants } from "@/app/libs/ui/admin/broadcast/variants";


function Broadcast() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mailTo, setMailTo] = useState(null);
  const { summary } = useSummary();

  const props = {
    title,
    setTitle,
    content,
    setContent,
    mailTo,
    summary,
    setMailTo
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5 mb-10 sm:mb-0"
    >

      <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 xl:col-span-3">
        <BroadcastInput {...props} />
      </motion.div>

      <motion.section variants={itemVariants} className="col-span-1 xl:col-span-2">
        <Audience {...props} />
      </motion.section>
    </motion.main>
  );
}

export default Broadcast;