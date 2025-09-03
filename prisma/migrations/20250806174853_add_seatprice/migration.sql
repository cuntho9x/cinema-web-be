-- CreateTable
CREATE TABLE `Price` (
    `price_id` INTEGER NOT NULL AUTO_INCREMENT,
    `seat_type` ENUM('STANDARD', 'VIP', 'COUPLE') NOT NULL,
    `base_price` INTEGER NOT NULL,

    UNIQUE INDEX `Price_seat_type_key`(`seat_type`),
    PRIMARY KEY (`price_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
