-- Add resident_id column to incomes table
-- This allows associating income with a specific resident or leaving it null for distribution

ALTER TABLE incomes ADD COLUMN IF NOT EXISTS resident_id INTEGER REFERENCES residents(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_incomes_resident_id ON incomes(resident_id);
