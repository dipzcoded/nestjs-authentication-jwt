-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `userrole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `userrole_userId_fkey`;

-- AddForeignKey
ALTER TABLE `userrole` ADD CONSTRAINT `userrole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userrole` ADD CONSTRAINT `userrole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
