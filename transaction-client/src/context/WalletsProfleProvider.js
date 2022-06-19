import { createContext, useEffect, useState } from 'react';

const WalletsProfleContext = createContext({});

export const WalletsProfleProvider = ({ children }) => {
	const getProfile = localStorage.getItem('profile');
	const [profile, setProfile] = useState(
		JSON.parse(getProfile) || {
			balance: '579516',
			numberAccount: '901704100',
			username: 'nguyen hoang thinh',
		}
	);

	useEffect(() => {
		localStorage.setItem('profile', JSON.stringify(profile));
	}, [profile]);

	return (
		<WalletsProfleContext.Provider value={{ profile, setProfile }}>
			{children}
		</WalletsProfleContext.Provider>
	);
};

export default WalletsProfleContext;
