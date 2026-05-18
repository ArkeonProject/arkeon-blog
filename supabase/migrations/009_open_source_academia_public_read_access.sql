-- Open-source temporary public read access for Academia catalog/exams
-- while keeping answer keys protected via the safe questions view.
--
-- FUTURE ANNOTATION (rollback when monetization returns):
-- 1) drop policy if exists "open source can read academia categories" on public.academia_categories;
-- 2) drop policy if exists "open source can read academia exams" on public.academia_exams;
-- 3) revoke select on public.academia_categories from anon, authenticated;
-- 4) revoke select on public.academia_exams from anon, authenticated;
-- 5) keep 008 protections in place (no direct select on public.academia_questions).

drop policy if exists "open source can read academia categories" on public.academia_categories;
create policy "open source can read academia categories"
  on public.academia_categories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "open source can read academia exams" on public.academia_exams;
create policy "open source can read academia exams"
  on public.academia_exams
  for select
  to anon, authenticated
  using (true);

grant select on public.academia_categories to anon, authenticated;
grant select on public.academia_exams to anon, authenticated;

-- Preserve finding #2 security model: correct_answer stays inaccessible to clients.
revoke all on public.academia_questions from anon, authenticated;
grant select on public.academia_questions_public to anon, authenticated;
