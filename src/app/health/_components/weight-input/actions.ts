"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { Routes } from "@/lib/routes";

export async function addWeight(weight: number) {
  const now = new Date();
  now.setSeconds(0, 0);

  await prisma.$queryRaw`INSERT INTO health.weight (weight, recorded_at) VALUES (${weight}, ${now});`;

  revalidatePath(Routes.HEALTH);
}