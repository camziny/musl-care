"use client";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface FormProgressProps {
  totalSteps: number;
  completedSteps: number;
}

export function FormProgress({ totalSteps, completedSteps }: FormProgressProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const percentage = (completedSteps / totalSteps) * 100;
    setProgress(percentage);
  }, [completedSteps, totalSteps]);

  return (
    <div className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-slate-600">Form Progress</h2>
          <span className="text-sm font-medium text-slate-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="relative">
          <Progress 
            value={progress} 
            className="h-2 rounded-full" 
          />
        </div>
      </div>
    </div>
  );
} 