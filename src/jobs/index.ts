import { Queue, Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { logger } from "@/lib/logger";

// Create Queues
export const emailQueue = new Queue("email-queue", { connection: redis });
export const aiQueue = new Queue("ai-queue", { connection: redis });

// Initialize Workers
export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    logger.info(`Processing email job ${job.id}`);
    // Logic to send email via Resend
  },
  { connection: redis }
);

export const aiWorker = new Worker(
  "ai-queue",
  async (job) => {
    logger.info(`Processing AI job ${job.id}`);
    // Logic to call OpenAI provider
  },
  { connection: redis }
);

emailWorker.on("completed", (job) => {
  logger.info(`Email Job ${job.id} has completed!`);
});

emailWorker.on("failed", (job, err) => {
  logger.error(`Email Job ${job?.id} has failed with ${err.message}`);
});
