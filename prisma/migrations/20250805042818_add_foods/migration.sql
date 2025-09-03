-- CreateTable
CREATE TABLE `foods` (
    `food_id` INTEGER NOT NULL AUTO_INCREMENT,
    `food_img` VARCHAR(255) NULL,
    `food_name` VARCHAR(100) NOT NULL,
    `food_description` TEXT NULL,
    `food_price` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`food_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
