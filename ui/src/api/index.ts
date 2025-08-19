import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';


export const SERVER_URL = "http://localhost:8000/";
export const queryClient = new QueryClient();


const api = axios.create({
    baseURL: "http://localhost:8000/",
});

export default api;
