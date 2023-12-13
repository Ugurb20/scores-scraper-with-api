/*
  Warnings:

  - You are about to drop the column `awayTeamName` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `awayTeamScore` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `homeTeamName` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `homeTeamScore` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `matchStartUtc` on the `Match` table. All the data in the column will be lost.
  - Added the required column `away_team_name` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `away_team_score` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `home_team_name` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `home_team_score` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "awayTeamName",
DROP COLUMN "awayTeamScore",
DROP COLUMN "homeTeamName",
DROP COLUMN "homeTeamScore",
DROP COLUMN "matchStartUtc",
ADD COLUMN     "away_team_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "away_team_score" INTEGER NOT NULL,
ADD COLUMN     "home_team_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "home_team_score" INTEGER NOT NULL,
ADD COLUMN     "match_start_utc" VARCHAR(255);
