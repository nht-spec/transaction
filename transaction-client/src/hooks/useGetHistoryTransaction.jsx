import { message } from 'antd';
import { useEffect, useState } from 'react';
import transactionsApi from '../api/transactionsApi';

function useGetHistoryTransaction(username, socket) {
	const [loading, setLoading] = useState(false);
	const [transactionHistory, seTransactionHistory] = useState(null);

	const [updateWallet, setUpdateWallet] = useState(null);

	useEffect(() => {
		socket?.on('updateWallets', (data) => {
			setUpdateWallet(data);
		});
	}, [socket]);

	useEffect(() => {
		{
			username &&
				(async () => {
					setLoading(true);
					try {
						const result = await transactionsApi.get(username);
						seTransactionHistory(result.data);
					} catch (err) {
						message.error(err.response.data);
					}
					setLoading(false);
				})();
		}
	}, [username, updateWallet]);
	return {
		loading,
		transactionHistory,
	};
}

export default useGetHistoryTransaction;
