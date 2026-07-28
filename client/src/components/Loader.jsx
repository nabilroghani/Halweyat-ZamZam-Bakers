import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="w-12 h-12 border-4 border-[#C9982F]/20 border-t-[#7B1E3A] rounded-full"
      />
      <p className="font-heading text-sm text-[#3D2418] tracking-widest uppercase font-semibold animate-pulse">
        Baking Fresh Delights...
      </p>
    </div>
  );
}
