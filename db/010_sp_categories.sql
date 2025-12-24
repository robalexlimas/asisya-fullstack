CREATE OR REPLACE FUNCTION sp_create_category(
  p_name VARCHAR,
  p_photo_url TEXT
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  photo_url TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories(id, name, photo_url)
  VALUES (v_id, p_name, p_photo_url);

  RETURN QUERY
  SELECT c.id, c.name, c.photo_url, c.created_at
  FROM categories c
  WHERE c.id = v_id;
END;
$$;
