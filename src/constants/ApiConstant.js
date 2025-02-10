const API_BASE_URL = (window?.location?.hostname === 'kamal-textile.in') ? "http://kamal-textile.in:4000/api/" : "http://192.168.0.142:4000/api/"
const BASE_URL = (window?.location?.hostname === 'kamal-textile.in') ? "http://kamal-textile.in:4000" : "http://192.168.0.142:4000"

const frontEndAPI = {
    signup: `${API_BASE_URL}user/signup`,
    signin: `${API_BASE_URL}user/signin`,
    signout: `${API_BASE_URL}user/signout`,
    getCategoryList: `${API_BASE_URL}category/list`,
    createCategory: `${API_BASE_URL}category/create`,
}

const header = (token) => {
    return {
        "headers": {
            "token": token ?? "essentials",
            "Content-Type": "",
        }
    }
}

const headerImage = (token) => {
    return {
        "headers": {
            "token": token ?? "essentials",
            "Content-Type": "multipart/form-data",
        }
    }
}

export {
    API_BASE_URL,
    BASE_URL,
    frontEndAPI,
    header,
    headerImage,
}