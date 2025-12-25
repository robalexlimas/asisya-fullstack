CREATE OR REPLACE FUNCTION sp_create_product(
  p_name text,
  p_sku text,
  p_price numeric,
  p_category_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE v_id uuid;
BEGIN
  v_id := gen_random_uuid();

  INSERT INTO products (id, name, sku, price, category_id)
  VALUES (v_id, p_name, p_sku, p_price, p_category_id);

  RETURN v_id;
END;
$$;
