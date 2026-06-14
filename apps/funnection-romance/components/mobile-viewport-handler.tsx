"use client";

import { useEffect } from "react";

const MobileViewportHandler = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleFocusIn = () => {
        document.body.style.overflow = "hidden";
      };

      const handleFocusOut = () => {
        document.body.style.overflow = "";
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      };

      window.addEventListener("focusin", handleFocusIn);
      window.addEventListener("focusout", handleFocusOut);

      return () => {
        window.removeEventListener("focusin", handleFocusIn);
        window.removeEventListener("focusout", handleFocusOut);
      };
    }
  }, []);

  return null;
};

export default MobileViewportHandler;
