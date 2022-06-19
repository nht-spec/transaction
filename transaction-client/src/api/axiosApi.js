import axios from 'axios';

const axiosApi = axios.create({
	baseURL: 'http://localhost:4000/',
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	},
});

export default axiosApi;
