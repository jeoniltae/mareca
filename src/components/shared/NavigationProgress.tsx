"use client";

import NextTopLoader from "nextjs-toploader";

export function NavigationProgress() {
  return (
    <NextTopLoader
      color="#2563eb"
      height={3}
      speed={500}
      showSpinner={true}
      shadow="0 0 10px #2563eb, 0 0 5px #2563eb"
    />
  );
}
