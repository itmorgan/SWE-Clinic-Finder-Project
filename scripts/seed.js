import { placeholderFeedbacks } from "./placeholder-data.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    placeholderFeedbacks.map(async (feedback) => {
      await prisma.feedback.create({
        data: {
          userId: feedback.userId,
          ratings: feedback.ratings,
          feature: feedback.feature,
          description: feedback.description,
          problemFaced: feedback.problemFaced,
          suggestion: feedback.suggestion,
          role: feedback.role,
        },
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error while seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
