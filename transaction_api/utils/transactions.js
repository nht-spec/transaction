const Wallets = require('../models/Wallets');
const Transaction = require('../models/Transactions');

const creditAccount = async ({
	amount,
	username,
	purpose,
	reference,
	summary,
	trnxSummary,
	session,
}) => {
	const wallet = await Wallets.findOne({ username });

	// nếu không có ví thì báo lỗi
	if (!wallet) {
		return {
			status: false,
			statusCode: 404,
			message: `Người dùng ${username} không tồn tại!`,
		};
	}

	const updatedWallet = await Wallets.findOneAndUpdate(
		{ username },
		{ $inc: { balance: amount } },
		{ session }
	);

	// nếu có ví thì tạo giao dịch mới

	const transaction = await Transaction.create(
		[
			{
				trnxType: 'CR',
				purpose,
				amount,
				username,
				reference,
				balanceBefore: Number(wallet.balance),
				balanceAfter: Number(wallet.balance) + Number(amount),
				summary,
				trnxSummary,
			},
		],
		{ session }
	);

	// thông báo tạo giao dịch thành công
	console.log(`Credit successful`);
	return {
		status: true,
		statusCode: 201,
		message: 'Credit successful',
		data: { updatedWallet, transaction },
	};
};

const debitAccount = async ({
	amount,
	username,
	purpose,
	reference,
	summary,
	trnxSummary,
	session,
}) => {
	const wallet = await Wallets.findOne({ username });

	// nếu không có ví thì báo lỗi
	if (!wallet) {
		return {
			status: false,
			statusCode: 404,
			message: `Người dùng ${username} không tồn tại!`,
		};
	}

	// báo lỗi khi vượt quá số tiền đang có
	if (Number(wallet.balance) < amount) {
		return {
			status: false,
			statusCode: 400,
			message: `Số dư ${username} không đủ để thực hiện hành động này`,
		};
	}

	// cập nhật số tiền đang có
	const updatedWallet = await Wallets.findOneAndUpdate(
		{ username },
		{ $inc: { balance: -amount } },
		{ session }
	);

	//Tạo giao dịch mới
	const transaction = await Transaction.create(
		[
			{
				trnxType: 'DR',
				purpose,
				amount,
				username,
				reference,
				balanceBefore: Number(wallet.balance),
				balanceAfter: Number(wallet.balance) - Number(amount),
				summary,
				trnxSummary,
			},
		],
		{ session }
	);

	// thông báo tạo thành công giao dịch mới
	return {
		status: true,
		statusCode: 201,
		message: 'Tạo giao dịch thành công',
		data: { updatedWallet, transaction },
	};
};

module.exports = {
	creditAccount,
	debitAccount,
};
