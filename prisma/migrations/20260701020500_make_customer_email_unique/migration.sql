-- Keep the oldest customer email in each duplicate group and clear duplicates.
-- Email is optional, so NULL remains valid and can appear multiple times.
WITH ranked_customers AS (
	SELECT
		id,
		ROW_NUMBER() OVER (PARTITION BY email ORDER BY "createdAt" ASC, id ASC) AS row_number
	FROM "Customer"
	WHERE email IS NOT NULL
)
UPDATE "Customer"
SET email = NULL
WHERE id IN (
	SELECT id
	FROM ranked_customers
	WHERE row_number > 1
);

CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
