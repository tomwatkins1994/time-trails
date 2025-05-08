CREATE TYPE "public"."place_manager" AS ENUM('NATIONAL_TRUST');--> statement-breakpoint
CREATE TABLE "places" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"town" varchar,
	"county" varchar,
	"imageUrl" varchar,
	"managedBy" "place_manager",
	"managerId" varchar,
	"managerWebsiteUrl" varchar
);
