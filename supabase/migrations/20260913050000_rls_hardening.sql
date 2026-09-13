-- DB-004: RLS hardening
-- Tighten teacher ownership and student submission/assessment access.

-- Challenges: teacher may only create/update/delete challenges
-- attached to activities they own. Admin remains unrestricted.
drop policy if exists challenges_insert_teacher on public.challenges;
create policy challenges_insert_teacher
on public.challenges
for insert
with check (
  private.is_admin()
  or (
    private.is_teacher()
    and exists (
      select 1
      from public.activities a
      where a.id = activity_id
        and a.created_by = auth.uid()
    )
  )
);

drop policy if exists challenges_update_teacher on public.challenges;
create policy challenges_update_teacher
on public.challenges
for update
using (
  private.is_admin()
  or (
    private.is_teacher()
    and exists (
      select 1
      from public.activities a
      where a.id = challenges.activity_id
        and a.created_by = auth.uid()
    )
  )
)
with check (
  private.is_admin()
  or (
    private.is_teacher()
    and exists (
      select 1
      from public.activities a
      where a.id = challenges.activity_id
        and a.created_by = auth.uid()
    )
  )
);

drop policy if exists challenges_delete_teacher on public.challenges;
create policy challenges_delete_teacher
on public.challenges
for delete
using (
  private.is_admin()
  or (
    private.is_teacher()
    and exists (
      select 1
      from public.activities a
      where a.id = challenges.activity_id
        and a.created_by = auth.uid()
    )
  )
);

-- Music compositions: teacher access requires an authorized student relationship.
drop policy if exists music_compositions_insert_own on public.music_compositions;
create policy music_compositions_insert_own
on public.music_compositions
for insert
with check (
  student_id = auth.uid()
  or private.is_teacher_of_student(student_id)
  or private.is_admin()
);

drop policy if exists music_compositions_update_teacher on public.music_compositions;
create policy music_compositions_update_teacher
on public.music_compositions
for update
using (
  student_id = auth.uid()
  or private.is_teacher_of_student(student_id)
  or private.is_admin()
)
with check (
  student_id = auth.uid()
  or private.is_teacher_of_student(student_id)
  or private.is_admin()
);

-- Music events: access follows the composition owner/teacher relationship.
drop policy if exists music_events_insert_authorized on public.music_events;
create policy music_events_insert_authorized
on public.music_events
for insert
with check (
  exists (
    select 1
    from public.music_compositions mc
    where mc.id = composition_id
      and (
        mc.student_id = auth.uid()
        or private.is_teacher_of_student(mc.student_id)
        or private.is_admin()
      )
  )
);

drop policy if exists music_events_update_authorized on public.music_events;
create policy music_events_update_authorized
on public.music_events
for update
using (
  exists (
    select 1
    from public.music_compositions mc
    where mc.id = music_events.composition_id
      and (
        mc.student_id = auth.uid()
        or private.is_teacher_of_student(mc.student_id)
        or private.is_admin()
      )
  )
)
with check (
  exists (
    select 1
    from public.music_compositions mc
    where mc.id = music_events.composition_id
      and (
        mc.student_id = auth.uid()
        or private.is_teacher_of_student(mc.student_id)
        or private.is_admin()
      )
  )
);

-- Project submissions: students may edit only their own drafts.
-- Once submitted, the row becomes immutable through this student policy.
drop policy if exists project_submissions_update_own_draft
on public.project_submissions;

create policy project_submissions_update_own_draft
on public.project_submissions
for update
using (
  student_id = auth.uid()
  and status = 'draft'
)
with check (
  student_id = auth.uid()
  and status in ('draft', 'submitted')
);

-- Students must be able to read their own assessment results.
drop policy if exists assessments_select_own_or_teacher
on public.assessments;

create policy assessments_select_own_or_teacher
on public.assessments
for select
using (
  teacher_id = auth.uid()
  or private.is_teacher_of_student((
    select ps.student_id
    from public.project_submissions ps
    where ps.id = assessments.project_submission_id
  ))
  or exists (
    select 1
    from public.project_submissions ps
    where ps.id = assessments.project_submission_id
      and ps.student_id = auth.uid()
  )
  or private.is_admin()
);
