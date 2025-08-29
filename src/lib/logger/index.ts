import pino from "pino";
import pretty from "pino-pretty";

import { config } from "@/lib/config";
import { NodeEnv } from "@/lib/config/types";

const logger = pino();

const devLogger = pino(
  pretty({
    colorize: true,
  }),
);

export default config.nodeEnv === NodeEnv.development ? devLogger : logger;
