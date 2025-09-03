/*
  Warnings:

  - You are about to drop the `price` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `price`;

-- CreateTable
CREATE TABLE `SeatPrice` (
    `price_id` INTEGER NOT NULL AUTO_INCREMENT,
    `seat_type` ENUM('STANDARD', 'VIP', 'COUPLE') NOT NULL,
    `base_price` INTEGER NOT NULL,

    UNIQUE INDEX `SeatPrice_seat_type_key`(`seat_type`),
    PRIMARY KEY (`price_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
