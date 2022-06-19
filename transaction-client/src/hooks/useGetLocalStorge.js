import { useContext } from 'react';
import WalletsProfleContext from '../context/WalletsProfleProvider';

const useGetLocalStorge = () => {
	return useContext(WalletsProfleContext);
};

export default useGetLocalStorge;
