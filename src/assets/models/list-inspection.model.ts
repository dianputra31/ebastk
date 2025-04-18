export interface QuestionOption {
    name: string | null;
    options: string[];
    key: string;
  }
  
  export interface InspectionItemResponse {
    id: number;
    item_category: string;
    item_sub_category: string;
    unit_type: string;
    item_name: string | null;
    item_name2: string | null;
    item_name3: string | null;
    item_name4: string | null;
    item_name5: string | null;
    questions: QuestionOption[];
    appraisal_only: boolean;
    item_description: string;
  }