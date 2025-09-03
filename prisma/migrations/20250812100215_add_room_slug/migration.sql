/*
  Warnings:

  - A unique constraint covering the columns `[theater_id,room_name]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `rooms_theater_id_room_name_key` ON `rooms`(`theater_id`, `room_name`);
