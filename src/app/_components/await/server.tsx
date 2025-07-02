import "server-only";

const ServerSideAwait = async <T,>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (result: T) => JSX.Element;
}) => {
  try {
    const result = await promise;

    return children(result);
  } catch {
    return null;
  }
};

export default ServerSideAwait;
