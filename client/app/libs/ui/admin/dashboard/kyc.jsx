"use client";

import { motion } from "motion/react";
import { useKYC } from "@/app/admin/api/kyc/get-kycs";
import PendingKYCWidget from "./kyc-widget";
import KYCConversionWidget from "./kyc-conversion-widget";
import { containerVariants, itemVariants } from "../kyc/variants";

export default function AdminKYC() {
  const { kyc: allKyc, isLoading, isRefetching } = useKYC({
    skip: 0,
    limit: 5,
  });

  const kycList = allKyc?.kyc?.submitted_kycs;
  const pendingKyc = kycList?.filter((item) => item?.status === "pending");

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3">
        <PendingKYCWidget
          pendingKyc={pendingKyc}
          isLoading={isLoading}
          isRefetching={isRefetching}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2">
        <KYCConversionWidget kyc={allKyc?.kyc} />
      </motion.div>
    </motion.section>
  );
}