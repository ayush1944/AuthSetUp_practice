-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "lastPasswordResetSentAt" TIMESTAMP(3),
ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 0;
