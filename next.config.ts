import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // esconde a bolinha "N" das ferramentas do Next em modo dev (em produção nunca aparece)
  devIndicators: false,
};

export default nextConfig;
