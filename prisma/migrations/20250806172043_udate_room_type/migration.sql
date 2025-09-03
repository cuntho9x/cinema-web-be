/*
  Warnings:

  - The values [TWO_D,THREE_D] on the enum `rooms_room_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `rooms` MODIFY `room_type` ENUM('2D', '3D', 'IMAX') NOT NULL;
