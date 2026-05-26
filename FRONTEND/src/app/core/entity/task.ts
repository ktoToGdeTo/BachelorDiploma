export interface Task {
    id?: number;
    title: string;
    description?: string;
    created_time?: Date;
    modified_time?: Date;
    status: string;
    created_by?: string;
}
