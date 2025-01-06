// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import { config } from "dotenv";
config();

const tanstackConfig = defineConfig({});
export default tanstackConfig;
