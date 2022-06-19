import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function useSocket(props) {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		setSocket(io('http://localhost:4000'));
	}, []);

	return {
		socket,
	};
}
