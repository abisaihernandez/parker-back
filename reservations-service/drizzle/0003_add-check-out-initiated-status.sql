ALTER TYPE "public"."reservation_status" ADD VALUE 'check-out-initiated' BEFORE 'canceled';--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET NOT NULL;
