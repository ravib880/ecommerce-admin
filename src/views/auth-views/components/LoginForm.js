import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Button, Form, Input, Divider, Alert } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { GoogleSVG, FacebookSVG } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon'
import {
	signIn,
	showLoading,
	showAuthMessage,
	hideAuthMessage,
	signInWithGoogle,
	signInWithFacebook
} from 'store/slices/authSlice';
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import axios from 'axios';
import { frontEndAPI } from 'constants/ApiConstant';

export const LoginForm = props => {

	const navigate = useNavigate();

	const {
		otherSignIn,
		showForgetPassword,
		hideAuthMessage,
		onForgetPasswordClick,
		showLoading,
		signInWithGoogle,
		signInWithFacebook,
		extra,
		signIn,
		token,
		loading,
		redirect,
		showMessage,
		message,
		allowRedirect = true
	} = props

	const adminData = useSelector(state => state.auth.adminData);
	const initialCredential = {
		// email: 'user1@themenate.net',
		// password: '2005ipo'
		email: '',
		password: ''
	}

	const onLogin = async (values) => {
		showLoading()
		signIn(values);
	};

	const onGoogleLogin = () => {
		showLoading()
		signInWithGoogle()
	}

	const onFacebookLogin = () => {
		showLoading()
		signInWithFacebook()
	}

	useEffect(() => {
		// if ((token !== null) && allowRedirect) {
		if (adminData !== null && allowRedirect) {
			navigate(redirect)
		}
		if (showMessage) {
			const timer = setTimeout(() => hideAuthMessage(), 3000)
			return () => {
				clearTimeout(timer);
			};
		}
	}, [adminData]);

	const renderOtherSignIn = (
		<div>
			<Divider>
				<span className="text-muted font-size-base font-weight-normal">or connect with</span>
			</Divider>
			<div className="d-flex justify-content-center">
				<Button
					onClick={() => onGoogleLogin()}
					className="mr-2"
					disabled={loading}
					icon={<CustomIcon svg={GoogleSVG} />}
				>
					Google
				</Button>
				<Button
					onClick={() => onFacebookLogin()}
					icon={<CustomIcon svg={FacebookSVG} />}
					disabled={loading}
				>
					Facebook
				</Button>
			</div>
		</div>
	)

	return (
		<>
			<motion.div
				initial={{ opacity: 0, marginBottom: 0 }}
				animate={{
					opacity: message?.text ? 1 : 0,
					marginBottom: message?.text ? 20 : 0
				}}>
				<Alert type={message?.type} showIcon message={message?.text}></Alert>
			</motion.div>
			<Form
				layout="vertical"
				name="login-form"
				initialValues={initialCredential}
				onFinish={onLogin}
			>
				<Form.Item
					name="username"
					label="Username"
					rules={[
						{
							required: true,
							message: 'Please input your email or mobile',
						},
						{
							type: 'text',
							message: 'Please enter a validate email or mobile!'
						}
					]}>
					<Input placeholder='Enter email address or mobile number' prefix={<UserOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item
					name="password"
					label={
						<div className={`${showForgetPassword ? 'd-flex justify-content-between w-100 align-items-center' : ''}`}>
							<span>Password</span>
							{
								showForgetPassword &&
								<span
									onClick={() => onForgetPasswordClick}
									className="cursor-pointer font-size-sm font-weight-normal text-muted"
								>
									Forget Password?
								</span>
							}
						</div>
					}
					rules={[
						{
							required: true,
							message: 'Please input your password',
						}
					]}
				>
					<Input.Password placeholder='Enter your password' prefix={<LockOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" block loading={loading}>
						Sign In
					</Button>
				</Form.Item>
				{/* {
					otherSignIn ? renderOtherSignIn : null
				} */}
				{extra}
			</Form>
		</>
	)
}

LoginForm.propTypes = {
	otherSignIn: PropTypes.bool,
	showForgetPassword: PropTypes.bool,
	extra: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
};

LoginForm.defaultProps = {
	otherSignIn: true,
	showForgetPassword: false
};

const mapStateToProps = ({ auth }) => {
	const { loading, message, showMessage, token, adminData, redirect } = auth;
	return { loading, message, showMessage, token, adminData, redirect }
}

const mapDispatchToProps = {
	signIn,
	showAuthMessage,
	showLoading,
	hideAuthMessage,
	signInWithGoogle,
	signInWithFacebook
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)