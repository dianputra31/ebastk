export interface Brand {
    id: number;
    brand_name: string;
  }
  
  export interface Color {
    id: number;
    color_name: string;
  }
  
  export interface UnitImage {
    id: number;
    image_url: string;
    title: string | null;
    descriptions: string;
  }
  
  export interface UnitDocument {
    id: number;
    file_type: string;
    image_url: string;
  }
  
  export interface Mobilization {
    id: number;
    status: string;
    notes: string;
    mobiliztion_id: string;
    mobiliztion: DetailMobilization
  }

  export interface DetailMobilization {
    id: number;
    first_published_at: string;
    go_live_at: string;
    assignment_number: string;
    assignment_date: string;
    unit_location: string;
    pic: string;
    notes: string;
    status: string;
  }
  
  export interface VariantModel {
    id: number;
    model_name: string;
  }
  
  export interface Vendor {
    id: number;
    vendor_name: string;
  }
  
  export interface UnitDetailResponse {
    id: number;
    display_name: string;
    police_number: string;
    brand: Brand;
    transmission: string;
    unit_year: string;
    odo_meter: number;
    color: Color;
    unitimages: UnitImage[];
    thumbnail_url: string;
    unit_type: string;
    cc: number;
    unit_location: string;
    first_published_at: string;
    last_published_at: string;
    variant_model: VariantModel;
    bastk_file: string | null;
    bpkb: string;
    bpkb_name: string;
    bpkb_number: string;
    bastk_status: string;
    appraisal_status: string;
    vendor: Vendor;
    unitdocuments: UnitDocument[];
    proxy_file: string;
    chassis_number: string;
    engine_number: string;
    fuel: string;
    engine_grade: string;
    exterior_grade: string;
    interior_grade: string;
    mobilization_units: Mobilization[]
    fotoBpkb: string | null;
    fotoBastk: string | null;
    fotoStnk: string | null;
    fotoSuratKuasa: string | null;
    notes: string | null;
    recommendation_price: string | null;
    bastk_timestamp: string | null;
    appraisal_timestamp: string | null;
    expedition: string | null;
    unit_category_id: number;
  }