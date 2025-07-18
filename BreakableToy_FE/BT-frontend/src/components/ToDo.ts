export interface ToDo{
    id?:number;
    text:string;
    creationDate:string;
    doneDate?: string|null;
    dueDate:string;
    completed:boolean;
    priority : string;
}