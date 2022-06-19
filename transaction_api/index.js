const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const walletRoutes = require('./routes/wallets');
const transactionsRoutes = require('./routes/transactions');

const { createServer } = require('http'); // you can use https as well
const socketIo = require('socket.io');
const server = createServer(app);

const io = socketIo(server, {
	cors: {
		origin: '*',
	},
});

app.use(
	cors({
		origin: '*',
	})
);

app.use((req, res, next) => {
	req.io = io;
	return next();
});

dotenv.config();

app.use(express.json());
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionsRoutes);

mongoose.connect(process.env.MONGO_URL, () => {
	console.log('Connected to MongoDB');
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
