import pino from "pino";
// eslint-disable-next-line import/no-extraneous-dependencies -- only used in dev environment
import pretty from "pino-pretty";

import { config } from "@/lib/config";
import { NodeEnv } from "@/lib/config/types";

const logger = pino();

const devLogger = pino(
  pretty({
    colorize: true,
  })
);

export default config.nodeEnv === NodeEnv.development ? devLogger : logger;
