-- Step 1: Create or replace the upsert_subscription function to include the tier parameter
CREATE OR REPLACE FUNCTION public.upsert_subscription (
    target_account_id uuid,
    target_customer_id varchar(255),
    target_subscription_id text,
    active bool,
    status public.subscription_status,
    billing_provider public.billing_provider,
    cancel_at_period_end bool,
    currency varchar(3),
    period_starts_at timestamptz,
    period_ends_at timestamptz,
    line_items jsonb,
    tier varchar(50),
    trial_starts_at timestamptz DEFAULT null,
    trial_ends_at timestamptz DEFAULT null
) RETURNS public.subscriptions
SET search_path = '' AS $$
DECLARE
    new_subscription public.subscriptions;
    new_billing_customer_id int;
BEGIN
    -- Insert or update billing customer
    INSERT INTO public.billing_customers (
        account_id,
        provider,
        customer_id
    ) VALUES (
        target_account_id,
        billing_provider,
        target_customer_id
    )
    ON CONFLICT (
        account_id,
        provider,
        customer_id
    ) DO UPDATE SET
        provider = EXCLUDED.provider
    RETURNING
        id INTO new_billing_customer_id;

    -- Insert or update subscription, including tier
    BEGIN
        INSERT INTO public.subscriptions (
            account_id,
            billing_customer_id,
            id,
            active,
            status,
            billing_provider,
            cancel_at_period_end,
            currency,
            period_starts_at,
            period_ends_at,
            trial_starts_at,
            trial_ends_at,
            tier
        ) VALUES (
            target_account_id,
            new_billing_customer_id,
            target_subscription_id,
            active,
            status,
            billing_provider,
            cancel_at_period_end,
            currency,
            period_starts_at,
            period_ends_at,
            trial_starts_at,
            trial_ends_at,
            tier
        )
        ON CONFLICT (id) DO UPDATE SET
            active = EXCLUDED.active,
            status = EXCLUDED.status,
            cancel_at_period_end = EXCLUDED.cancel_at_period_end,
            currency = EXCLUDED.currency,
            period_starts_at = EXCLUDED.period_starts_at,
            period_ends_at = EXCLUDED.period_ends_at,
            trial_starts_at = EXCLUDED.trial_starts_at,
            trial_ends_at = EXCLUDED.trial_ends_at,
            tier = EXCLUDED.tier
        RETURNING * INTO new_subscription;
    END;

    -- Upsert subscription items and delete ones that are not in the line_items array
    WITH item_data AS (
        SELECT
            (line_item ->> 'id')::varchar AS line_item_id,
            (line_item ->> 'product_id')::varchar AS prod_id,
            (line_item ->> 'variant_id')::varchar AS var_id,
            (line_item ->> 'type')::public.subscription_item_type AS type,
            (line_item ->> 'price_amount')::numeric AS price_amt,
            (line_item ->> 'quantity')::integer AS qty,
            (line_item ->> 'interval')::varchar AS intv,
            (line_item ->> 'interval_count')::integer AS intv_count
        FROM
            jsonb_array_elements(line_items) AS line_item
    ),
    line_item_ids AS (
        SELECT line_item_id FROM item_data
    ),
    deleted_items AS (
        DELETE FROM
            public.subscription_items
        WHERE
            public.subscription_items.subscription_id = new_subscription.id
            AND public.subscription_items.id NOT IN (SELECT line_item_id FROM line_item_ids)
        RETURNING *
    )
    INSERT INTO public.subscription_items (
        id,
        subscription_id,
        product_id,
        variant_id,
        type,
        price_amount,
        quantity,
        interval,
        interval_count
    )
    SELECT
        line_item_id,
        target_subscription_id,
        prod_id,
        var_id,
        type,
        price_amt,
        qty,
        intv,
        intv_count
    FROM
        item_data
    ON CONFLICT (id)
    DO UPDATE SET
        product_id = EXCLUDED.product_id,
        variant_id = EXCLUDED.variant_id,
        price_amount = EXCLUDED.price_amount,
        quantity = EXCLUDED.quantity,
        interval = EXCLUDED.interval,
        type = EXCLUDED.type,
        interval_count = EXCLUDED.interval_count;

    RETURN new_subscription;

END;
$$ LANGUAGE plpgsql;




-- Step 2: Grant execute permission on the updated function
GRANT EXECUTE ON FUNCTION public.upsert_subscription (
    uuid,
    varchar,
    text,
    bool,
    public.subscription_status,
    public.billing_provider,
    bool,
    varchar,
    timestamptz,
    timestamptz,
    jsonb,
    varchar(50),
    timestamptz,
    timestamptz
) TO service_role;


