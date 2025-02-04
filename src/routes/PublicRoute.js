import React  from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { AUTHENTICATED_ENTRY } from 'configs/AppConfig'

const PublicRoute = () => {

	const { adminData } = useSelector(state => state.auth)
  
	return adminData ? <Navigate to={AUTHENTICATED_ENTRY} /> : <Outlet/>
}

export default PublicRoute