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
    fotoBpkb: string | null;
    fotoBastk: string | null;
    fotoStnk: string | null;
    fotoSuratKuasa: string | null;
  }