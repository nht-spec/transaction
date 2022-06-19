import axiosApi from './axiosApi';

const transactionsApi = {
	//Tạo giao dịch mới
	post(params) {
		const url = '/api/transactions/transfer';
		return axiosApi.post(url, params);
	},

	//lấy giao dịch
	get(username) {
		const url = `/api/transactions/transfer/${username}`;
		return axiosApi.get(url);
	},
};

export default transactionsApi;
