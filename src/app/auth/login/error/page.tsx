"use client";

import dynamic from "next/dynamic";

const ErrorData = dynamic(() => import("./_components/error-data"), {
  ssr: false,
});

const LoginError = () => {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-y-16">
      <h1 className="text-2xl">Quelque chose s&apos;est mal passé</h1>
      <ErrorData />
    </div>
  );
};

export default LoginError;
