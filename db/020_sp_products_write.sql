CREATE OR REPLACE FUNCTION sp_generate_products(
  p_count INT,
  p_category_ids UUID[],
  p_batch_size INT DEFAULT 5000
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  v_inserted INT := 0;
  v_batch INT;
  v_len INT;
BEGIN
  v_len := array_length(p_category_ids, 1);

  IF v_len IS NULL OR v_len = 0 THEN
    RAISE EXCEPTION 'p_category_ids must contain at least 1 UUID';
  END IF;

  IF p_count IS NULL OR p_count <= 0 THEN
    RAISE EXCEPTION 'p_count must be > 0';
  END IF;

  IF p_batch_size IS NULL OR p_batch_size <= 0 THEN
    p_batch_size := 5000;
  END IF;

  WHILE v_inserted < p_count LOOP
    v_batch := LEAST(p_batch_size, p_count - v_inserted);

    INSERT INTO products (id, name, sku, price, category_id)
    SELECT
      gen_random_uuid(),
      'Product ' || (v_inserted + gs),
      'SKU-' || gen_random_uuid(),
      round((random() * 1000)::numeric, 2),
      p_category_ids[1 + floor(random() * v_len)::int]
    FROM generate_series(1, v_batch) gs;

    v_inserted := v_inserted + v_batch;
  END LOOP;

  RETURN v_inserted;
END;
$$;
