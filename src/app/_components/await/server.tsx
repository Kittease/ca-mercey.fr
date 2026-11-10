import { ReactNode } from "react";
import "server-only";

const ServerSideAwait = async <T,>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (result: T) => ReactNode;
}) => {
  try {
    const result = await promise;

    return children(result);
  } catch {
    return null;
  }
};

export default ServerSideAwait;
