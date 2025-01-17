import React, { Suspense } from "react";

export default function LoadingWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      {children}
    </Suspense>
  );
}
