-- CreateTable
CREATE TABLE `ScheduleList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movie_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScheduleShowtime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movie_id` INTEGER NOT NULL,
    `theater_id` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,
    `show_date` DATETIME(3) NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `graphics_type` ENUM('2D', '3D', 'IMAX') NOT NULL,
    `translation_type` ENUM('Lồng Tiếng', 'Phụ Đề') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ScheduleList` ADD CONSTRAINT `ScheduleList_movie_id_fkey` FOREIGN KEY (`movie_id`) REFERENCES `Movie`(`movie_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduleShowtime` ADD CONSTRAINT `ScheduleShowtime_movie_id_fkey` FOREIGN KEY (`movie_id`) REFERENCES `Movie`(`movie_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduleShowtime` ADD CONSTRAINT `ScheduleShowtime_theater_id_fkey` FOREIGN KEY (`theater_id`) REFERENCES `Theater`(`theater_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduleShowtime` ADD CONSTRAINT `ScheduleShowtime_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`room_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
