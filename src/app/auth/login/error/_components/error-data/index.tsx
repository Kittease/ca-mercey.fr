const ErrorData = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const data: Record<string, unknown> = {};
  window.location.hash
    .slice(1)
    .split("&")
    .forEach((item) => {
      const split = item.split("=");
      data[split[0]] = split[1].replaceAll("+", " ");
    });

  return (
    <pre className="max-w-[50%] overflow-x-scroll rounded border bg-slate-800 p-12">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default ErrorData;
