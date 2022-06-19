const Transactions = require('../models/Transactions');
const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { creditAccount, debitAccount } = require('../utils/transactions');
const router = require('express').Router();

router.post('/transfer', async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		//lấy thông tin từ người dùng
		const { toUsername, fromUsername, amount, summary } = req.body;

		const reference = v4();
		//kiểm tra thông tin hợp lệ
		if (!toUsername && !fromUsername && !amount && !summary) {
			return res.status(400).json({
				status: false,
				message:
					'Please provide the following details: toUsername, fromUsername, amount, summary',
			});
		}

		//Tạo  giao mới
		const transferResult = await Promise.all([
			debitAccount({
				amount,
				username: fromUsername,
				purpose: 'transfer',
				reference,
				summary,
				trnxSummary: `TRFR TO: ${toUsername}`,
				session,
			}),

			creditAccount({
				amount,
				username: toUsername,
				purpose: 'transfer',
				reference,
				summary,
				trnxSummary: `TRFR FROM: ${fromUsername}`,
				session,
			}),
		]);

		//kiểm tra giao dịch hợp lệ
		const failedTxns = transferResult.filter(
			(result) => result.status !== true
		);

		if (failedTxns.length) {
			const errors = failedTxns.map((a) => a.message);
			await session.abortTransaction();
			return res.status(400).json(errors);
		}

		// socket io dùng để cập nhật tổng số tiền

		await session.commitTransaction();

		session.endSession();

		req.io.emit('updateWallets', { wallets: 'wallets has been update' });
		//trả về thành công khi tạo thành công giao dịch
		return res.status(201).json({
			status: true,
			message: 'Transfer successful',
		});
	} catch (err) {
		await session.abortTransaction();
		session.endSession();

		//trả về thất bại khi không tạo được giao dịch
		return res.status(500).json({
			status: false,
			message: `Unable to find perform transfer. Please try again. \n Error: ${err}`,
		});
	}
});

// router.route('/transfer/:username').get(function (req, res) {
// 	// const username = req.params.username;

// 	// console.log(req.params.username);

// 	try {
// 		const result = Transactions.find();

// 		console.log(result);

// 		if (result) {
// 			return res.status(200).json(result);
// 		}

// 		// if (!result) {
// 		// 	return res.status(404).json('Không tìm thấy thông tin người dùng!');
// 		// }
// 	} catch (err) {
// 		res.status(500).json('Không tìm thấy thông tin người dùng!');
// 	}
// });

router.get('/transfer/:username', async (req, res) => {
	const username = req.params.username;

	try {
		const transferList = await Transactions.find({ username }).then((p) => {
			let transferIfo = p.map((child) => {
				return {
					_id: child._id,
					username: child.username,
					purpose: child.purpose,
					amount: child.amount.toString(),
					balanceBefore: child.balanceBefore.toString(),
					balanceAfter: child.balanceAfter.toString(),
					summary: child.summary,
					trnxSummary: child.trnxSummary,
					reference: child.reference,
				};
			});
			return res.status(200).json(transferIfo);
		});
		if (!transferList) {
			return res.status(404).json('Không tìm thấy');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// router.get('/transfer/:username', async (req, res) => {
// 	const username = req.params.username;
// 	try {
// 		const transferList = Transactions.findOne({ trnxType: 'DR' });
// 		console.log(transferList);
// 		if (transferList) {
// 			res.status(200).json(transferList);
// 		} else {
// 			res.status(404).json('Not found');
// 		}
// 	} catch (err) {
// 		res.status(500).json(err);
// 	}
// });

module.exports = router;
