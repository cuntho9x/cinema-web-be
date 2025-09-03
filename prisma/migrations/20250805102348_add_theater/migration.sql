-- CreateTable
CREATE TABLE `Theater` (
    `theater_id` INTEGER NOT NULL AUTO_INCREMENT,
    `theater_name` VARCHAR(100) NOT NULL,
    `theater_address` TEXT NOT NULL,
    `theater_phoneNumber` VARCHAR(20) NOT NULL,
    `map_url` VARCHAR(191) NULL,
    `theater_title_url` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Theater_theater_title_url_key`(`theater_title_url`),
    PRIMARY KEY (`theater_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
