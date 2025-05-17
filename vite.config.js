import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // allow AWS EC2 host for API proxying / HMR
    allowedHosts: [
      "ec2-13-53-207-206.eu-north-1.compute.amazonaws.com"
    ],
    // if you also need to accept any host, you can use:
    // allowedHosts: "all",
  }
});
