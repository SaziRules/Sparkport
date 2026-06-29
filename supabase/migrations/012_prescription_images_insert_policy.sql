-- prescription_images had no INSERT policy so every client-side insert was denied.
-- Service role (server actions) bypasses this entirely, but add the policy
-- so the table's RLS intent is explicit.

-- Users can insert images for their own prescriptions (logged-in submissions)
CREATE POLICY "prescription_images_insert_own" ON prescription_images
  FOR INSERT WITH CHECK (
    prescription_id IN (
      SELECT id FROM prescriptions WHERE user_id = auth.uid()
    )
  );

-- Anonymous submissions: allow insert when the prescription has no owner
CREATE POLICY "prescription_images_insert_anonymous" ON prescription_images
  FOR INSERT WITH CHECK (
    prescription_id IN (
      SELECT id FROM prescriptions WHERE user_id IS NULL
    )
  );
