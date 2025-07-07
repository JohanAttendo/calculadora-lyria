
-- Add missing columns to customers table for company data
ALTER TABLE public.customers 
ADD COLUMN company_legal_name TEXT,
ADD COLUMN company_commercial_name TEXT,
ADD COLUMN cif TEXT,
ADD COLUMN company_phone TEXT,
ADD COLUMN company_email TEXT,
ADD COLUMN mobile TEXT;

-- Add index for CIF for better performance
CREATE INDEX idx_customers_cif ON public.customers(cif);
