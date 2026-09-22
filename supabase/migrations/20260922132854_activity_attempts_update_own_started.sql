create policy "activity_attempts_update_own_started"
on public.activity_attempts
for update
to authenticated
using (
  (select auth.uid()) = student_id
  and completion_state = 'started'
)
with check (
  (select auth.uid()) = student_id
  and completion_state = 'submitted'
);
