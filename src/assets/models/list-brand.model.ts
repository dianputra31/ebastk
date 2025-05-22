export interface Brand {
  id: number;
  brand_name: string;
}

export interface ApiBrandResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  results: Brand[];
}