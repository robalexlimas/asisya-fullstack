CREATE OR REPLACE FUNCTION sp_update_product(
  p_id UUID,
  p_name VARCHAR,
  p_price NUMERIC,
  p_category_id UUID
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows INT;
BEGIN
  UPDATE products
  SET
    name = COALESCE(p_name, name),
    price = COALESCE(p_price, price),
    category_id = COALESCE(p_category_id, category_id),
    updated_at = NOW()
  WHERE id = p_id;

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows;
END;
$$;

CREATE OR REPLACE FUNCTION sp_delete_product(p_id UUID)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  v_rows INT;
BEGIN
  DELETE FROM products WHERE id = p_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows;
END;
$$;
