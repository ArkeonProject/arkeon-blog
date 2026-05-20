-- Protect exam answer keys from client-side reads.
--
-- Goal:
-- - Keep grading server-side (service role) with access to correct_answer.
-- - Ensure anon/authenticated clients can only read public-safe question fields.
--
-- Rollback guidance:
-- 1) drop view if exists public.academia_questions_public;
-- 2) grant select on public.academia_questions to anon, authenticated;

create or replace view public.academia_questions_public
with (security_invoker = false)
as
select
  id,
  exam_id,
  "order",
  question,
  options,
  explanation
from public.academia_questions;

revoke all on public.academia_questions from anon, authenticated;
grant select on public.academia_questions_public to anon, authenticated;

comment on view public.academia_questions_public is
  'Public-safe academia questions view without correct_answer.';
