import type { ActionFunctionArgs } from "react-router";
import { createClient } from "@supabase/supabase-js";

interface GradeRequestBody {
  examId: number;
  answers: Record<string, string>;
}

interface AcademiaOption {
  id: string;
  text?: string;
}

interface GradeQuestionRow {
  id: number;
  correct_answer: string;
  options: unknown;
}

interface ThrottleEntry {
  count: number;
  windowStartedAt: number;
}

const THROTTLE_WINDOW_MS = 10 * 60 * 1000;
const THROTTLE_MAX_REQUESTS = 8;
const throttleStore = new Map<string, ThrottleEntry>();

function jsonResponse(payload: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

function isValidOptionId(value: string): boolean {
  return /^[a-zA-Z]$/.test(value);
}

function parseQuestionOptions(options: unknown): AcademiaOption[] | null {
  if (!Array.isArray(options)) {
    return null;
  }

  const parsed = options.filter((option): option is AcademiaOption => {
    return Boolean(
      option
      && typeof option === "object"
      && "id" in option
      && typeof option.id === "string"
      && isValidOptionId(option.id)
    );
  });

  if (parsed.length !== options.length) {
    return null;
  }

  return parsed;
}

function validateAndNormalizeAnswers(rawAnswers: unknown): Map<number, string> | null {
  if (!rawAnswers || typeof rawAnswers !== "object" || Array.isArray(rawAnswers)) {
    return null;
  }

  const normalizedAnswers = new Map<number, string>();

  for (const [rawKey, rawValue] of Object.entries(rawAnswers)) {
    if (!/^\d+$/.test(rawKey)) {
      return null;
    }

    if (typeof rawValue !== "string" || !isValidOptionId(rawValue)) {
      return null;
    }

    const questionId = Number(rawKey);
    if (!Number.isInteger(questionId) || questionId <= 0) {
      return null;
    }

    normalizedAnswers.set(questionId, rawValue.toLowerCase());
  }

  return normalizedAnswers;
}

function isThrottled(key: string, now: number): boolean {
  const current = throttleStore.get(key);
  if (!current) {
    throttleStore.set(key, { count: 1, windowStartedAt: now });
    return false;
  }

  if (now - current.windowStartedAt > THROTTLE_WINDOW_MS) {
    throttleStore.set(key, { count: 1, windowStartedAt: now });
    return false;
  }

  if (current.count >= THROTTLE_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  throttleStore.set(key, current);
  return false;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  try {
    const body = (await request.json()) as GradeRequestBody;
    const examId = Number(body.examId);
    const normalizedAnswers = validateAndNormalizeAnswers(body.answers);

    if (!Number.isInteger(examId) || examId <= 0 || !normalizedAnswers) {
      return jsonResponse({ error: "invalid_payload" }, 400);
    }

    const throttleKey = `${getClientIp(request)}:${examId}`;
    if (isThrottled(throttleKey, Date.now())) {
      return jsonResponse({ error: "too_many_requests" }, 429);
    }

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin
      .from("academia_questions")
      .select("id, options, correct_answer")
      .eq("exam_id", examId)
      .order("order", { ascending: true });

    if (error || !data) {
      return jsonResponse({ error: "unable_to_grade_exam" }, 500);
    }

    const questions = data as GradeQuestionRow[];

    if (questions.length === 0) {
      return jsonResponse({ error: "exam_not_found" }, 404);
    }

    if (normalizedAnswers.size !== questions.length) {
      return jsonResponse({ error: "incomplete_submission" }, 400);
    }

    const results: Record<number, boolean> = {};
    let correct = 0;

    for (const question of questions) {
      const options = parseQuestionOptions(question.options);
      if (!options || !isValidOptionId(question.correct_answer)) {
        return jsonResponse({ error: "invalid_exam_configuration" }, 500);
      }

      const userAnswer = normalizedAnswers.get(question.id);
      if (!userAnswer) {
        return jsonResponse({ error: "incomplete_submission" }, 400);
      }

      const validOptionIds = new Set(options.map((option) => option.id.toLowerCase()));
      if (!validOptionIds.has(userAnswer)) {
        return jsonResponse({ error: "invalid_answer_option" }, 400);
      }

      const isCorrect = userAnswer === question.correct_answer.toLowerCase();
      results[question.id] = isCorrect;
      if (isCorrect) {
        correct += 1;
      }
    }

    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

    return jsonResponse({ score, correct, totalQuestions, results }, 200);
  } catch {
    return jsonResponse({ error: "invalid_request_body" }, 400);
  }
}
