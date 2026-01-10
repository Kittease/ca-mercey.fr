import "dotenv/config";
import type { PrismaConfig } from "prisma";

export default {
  schema: "prisma/schemas/",
} satisfies PrismaConfig;
