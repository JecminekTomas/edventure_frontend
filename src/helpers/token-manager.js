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
            const rawData = this.b64DecodeUnicode(parts[1])
            return JSON.parse(rawData)
        }
        return null
    }

    getUserFullName() {
        const payload = this.getPayload()
        const parts = payload.sub.split(",")

        const firstNamePart = parts[2].trim()
        const lastNamePart = parts[3].trim()

        return {firstName: `${firstNamePart}`, lastName: `${lastNamePart}`}
    }


    getUserId() {
        const payload = this.getPayload()
        const parts = payload.sub.split(",")

        return Number(parts[0].trim())
    }

    isUserLogged() {
        return this.token != null;
    }

    //DECODER (https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings)
    b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
}