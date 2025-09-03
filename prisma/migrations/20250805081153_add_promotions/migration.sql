-- CreateTable
CREATE TABLE `promotions` (
    `promotions_id` INTEGER NOT NULL AUTO_INCREMENT,
    `promotions_img` VARCHAR(255) NULL,
    `promotions_name` VARCHAR(100) NOT NULL,
    `promotions_description` TEXT NULL,

    PRIMARY KEY (`promotions_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
