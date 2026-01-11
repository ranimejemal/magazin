-- Create delivery status enum
CREATE TYPE public.delivery_status AS ENUM ('pending', 'preparing', 'out_for_delivery', 'delivered', 'failed');

-- Add delivery columns to orders table
ALTER TABLE public.orders
ADD COLUMN delivery_status public.delivery_status DEFAULT 'pending',
ADD COLUMN tracking_code TEXT,
ADD COLUMN estimated_delivery TIMESTAMP WITH TIME ZONE,
ADD COLUMN delivery_notes TEXT;