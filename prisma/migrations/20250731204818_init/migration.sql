-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `hash_password` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `birthday` DATETIME(3) NULL,
    `address` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'customer',
    `avatar_img` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `registered_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movie` (
    `movie_id` INTEGER NOT NULL AUTO_INCREMENT,
    `movie_poster` VARCHAR(255) NULL,
    `movie_trailer` VARCHAR(255) NULL,
    `movie_title` VARCHAR(200) NOT NULL,
    `movie_title_url` VARCHAR(255) NOT NULL,
    `duration` INTEGER NOT NULL,
    `release_date` DATETIME(3) NOT NULL,
    `movie_review` TEXT NULL,
    `country` ENUM('Việt Nam', 'Mỹ', 'Hàn Quốc', 'Nhật Bản') NOT NULL,
    `movie_producer` VARCHAR(100) NOT NULL,
    `directors` VARCHAR(255) NULL,
    `cast` TEXT NULL,
    `movie_description` TEXT NULL,
    `status` ENUM('nowShowing', 'comingSoon', 'stopped') NOT NULL,
    `graphics_type` ENUM('2D', '3D', 'IMAX') NOT NULL DEFAULT '2D',
    `translation_type` ENUM('Lồng Tiếng', 'Phụ Đề') NOT NULL DEFAULT 'Phụ Đề',
    `age_restriction` ENUM('Phù hợp với mọi lứa tuổi', 'Cấm dưới 13 tuổi', 'Cấm dưới 16 tuổi', 'Cấm dưới 18 tuổi') NOT NULL DEFAULT 'Phù hợp với mọi lứa tuổi',

    UNIQUE INDEX `Movie_movie_title_url_key`(`movie_title_url`),
    PRIMARY KEY (`movie_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Genre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Genre_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MovieGenres` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MovieGenres_AB_unique`(`A`, `B`),
    INDEX `_MovieGenres_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_MovieGenres` ADD CONSTRAINT `_MovieGenres_A_fkey` FOREIGN KEY (`A`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MovieGenres` ADD CONSTRAINT `_MovieGenres_B_fkey` FOREIGN KEY (`B`) REFERENCES `Movie`(`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE;
