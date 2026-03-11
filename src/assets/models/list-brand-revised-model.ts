export interface CarModel {
  id: number;
  model_name: string;
  variant_name: string;
}

export interface CarModelResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  results: CarModel[];
}