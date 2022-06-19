import { createContext, useState } from 'react';

const HistoryContext = createContext({});

export const HistoryProvider = ({ children }) => {
	const [username, setUsername] = useState('');

	return (
		<HistoryContext.Provider value={{ username, setUsername }}>
			{children}
		</HistoryContext.Provider>
	);
};

export default HistoryContext;
