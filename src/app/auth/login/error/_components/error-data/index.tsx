const ErrorData = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const data: Record<string, unknown> = {};
  window.location.hash
    .slice(1)
    .split("&")
    .forEach((item) => {
      const [key = "", value = ""] = item.split("=");
      data[key] = value.replaceAll("+", " ");
    });

  return (
    <pre className="max-w-[50%] overflow-x-scroll rounded border bg-stone-800 p-12">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default ErrorData;
