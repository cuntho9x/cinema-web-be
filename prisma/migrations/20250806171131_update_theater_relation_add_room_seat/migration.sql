-- CreateTable
CREATE TABLE `rooms` (
    `room_id` INTEGER NOT NULL AUTO_INCREMENT,
    `theater_id` INTEGER NOT NULL,
    `room_name` VARCHAR(100) NOT NULL,
    `row` INTEGER NOT NULL,
    `column` INTEGER NOT NULL,
    `room_type` ENUM('TWO_D', 'THREE_D', 'IMAX') NOT NULL,

    PRIMARY KEY (`room_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seats` (
    `seat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_id` INTEGER NOT NULL,
    `row_label` VARCHAR(2) NOT NULL,
    `column_number` INTEGER NOT NULL,
    `seat_code` VARCHAR(10) NOT NULL,
    `seat_type` ENUM('STANDARD', 'VIP', 'COUPLE') NOT NULL,
    `status` ENUM('AVAILABLE', 'SELECTED', 'SOLD', 'UNAVAILABLE') NOT NULL,

    UNIQUE INDEX `seats_room_id_seat_code_key`(`room_id`, `seat_code`),
    PRIMARY KEY (`seat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_theater_id_fkey` FOREIGN KEY (`theater_id`) REFERENCES `Theater`(`theater_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seats` ADD CONSTRAINT `seats_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`room_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
