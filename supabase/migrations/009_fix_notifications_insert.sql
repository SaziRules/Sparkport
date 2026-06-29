-- Users need INSERT on notifications to create their own (prescription submission)
CREATE POLICY "notifications_insert_own" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
