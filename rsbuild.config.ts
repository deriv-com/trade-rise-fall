import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

const path = require("path");

export default defineConfig({
  plugins: [
    pluginSass({
      sassLoaderOptions: {
        sourceMap: true,
        sassOptions: {},
      },
      exclude: /node_modules/,
    }),
    pluginReact(),
  ],
  source: {
    entry: {
      index: "./src/main.jsx",
    },
    define: {
      "process.env": JSON.stringify(process.env),
    },
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  output: {
    copy: [
      {
        from: "node_modules/@deriv/deriv-charts/dist/*",
        to: "js/smartcharts/[name][ext]",
        globOptions: {
          ignore: ["**/*.LICENSE.txt"],
        },
      },
      {
        from: "node_modules/@deriv/deriv-charts/dist/chart/assets/*",
        to: "assets/[name][ext]",
      },
      {
        from: "node_modules/@deriv/deriv-charts/dist/chart/assets/fonts/*",
        to: "assets/fonts/[name][ext]",
      },
      {
        from: "node_modules/@deriv/deriv-charts/dist/chart/assets/shaders/*",
        to: "assets/shaders/[name][ext]",
      },
    ],
  },
  html: {
    template: "./index.html",
  },
  server: {
    port: 8443,
    compress: true,
  },
  dev: {
    hmr: true,
  },
  tools: {
    rspack: {
      module: {
        rules: [
          {
            test: /\.xml$/,
            exclude: /node_modules/,
            use: "raw-loader",
          },
        ],
      },
    },
  },
});
