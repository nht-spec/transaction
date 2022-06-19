import { Button, Card, Col, Form, Input, Row, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';
import useGetLocalStorge from '../../hooks/useGetLocalStorge';
import useGetUserName from '../../hooks/useGetUserName';
import useGetWalletsInfo from '../../hooks/useGetWalletsInfo';
import useSocket from '../../hooks/useSocket';

function WalletsInfo() {
	const [userName, setUserName] = useState('');
	const { Text, Title } = Typography;
	const { setUsername } = useGetUserName();
	const [form] = Form.useForm();
	const { profile, setProfile } = useGetLocalStorge();

	//HÀM lấy giá trị từ form
	const onFinish = (values) => {
		setUserName(values.username);
		// form.resetFields();
	};

	const { socket } = useSocket();

	//HÀM CALL API
	const { loading, walletInfo } = useGetWalletsInfo(userName, socket);

	useEffect(() => {
		if (walletInfo) {
			setProfile(walletInfo);
		}
	}, [walletInfo]);

	if (walletInfo?.username) {
		const lastWord = walletInfo.username.split(' ');
		setUsername(lastWord[lastWord.length - 1]);
	}

	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<Form layout='inline' onFinish={onFinish} form={form}>
					<Form.Item label='Số tài khoản' name='username'>
						<Input placeholder='Nhập số tài khoản' />
					</Form.Item>

					<Button type='primary' htmlType='submit'>
						Tìm kiếm
					</Button>
				</Form>
			</Col>

			<Col span={24}>
				<Card>
					<Space size={[8, 8]} direction='vertical'>
						<Space align='center'>
							<Title className='title' level={5}>
								Tên chủ tài khoản:
							</Title>
							<Text keyboard style={{ textTransform: 'uppercase' }}>
								{profile.username}
							</Text>
						</Space>

						<Space align='center'>
							<Title className='title' level={5}>
								Số tài khoản:
							</Title>
							<Text keyboard>{profile.numberAccount}</Text>
						</Space>

						<Space align='center'>
							<Title className='title' level={5}>
								Tổng số dư khả dụng:
							</Title>
							<Text keyboard>{profile.balance}</Text>
						</Space>
					</Space>
				</Card>
			</Col>
		</Row>
	);
}

export default WalletsInfo;
