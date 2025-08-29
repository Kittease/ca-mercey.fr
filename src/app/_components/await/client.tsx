"use client";

import { ReactNode, use } from "react";

const ClientSideAwait = <T,>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (result: T) => ReactNode;
}) => {
  const data = use(promise);

  return children(data);
};

export default ClientSideAwait;
