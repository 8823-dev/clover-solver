"use client";

import { useEffect, useState } from "react";

export const LoadingOverlay = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    document.fonts.ready
      .then(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading-overlay" role="status" aria-label="画面を読み込み中">
      <span className="loading-overlay__spinner" aria-hidden="true" />
    </div>
  );
};
