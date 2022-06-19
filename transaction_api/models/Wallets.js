const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
			immutable: true,
			unique: true,
		},
		balance: {
			type: mongoose.Decimal128,
			required: true,
			default: 0.0,
		},

		numberAccount: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);
