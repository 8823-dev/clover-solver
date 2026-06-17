"use client";

import { useEffect, useState } from "react";

export const FontLoadingOverlay = () => {
  const [isFontLoading, setIsFontLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    document.fonts.ready
      .then(() => {
        if (isMounted) {
          setIsFontLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsFontLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isFontLoading) {
    return null;
  }

  return (
    <div
      className="font-loading-overlay"
      role="status"
      aria-label="画面を読み込み中"
    >
      <span className="font-loading-overlay__spinner" aria-hidden="true" />
    </div>
  );
};
