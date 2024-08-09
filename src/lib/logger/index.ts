import pino from "pino";
// eslint-disable-next-line import/no-extraneous-dependencies -- only used in dev environment
import pretty from "pino-pretty";

const logger = pino();

const devLogger = pino(
  pretty({
    colorize: true,
  })
);

export default process.env.NODE_ENV === "development" ? devLogger : logger;
