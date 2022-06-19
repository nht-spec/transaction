import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';
import transactionsApi from '../../api/transactionsApi';
import useGetLocalStorge from '../../hooks/useGetLocalStorge';

function CreateTransaction(props) {
	const { profile } = useGetLocalStorge();

	const [fields, setFields] = useState([
		{
			name: ['fromUsername'],
			value: profile.username,
		},
	]);

	useEffect(() => {
		if (profile) {
			setFields([
				{
					name: ['fromUsername'],
					value: profile.username,
				},
			]);
		}
	}, [profile]);

	const onFinish = async (values) => {
		const data = {
			fromUsername: values.fromUsername,
			toUsername: values.toUsername,
			amount: Number.parseInt(values.amount),
			summary: values.summary,
			reference: profile.numberAccount,
		};
		try {
			await transactionsApi.post(data);
			message.success('Giao dịch thành công!');
		} catch (err) {
			message.error(err.response.data);
		}
	};

	return (
		<Form
			fields={fields}
			layout='vertical'
			name='basic'
			onFinish={onFinish}
			autoComplete='off'
		>
			<Form.Item
				label='Tên tài khoản gửi'
				name='fromUsername'
				rules={[
					{
						required: true,
						message: 'trường này là bắt buộc!',
					},
				]}
			>
				<Input placeholder='Nhập tên tài khoản gửi' />
			</Form.Item>

			<Form.Item
				label='Tên tài khoản nhận'
				name='toUsername'
				rules={[
					{
						required: true,
						message: 'trường này là bắt buộc!',
					},
				]}
			>
				<Input placeholder='Nhập tên tài khoản nhận' />
			</Form.Item>

			<Form.Item
				label='Số tiền gửi'
				name='amount'
				rules={[
					{
						required: true,
						message: 'trường này là bắt buộc!',
					},

					{
						pattern: /^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/,
						message: 'Số tiền gửi phải lớn hơn 0',
					},
				]}
			>
				<Input placeholder='Nhập số tiền muốn gửi' />
			</Form.Item>

			<Form.Item label='Ghi chú' name='summary'>
				<Input placeholder='Nhập ghi chú' />
			</Form.Item>

			<Button type='primary' htmlType='submit'>
				Gửi
			</Button>
		</Form>
	);
}

export default CreateTransaction;
