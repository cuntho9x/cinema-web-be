-- CreateTable
CREATE TABLE `orders` (
    `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `schedule_showtime_id` INTEGER NOT NULL,
    `order_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total_price` INTEGER NOT NULL,
    `discount` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',

    INDEX `orders_user_id_idx`(`user_id`),
    INDEX `orders_schedule_showtime_id_idx`(`schedule_showtime_id`),
    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `ticket_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `seat_id` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'USED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `ticket_code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tickets_ticket_code_key`(`ticket_code`),
    INDEX `tickets_order_id_idx`(`order_id`),
    INDEX `tickets_seat_id_idx`(`seat_id`),
    PRIMARY KEY (`ticket_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_schedule_showtime_id_fkey` FOREIGN KEY (`schedule_showtime_id`) REFERENCES `ScheduleShowtime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_seat_id_fkey` FOREIGN KEY (`seat_id`) REFERENCES `seats`(`seat_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
