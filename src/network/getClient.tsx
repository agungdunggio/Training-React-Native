import axios from 'axios';

const getClient = axios.create({
    baseURL: "https://dummyjson.com"
});

export default getClient