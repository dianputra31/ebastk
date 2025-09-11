export interface UnitCategory {
  id: number;
  category_name: string;
}

export interface ApiUnitCategoryResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  results: UnitCategory[];
}