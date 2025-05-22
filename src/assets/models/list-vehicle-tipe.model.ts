export interface VehicleType {
  id: number;
  type_name: string;
}

export interface ApiVehicleTypeResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  results: VehicleType[];
}