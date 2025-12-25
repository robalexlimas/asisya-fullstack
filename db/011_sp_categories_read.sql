CREATE OR REPLACE FUNCTION sp_get_categories(
  p_page integer,
  p_page_size integer,
  p_search text
)
RETURNS TABLE(
  id uuid,
  name varchar,
  photo_url text,
  created_at timestamptz,
  total_count bigint
)
LANGUAGE sql
AS $$
  WITH filtered AS (
    SELECT c.*
    FROM categories c
    WHERE (p_search IS NULL OR p_search = '' OR c.name ILIKE '%' || p_search || '%')
  ),
  counted AS (
    SELECT *, (SELECT COUNT(*) FROM filtered) AS total_count
    FROM filtered
    ORDER BY name ASC
    OFFSET (GREATEST(p_page, 1) - 1) * GREATEST(p_page_size, 1)
    LIMIT GREATEST(p_page_size, 1)
  )
  SELECT id, name, photo_url, created_at, total_count
  FROM counted;
$$;
