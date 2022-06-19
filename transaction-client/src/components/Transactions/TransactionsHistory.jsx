import { Space, Steps, Typography } from 'antd';
import React from 'react';
import useGetHistoryTransaction from '../../hooks/useGetHistoryTransaction';
import useGetLocalStorge from '../../hooks/useGetLocalStorge';
import useSocket from '../../hooks/useSocket';
import './style.css';
const { Step } = Steps;

const { Text, Title } = Typography;

function TransactionsHistory(props) {
	const { profile } = useGetLocalStorge();
	const { socket } = useSocket();

	const { loading, transactionHistory } = useGetHistoryTransaction(
		profile.username,
		socket
	);

	const checkStatus = (trnxSummary) => {
		switch (trnxSummary.indexOf('FROM')) {
			case 5:
				return true;
			case -1:
				return false;
		}
	};

	// console.log(transactionHistory);

	return (
		<Steps progressDot current={1} direction='vertical'>
			{transactionHistory?.map((item) => (
				<Step
					className={
						checkStatus(item.trnxSummary) ? 'step_item' : 'step_item-to'
					}
					status='process'
					title={
						checkStatus(item.trnxSummary)
							? `Nhận tiền từ:${item?.trnxSummary?.split(':')[1].toUpperCase()}`
							: `Gửi tiền đến:${item?.trnxSummary.split(':')[1].toUpperCase()}`
					}
					description={
						<Space direction='vertical'>
							<Space>
								<Text strong>Mã giao dịch:</Text>
								<Text>{item?.reference}</Text>
							</Space>

							<Space>
								<Text strong>Số tiền:</Text>
								<Text>{item?.amount}</Text>
							</Space>

							<Space>
								<Text strong>Tổng số tiền trước khi gửi:</Text>
								<Text>{item?.balanceBefore}</Text>
							</Space>

							<Space>
								<Text strong>Tổng số tiền sau khi gửi:</Text>
								<Text>{item?.balanceAfter}</Text>
							</Space>

							<Space>
								<Text strong>Lời nhắn:</Text>
								<Text>{item?.summary}</Text>
							</Space>
						</Space>
					}
				/>
			))}
		</Steps>
	);
}

export default TransactionsHistory;
