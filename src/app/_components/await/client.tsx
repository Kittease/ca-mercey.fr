"use client";

import { use } from "react";

const ClientSideAwait = <T,>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (result: T) => JSX.Element;
}) => {
  const data = use(promise);

  return children(data);
};

export default ClientSideAwait;
