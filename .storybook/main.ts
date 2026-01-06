
import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  staticDirs: ["../public/"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
  ],
  async viteFinal(config) {
    // Explicitly set up alias for Storybook's Vite builder
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, '../src'),
    };

    // If you use vite-tsconfig-paths, ensure it's included here too
    if (config.plugins) {
      const tsconfigPaths = require('vite-tsconfig-paths').default;
      config.plugins.push(tsconfigPaths());
    }

    return config;
  },
  framework: "@storybook/react-vite",
};
export default config;
