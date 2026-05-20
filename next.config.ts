import type { NextConfig } from "next";
import { withGluestackUI } from "@gluestack/ui-next-adapter";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@gluestack-ui/themed"],
};

export default withGluestackUI(nextConfig);
