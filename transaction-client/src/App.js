import { Col, Divider, Row } from 'antd';
import './App.css';
import CreateTransaction from './components/Transactions/CreateTransaction';
import TransactionsHistory from './components/Transactions/TransactionsHistory';
import WalletsInfo from './components/Wallets/WalletsInfo';
import { Tabs } from 'antd';
import { useState } from 'react';

const { TabPane } = Tabs;
function App() {
	const RenderTab = () => {
		return (
			<Tabs defaultActiveKey='1'>
				<TabPane tab='Giao dịch mới' key='1'>
					<CreateTransaction />
				</TabPane>
				<TabPane tab='Lịch sử giao dịch' key='2'>
					<TransactionsHistory />
				</TabPane>
			</Tabs>
		);
	};

	return (
		<div className='App'>
			<Row
				className='wallets-transactions'
				gutter={[16, 16]}
				// justify='space-around'
			>
				<Col span={8}>
					<WalletsInfo />
				</Col>
				<Col>
					<Divider className='divider-height' type='vertical' />
				</Col>

				<Col span={14}>{RenderTab()}</Col>
			</Row>
		</div>
	);
}

export default App;
