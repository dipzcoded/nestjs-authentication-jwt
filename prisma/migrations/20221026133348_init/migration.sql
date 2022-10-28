/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `posts` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `userName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_userName_key` ON `users`(`userName`);
