export interface Brand {
    id: number;
    brand_name: string;
}

export interface UnitType {
    id: number;
    type_name: string;
}

export interface UnitCategory {
    id: number;
    category_name: string;
}

export interface Color {
    id: number;
    color_name: string;
}

export interface Mobilization {
    id: number;
    status: string;
    notes: string;
    mobiliztion_id: string;
    mobilization: DetailMobilization
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
export interface Result {
    id: number;
    display_name: string;
    police_number: string;
    brand: Brand;
    transmission: string;
    unit_year: string | null; // Using union type to allow null
    odo_meter: number;
    color: Color;
    unitimages: string[]; // Assuming unitimages is an array of strings (URLs)
    thumbnail_url: string;
    unit_type: UnitType;
    cc: string;
    unit_location: string;
    first_published_at: string;
    last_published_at: string;
    variant_model: string[];
    bastk_file: string;
    bpkb: string;
    bpkb_name: string;
    bpkb_number: string;
    bastk_status: string;
    appraisal_status: string;
    vendor: string[];
    unit_documents: string[];
    location_auction: string;
    mobilization_units: Mobilization[]
    unit_category: UnitCategory;
}

export interface NewApiResponse {
    total_items: number;
    total_pages: number;
    current_page: number;
    results: Result[];
}
