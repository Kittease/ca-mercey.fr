/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["tesseract.js"],
  outputFileTracingIncludes: {
    "/**/*": ["./node_modules/**/*.wasm", "./node_modules/**/*.proto"],
  },
  typedRoutes: true,
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
