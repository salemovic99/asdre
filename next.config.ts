import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server bundle for small production images.
  output: "standalone",
};

export default nextConfig;
