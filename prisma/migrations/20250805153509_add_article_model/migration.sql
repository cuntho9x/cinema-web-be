/*
  Warnings:

  - Made the column `map_url` on table `theater` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `theater` MODIFY `map_url` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `Article` (
    `article_id` INTEGER NOT NULL AUTO_INCREMENT,
    `article_title` VARCHAR(255) NOT NULL,
    `article_slug` VARCHAR(191) NOT NULL,
    `article_thumbnail` TEXT NOT NULL,
    `article_type` VARCHAR(20) NOT NULL,
    `article_content1` LONGTEXT NOT NULL,
    `article_image1` TEXT NOT NULL,
    `article_content2` LONGTEXT NOT NULL,
    `article_image2` TEXT NOT NULL,
    `article_content3` LONGTEXT NOT NULL,

    UNIQUE INDEX `Article_article_slug_key`(`article_slug`),
    PRIMARY KEY (`article_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
