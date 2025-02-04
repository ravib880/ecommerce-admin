import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import {
	AUTH_PREFIX_PATH,
	UNAUTHENTICATED_ENTRY,
	REDIRECT_URL_KEY
} from 'configs/AppConfig'

const ProtectedRoute = () => {

	const { adminData } = useSelector(state => state.auth)
	const location = useLocation()

	if (!adminData) {
		return <Navigate to={`${AUTH_PREFIX_PATH}${UNAUTHENTICATED_ENTRY}?${REDIRECT_URL_KEY}=${location.pathname}`} replace />;
	}

	return <Outlet />
}

export default ProtectedRoute