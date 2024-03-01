
import axios from 'axios';
import {getLocalStorage, setLocalStorage} from "../common/helpers/localStorage";
import {BASE_URL} from "./instance";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

export const getAccessToken = async () => {
    const accessToken = getLocalStorage('access-token');


    try {
        if(!accessToken||isTokenExpired(accessToken)){
            console.log('GET TOKEN')

            const refresh=Cookies.get('refresh-token')
            console.log(refresh)
            const res = await axios.post(
                BASE_URL+ '/auth/token',
                {refresh_token:refresh},
                { withCredentials: true },
            );
            if(res.data.access_token){
                setLocalStorage('access-token', res.data.access_token);
            }
            if (res.data.refresh_token){
                Cookies.set('refresh-token',res.data.refresh_token)

            }
            return accessToken;
        }
        return accessToken;

    } catch (e) {
        return null;
    }
};

export const isTokenExpired = (token) => {
    console.log('TOKEN')

    if (!token) {
        return true;
    }

    const userTokenDecoded = jwtDecode(token);
    const expirationThreshold =  60 * 1000;
    const tokenExpired = dayjs.unix(userTokenDecoded.exp).diff(dayjs()) < expirationThreshold;
    console.log(tokenExpired)
    return tokenExpired;
};
