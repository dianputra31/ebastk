// export interface Brand {
//     id: number;
//     brand_name: string;
// }

// export interface Color {
//     id: number;
//     color_name: string;
// }

// export interface Result {
//     id: number;
//     display_name: string;
//     police_number: string;
//     brand: Brand;
//     transmission: string;
//     unit_year: string | null; // Using union type to allow null
//     odo_meter: number;
//     color: Color;
//     unitimages: string[]; // Assuming unitimages is an array of strings (URLs)
//     thumbnail_url: string;
//     unit_type: string;
//     location_auction: string;
// }

export interface NewApiResponse {
    total_this_month: number;
    task_avb: number;
    task_finished: number;
    task_percentage: number;
    // results: Result[];
}
