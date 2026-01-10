/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "tesseract.js",
    "pino",
    "pino-pretty",
    "thread-stream",
  ],
  outputFileTracingIncludes: {
    "/**/*": ["./node_modules/**/*.wasm", "./node_modules/**/*.proto"],
  },
  typedRoutes: true,
  cacheComponents: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "is1-ssl.mzstatic.com",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/image/**",
      },
    ],
  },
};

export default nextConfig;
