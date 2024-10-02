/*
  Warnings:

  - You are about to drop the `SimulationLike` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Simulation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Simulation` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Simulation` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `userName` to the `Simulation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SimulationLike_simulationId_clientIp_likeType_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SimulationLike";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "simulationId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "voteType" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Simulation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "voteCount" BIGINT NOT NULL DEFAULT 0
);
INSERT INTO "new_Simulation" ("comment", "createdAt", "id", "title") SELECT "comment", "createdAt", "id", "title" FROM "Simulation";
DROP TABLE "Simulation";
ALTER TABLE "new_Simulation" RENAME TO "Simulation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
