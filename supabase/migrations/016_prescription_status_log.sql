CREATE TABLE prescription_status_log (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID        NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  status          TEXT        NOT NULL,
  actor_name      TEXT,
  actor_role      TEXT,
  note            TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_psl_prescription_id ON prescription_status_log(prescription_id);

ALTER TABLE prescription_status_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "managers_insert_log" ON prescription_status_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "managers_read_log" ON prescription_status_log
  FOR SELECT USING (true);
