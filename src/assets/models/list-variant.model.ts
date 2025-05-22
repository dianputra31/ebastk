export interface VehicleModel {
  id: number;
  model_name: string;
  variant_name: string;
}

export interface ApiVariantResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  results: VehicleModel[];
}