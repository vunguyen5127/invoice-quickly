-- Add payment details and next billing date to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS card_brand TEXT,
ADD COLUMN IF NOT EXISTS card_last4 TEXT,
ADD COLUMN IF NOT EXISTS next_billed_at TIMESTAMPTZ;

-- Update the types for consistency
COMMENT ON COLUMN public.subscriptions.card_brand IS 'Brand of the credit card (e.g., Visa, Mastercard)';
COMMENT ON COLUMN public.subscriptions.card_last4 IS 'Last 4 digits of the credit card';
COMMENT ON COLUMN public.subscriptions.next_billed_at IS 'The date when the next payment will be attempted';
