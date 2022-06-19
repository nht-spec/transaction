import axiosApi from './axiosApi';

const walletsApi = {
	post(params) {
		const url = '/api/wallets';
		return axiosApi.post(url, params);
	},

	get(username) {
		const url = `/api/wallets/${username}`;
		return axiosApi.get(url);
	},
};

export default walletsApi;
