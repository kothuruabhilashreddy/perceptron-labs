/*
  Warnings:

  - You are about to drop the column `likeCount` on the `Simulation` table. All the data in the column will be lost.
  - Added the required column `title` to the `Simulation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "SimulationLike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "simulationId" TEXT NOT NULL,
    "clientIp" TEXT NOT NULL,
    "likeType" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SimulationLike_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Simulation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Simulation" ("comment", "createdAt", "id", "name") SELECT "comment", "createdAt", "id", "name" FROM "Simulation";
DROP TABLE "Simulation";
ALTER TABLE "new_Simulation" RENAME TO "Simulation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SimulationLike_simulationId_clientIp_likeType_key" ON "SimulationLike"("simulationId", "clientIp", "likeType");
