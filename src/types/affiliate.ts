export interface AffiliateTool {
  id: number;
  name: string;
  platform: string;
  category: string;
  description_es: string;
  description_en: string;
  url: string;
  accent_color: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type AffiliateToolInsert = Omit<AffiliateTool, "id" | "created_at" | "updated_at">;
