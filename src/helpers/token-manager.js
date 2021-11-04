import {TOKEN_KEY} from "./constants";
import axiosInstance from "./http";

export default class TokenManager {
    token = null;

    setToken(token) {
        this.token = token
        localStorage.setItem(TOKEN_KEY, token)
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`
    }

    renew() {
        const token = localStorage.getItem(TOKEN_KEY)
        if (token != null) {
            this.setToken(token)
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem(TOKEN_KEY);
        delete axiosInstance.defaults.headers["Authorization"];
    }

    getPayload() {
        if (this.token != null) {
            const parts = this.token.split(".")
            const rawData = atob(parts[1])
            return JSON.parse(rawData)
        }
        return null
    }

    isUserLogged() {
        return this.token != null;
    }
}