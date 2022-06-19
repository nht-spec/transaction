import { message } from 'antd';
import { useEffect, useState } from 'react';
import walletsApi from '../api/walletsApi';

function useGetWalletsInfo(username, socket) {
	const [loading, setLoading] = useState(false);
	const [walletInfo, setWalletInfo] = useState(null);
	const [updateWallet, setUpdateWallet] = useState(null);

	// cập nhật realtime từ back end
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
						const result = await walletsApi.get(username);
						setWalletInfo(result.data);
					} catch (err) {
						message.error(err.response.data);
					}
					setLoading(false);
				})();
		}
	}, [username, updateWallet]);

	//trả thông tin khi call api thành công
	return {
		loading,
		walletInfo,
	};
}

export default useGetWalletsInfo;
