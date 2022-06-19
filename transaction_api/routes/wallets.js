const Wallets = require('../models/Wallets');
const router = require('express').Router();

router.post('/', async (req, res) => {
	try {
		const { username, numberAccount, balance } = req.body;

		//kiểm tra người dùng đã tồn tại
		const walletExists = await Wallets.findOne({ username });
		if (walletExists) {
			return res.status(409).json({
				status: false,
				message: 'Wallet already exists',
			});
		}

		//Khi người dùng chưa có, tạo người dùng mới
		const result = await Wallets.create({ username, numberAccount, balance });
		return res.status(201).json({
			status: true,
			message: 'Wallets created successfully',
			data: result,
		});
	} catch (err) {
		return res.status(500).json({
			status: true,
			message: `Unable to create wallet. Please try again. \n Error: ${err}`,
		});
	}
});

router.get('/:numberaccount', async (req, res) => {
	try {
		const numberAccount = req.params.numberaccount;

		// kiểm tra nếu có ví thì lấy thông tin từ ví
		const walletExists = await Wallets.findOne({ numberAccount }).then((p) => {
			let walletInfo = {
				username: p.username,
				balance: p.balance.toString(),
				numberAccount: p.numberAccount,
			};

			return res.status(200).json(walletInfo);
		});

		// nếu không thì trả về lỗi
		if (!walletExists) {
			return res.status(404).json('Không tìm thấy thông tin người dùng!');
		}
	} catch (err) {
		res.status(500).json('Không tìm thấy thông tin người dùng!');
	}
});

// module.exports = { createWallet };

module.exports = router;
