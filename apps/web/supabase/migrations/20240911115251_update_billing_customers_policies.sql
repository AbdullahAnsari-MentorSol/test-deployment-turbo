-- Add insert policy for authenticated users on billing_customers table
CREATE POLICY billing_customers_insert_authenticated
ON public.billing_customers
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add insert policy for anon users on billing_customers table
CREATE POLICY billing_customers_insert_backend
ON public.billing_customers
FOR INSERT
TO anon
WITH CHECK (true);

-- Add insert policy for authenticated users on subscriptions table
CREATE POLICY subscriptions_insert_authenticated
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add insert policy for anon users on subscriptions table
CREATE POLICY subscriptions_insert_backend
ON public.subscriptions
FOR INSERT
TO anon
WITH CHECK (true);

-- Add insert policy for authenticated users on subscription_items table
CREATE POLICY subscription_items_insert_authenticated
ON public.subscription_items
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add insert policy for anon users on subscription_items table
CREATE POLICY subscription_items_insert_backend
ON public.subscription_items
FOR INSERT
TO anon
WITH CHECK (true);

-- Grant INSERT privileges on billing_customers table to authenticated 
GRANT INSERT ON public.billing_customers TO authenticated;

-- Grant INSERT privileges on subscriptions table to authenticated 
GRANT INSERT ON public.subscriptions TO authenticated;

-- Grant INSERT privileges on subscription_items table to authenticated 
GRANT INSERT ON public.subscription_items TO authenticated;
