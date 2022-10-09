import axios from 'axios';

const api = axios.create({
    baseURL: '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

// List of all the end point 
export const signUpUser = (data) => api.post('/api/user/signup', data);
export const loginUser = (data) => api.post('/api/user/login', data);
export const logout = () => api.post('/api/user/logout');
export const postRoom = (data) => api.post('/api/room', data);
export const getRoom = () => api.get('/api/room');
export const getChats = (data) => api.post('/api/chats', data);
export const enterRoom = (data) => api.post('/api/enter-room', data);


export default api;