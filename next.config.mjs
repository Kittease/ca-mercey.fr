/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
  outputFileTracingIncludes: {
    "/**/*": ["./node_modules/**/*.wasm", "./node_modules/**/*.proto"],
  },
  typedRoutes: true,
  async redirects() {
    return [
      {
        source: "/iceland-aurora-forecast",
        destination: "/aurora",
        permanent: true,
      },
    ];
  },
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
