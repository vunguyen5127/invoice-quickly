"use client";

import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function Tooltip({ 
  content, 
  children, 
  position = "top", 
  delay = 300 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimer(timeout);
  };

  const hideTooltip = () => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div 
      className="relative inline-flex group"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && content && (
        <div className={`
          absolute z-[100] w-max max-w-[280px] px-2.5 py-1.5 
          bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100 
          text-[11px] font-medium rounded-[5px] shadow-xl 
          ring-1 ring-white/10 pointer-events-none 
          animate-in fade-in zoom-in-95 duration-150
          ${positionClasses[position]}
        `}>
          {content}
          {/* Arrow / Tip */}
          <div className={`
            absolute w-2 h-2 bg-zinc-900 dark:bg-zinc-800 rotate-45
            ${position === "top" ? "top-full left-1/2 -translate-x-1/2 -mt-1" : ""}
            ${position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 -mb-1" : ""}
            ${position === "left" ? "left-full top-1/2 -translate-y-1/2 -ml-1" : ""}
            ${position === "right" ? "right-full top-1/2 -translate-y-1/2 -mr-1" : ""}
          `} />
        </div>
      )}
    </div>
  );
}
