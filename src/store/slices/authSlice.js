import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { frontEndAPI } from 'constants/ApiConstant';
import { AUTH_ADMIN, AUTH_TOKEN } from 'constants/AuthConstant';
import FirebaseService from 'services/FirebaseService';

export const initialState = {
	loading: false,
	message: '',
	showMessage: false,
	redirect: '',
	token: localStorage.getItem(AUTH_TOKEN) || null,
	adminData: JSON.parse(localStorage.getItem(AUTH_ADMIN)) || null
}

// export const signIn = createAsyncThunk('auth/signIn',async (data, { rejectWithValue }) => {
// 	const { email, password } = data
// 	try {
// 		const response = await FirebaseService.signInEmailRequest(email, password)
// 		if (response.user) {
// 			const token = response.user.refreshToken;
// 			localStorage.setItem(AUTH_TOKEN, response.user.refreshToken);
// 			return token;
// 		} else {
// 			return rejectWithValue(response.message?.replace('Firebase: ', ''));
// 		}
// 	} catch (err) {
// 		return rejectWithValue(err.message || 'Error')
// 	}
// })

export const signIn = createAsyncThunk('auth/signIn', async (data, { rejectWithValue }) => {
	const { username, password } = data;
	try {
		const { data } = await axios.post(frontEndAPI?.signin, { username, password, role: "ADMIN" })
		console.log("data::", data);
		if (data?.data) {
			localStorage.setItem(AUTH_ADMIN, JSON.stringify(data?.data));
			const adminData = data?.data;
			return adminData;
		}
		else {
			return rejectWithValue(data?.message ?? ("Unknown error occurs."))
		}
	} catch (err) {
		if (err?.response?.data) {
			const errorData = err?.response?.data?.message ?? err?.response?.data?.error; // Extract backend errors
			console.log("errorData::", errorData);
			return rejectWithValue({
				text: errorData || "Error",
				type: "error"
			})
		}
	}

})

export const signUp = createAsyncThunk('auth/signUp', async (data, { rejectWithValue }) => {
	const { email, password } = data
	try {
		const response = await FirebaseService.signUpEmailRequest(email, password)
		if (response.user) {
			const token = response.user.refreshToken;
			localStorage.setItem(AUTH_TOKEN, response.user.refreshToken);
			return token;
		} else {
			return rejectWithValue(response.message?.replace('Firebase: ', ''));
		}
	} catch (err) {
		return rejectWithValue(err.message || 'Error')
	}
})

export const signOut = createAsyncThunk('auth/signOut', async () => {
	// const response = await FirebaseService.signOutRequest()
	// localStorage.removeItem(AUTH_TOKEN);
	localStorage.removeItem(AUTH_ADMIN);

	return null
})

export const signInWithGoogle = createAsyncThunk('auth/signInWithGoogle', async (_, { rejectWithValue }) => {
	const response = await FirebaseService.signInGoogleRequest()
	if (response.user) {
		const token = response.user.refreshToken;
		localStorage.setItem(AUTH_TOKEN, response.user.refreshToken);
		return token;
	} else {
		return rejectWithValue(response.message?.replace('Firebase: ', ''));
	}
})

export const signInWithFacebook = createAsyncThunk('auth/signInWithFacebook', async (_, { rejectWithValue }) => {
	const response = await FirebaseService.signInFacebookRequest()
	if (response.user) {
		const token = response.user.refreshToken;
		localStorage.setItem(AUTH_TOKEN, response.user.refreshToken);
		return token;
	} else {
		return rejectWithValue(response.message?.replace('Firebase: ', ''));
	}
})


export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		authenticated: (state, action) => {
			state.loading = false
			state.redirect = '/'
			state.token = action.payload
		},
		showAuthMessage: (state, action) => {
			state.message = action.payload
			state.showMessage = true
			state.loading = false
		},
		hideAuthMessage: (state) => {
			state.message = ''
			state.showMessage = false
		},
		signOutSuccess: (state) => {
			state.loading = false
			state.token = null
			state.redirect = '/'
		},
		showLoading: (state) => {
			state.loading = true
		},
		signInSuccess: (state, action) => {
			state.loading = false
			state.token = action.payload
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(signIn.pending, (state) => {
				state.loading = true
			})
			.addCase(signIn.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signIn.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(signOut.fulfilled, (state) => {
				state.loading = false
				state.token = null
				state.redirect = '/'
			})
			.addCase(signOut.rejected, (state) => {
				state.loading = false
				state.token = null
				state.redirect = '/'
			})
			.addCase(signUp.pending, (state) => {
				state.loading = true
			})
			.addCase(signUp.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signUp.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(signInWithGoogle.pending, (state) => {
				state.loading = true
			})
			.addCase(signInWithGoogle.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signInWithGoogle.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(signInWithFacebook.pending, (state) => {
				state.loading = true
			})
			.addCase(signInWithFacebook.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signInWithFacebook.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
	},
})

export const {
	authenticated,
	showAuthMessage,
	hideAuthMessage,
	signOutSuccess,
	showLoading,
	signInSuccess
} = authSlice.actions

export default authSlice.reducer