export interface AcademiaCategory {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface AcademiaExam {
  id: number;
  category_id: number;
  slug: string;
  title: string;
  description: string;
  is_premium: boolean;
  time_limit_minutes: number;
  question_count?: number;
}

export interface AcademiaQuestion {
  id: number;
  exam_id: number;
  order: number;
  question: string;
  options: { id: string; text: string }[];
  correct_answer: string;
  explanation: string;
}

export interface AcademiaAttempt {
  id: number;
  user_id: string;
  exam_id: number;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  answers: Record<number, string>;
  time_spent_seconds: number | null;
}
