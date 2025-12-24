CREATE OR REPLACE FUNCTION sp_get_products(
  p_page INT,
  p_page_size INT,
  p_category_id UUID DEFAULT NULL,
  p_search TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  sku VARCHAR,
  price NUMERIC,
  category_name VARCHAR,
  total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.sku,
    p.price,
    c.name,
    COUNT(*) OVER()
  FROM products p
  JOIN categories c ON c.id = p.category_id
  WHERE
    (p_category_id IS NULL OR p.category_id = p_category_id)
    AND (p_search IS NULL OR p.name ILIKE '%' || p_search || '%')
  ORDER BY p.created_at DESC
  LIMIT p_page_size
  OFFSET (p_page - 1) * p_page_size;
END;
$$;
