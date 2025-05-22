export interface Color {
  id: number;
  color_name: string;
}

export interface ApiColorResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  results: Color[];
}
