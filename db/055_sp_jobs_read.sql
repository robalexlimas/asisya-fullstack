CREATE OR REPLACE FUNCTION sp_get_import_jobs(
  p_page INT,
  p_page_size INT
)
RETURNS TABLE(
  job_id UUID,
  status TEXT,
  total_rows BIGINT,
  processed_rows BIGINT,
  inserted_rows BIGINT,
  failed_rows BIGINT,
  error TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH q AS (
    SELECT
      j.job_id,
      j.status,
      j.total_rows,
      j.processed_rows,
      j.inserted_rows,
      j.failed_rows,
      j.error,
      j.created_at,
      j.updated_at
    FROM import_jobs j
    ORDER BY j.created_at DESC
    OFFSET GREATEST(p_page - 1, 0) * p_page_size
    LIMIT p_page_size
  ),
  c AS (
    SELECT COUNT(*)::bigint AS total_count
    FROM import_jobs
  )
  SELECT
    q.job_id,
    q.status,
    q.total_rows,
    q.processed_rows,
    q.inserted_rows,
    q.failed_rows,
    q.error,
    q.created_at,
    q.updated_at,
    c.total_count
  FROM q
  CROSS JOIN c;
END;
$$;
