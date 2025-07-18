import axios from "axios";
import{ToDo} from '../components/ToDo'
import {CompletionStats}from '../components/Stats'

const REST_API_BASE_URL='http://localhost:9090/api/ToDos';
export const listToDos=()=>{
    return axios.get(REST_API_BASE_URL);
};
export const createToDo=(todo:ToDo)=>{
    return axios.post<ToDo>(REST_API_BASE_URL, todo);
};
export const updateToDo=(id:number, todo: ToDo)=>{
    return axios.put(`${REST_API_BASE_URL}/${id}`, todo);
};
export const getCompletionStats=()=>{
    return axios.get<CompletionStats[]>(`${REST_API_BASE_URL}/completion-stats`);
};
export const deleteToDo=(id:number)=>{
    return axios.delete(`${REST_API_BASE_URL}/${id}`);
};
export const getPaginatedToDos = (page: number, size: number) => {
    return axios.get(`${REST_API_BASE_URL}/paginated?page=${page}&size=${size}`);
  };
  export const getAllToDos=()=>{
    return axios.get<ToDo[]>(`${REST_API_BASE_URL}/all`);
  };