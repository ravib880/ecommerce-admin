const API_BASE_URL = (window?.location?.hostname === 'kamal-textile.in') ? "http://kamal-textile.in:4000/api/" : "http://192.168.0.140:4000/api/"

const frontEndAPI = {
    signup: `${API_BASE_URL}user/signup`,
    signin: `${API_BASE_URL}user/signin`,
}

const header = {
    headers: "",
    token: "essentials"
}

export {
    API_BASE_URL,
    frontEndAPI,
}