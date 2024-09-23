CREATE OR REPLACE FUNCTION add_credit_to_account (
    target_account_id uuid,
    credit_interval INTERVAL
) RETURNS VOID AS $$
BEGIN
    -- Add the new credit interval to the existing credit value
    UPDATE accounts
    SET credit = credit + credit_interval
    WHERE id = target_account_id;

    -- Ensure no negative credit balances (optional)
    UPDATE accounts
    SET credit = '0 seconds'::INTERVAL
    WHERE id = target_account_id AND credit < '0 seconds'::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Grant EXECUTE permission on the add_credit_to_account function to the service_role
GRANT EXECUTE ON FUNCTION add_credit_to_account(uuid, INTERVAL) TO service_role;
