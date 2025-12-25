CREATE TABLE IF NOT EXISTS import_jobs (
  id uuid PRIMARY KEY,
  type text NOT NULL,
  status text NOT NULL, -- Queued, Processing, Completed, Failed
  filename text NOT NULL,
  total_rows bigint NOT NULL DEFAULT 0,
  processed_rows bigint NOT NULL DEFAULT 0,
  inserted_rows bigint NOT NULL DEFAULT 0,
  failed_rows bigint NOT NULL DEFAULT 0,
  error text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz NULL,
  finished_at timestamptz NULL
);

CREATE INDEX IF NOT EXISTS ix_import_jobs_status ON import_jobs(status);
CREATE INDEX IF NOT EXISTS ix_import_jobs_created_at ON import_jobs(created_at);
