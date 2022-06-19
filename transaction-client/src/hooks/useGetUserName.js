import { useContext } from 'react';
import HistoryContext from '../context/HistoryProvider';

const useGetUserName = () => {
	return useContext(HistoryContext);
};

export default useGetUserName;
