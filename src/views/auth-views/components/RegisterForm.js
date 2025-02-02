import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { LockOutlined, MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Alert } from "antd";
import { signUp, showAuthMessage, showLoading, hideAuthMessage } from 'store/slices/authSlice';
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import './CustomStyle.css'
import axios from 'axios';
import { API_BASE_URL, frontEndAPI } from 'constants/ApiConstant';

const rules = {
	name: [
		{
			required: true,
			message: 'Please enter your name'
		},
		{
			pattern: /^[A-Za-z\s]+$/,
			message: 'Please enter a validate email!'
		}
	],
	mobile: [
		{
			required: true,
			message: 'Please enter your mobile number'
		},
		{
			pattern: /^[6-9]\d{9}$/,
			message: 'Mobile number must be a valid 10-digit number starting with 6-9'
		}
	],
	email: [
		{
			required: true,
			message: 'Please enter your email address'
		},
		{
			type: 'email',
			message: 'Please enter a validate email!'
		}
	],
	password: [
		{
			required: true,
			message: 'Please enter your password'
		}
	],
	// confirm: [
	// 	{
	// 		required: true,
	// 		message: 'Please confirm your password!'
	// 	},
	// 	({ getFieldValue }) => ({
	// 		validator(_, value) {
	// 			if (!value || getFieldValue('password') === value) {
	// 				return Promise.resolve();
	// 			}
	// 			return Promise.reject('Passwords do not match!');
	// 		},
	// 	})
	// ]
}

export const RegisterForm = (props) => {

	const { signUp, showLoading, token, loading, redirect, message, showMessage, hideAuthMessage, allowRedirect = true } = props
	const [form] = Form.useForm();

	const navigate = useNavigate();

	const onSignUp = () => {
		form.validateFields().then(values => {
			console.log("values::", values);
			postUserData({ ...values });
			// showLoading()
			// signUp(values)
		}).catch(info => {
			console.log('Validate Failed:', info);
		});
	}

	const postUserData = async (values) => {
		try {
			const { data } = await axios.post(frontEndAPI?.signup, { ...values })
			console.log("data::", data);
			// showLoading()
			// signUp(values)
		} catch (err) {
			console.log("err::", err?.response);
			if (err?.response?.data?.data) {
				const errorData = err.response.data.data; // Extract backend errors

				// Convert backend errors into AntD Form format
				const errorFields = Object.keys(errorData).map((field) => ({
					name: field, // Field name (e.g., "password")
					errors: [errorData[field]], // Error message from backend
				}));

				// Set errors in AntD Form
				form.setFields(errorFields);
			}
		}
	}

	useEffect(() => {
		if (token !== null && allowRedirect) {
			navigate(redirect)
		}
		if (showMessage) {
			const timer = setTimeout(() => hideAuthMessage(), 3000)
			return () => {
				clearTimeout(timer);
			};
		}
	}, []);

	return (
		<>
			<motion.div
				initial={{ opacity: 0, marginBottom: 0 }}
				animate={{
					opacity: showMessage ? 1 : 0,
					marginBottom: showMessage ? 20 : 0
				}}>
				<Alert type="error" showIcon message={message}></Alert>
			</motion.div>
			<Form form={form} layout="vertical" name="register-form" onFinish={onSignUp}>
				<Form.Item
					name="name"
					label="Name"
					rules={rules.name}
					hasFeedback
				>
					<Input prefix={<UserOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item
					name="email"
					label="Email"
					rules={rules.email}
					hasFeedback
				>
					<Input prefix={<MailOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item
					name="mobile"
					label="Mobile"
					rules={rules.mobile}
					hasFeedback
					className='stop-inc'
				>
					<Input type='number' prefix={<MobileOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item
					name="password"
					label="Password"
					rules={rules.password}
					hasFeedback
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />} />
				</Form.Item>
				{/* <Form.Item
					name="confirm"
					label="ConfirmPassword"
					rules={rules.confirm}
					hasFeedback
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />} />
				</Form.Item> */}
				<Form.Item>
					<Button type="primary" htmlType="submit" block loading={loading}>
						Sign Up
					</Button>
				</Form.Item>
			</Form>
		</>
	)
}

const mapStateToProps = ({ auth }) => {
	const { loading, message, showMessage, token, redirect } = auth;
	return { loading, message, showMessage, token, redirect }
}

const mapDispatchToProps = {
	signUp,
	showAuthMessage,
	hideAuthMessage,
	showLoading
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm)
