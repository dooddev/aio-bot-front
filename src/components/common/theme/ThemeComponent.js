import React from 'react';
import sun from "../../../assets/img/sun.svg";
import moon from "../../../assets/img/moon.svg";
import {setTheme} from "../../../scripts/store/slices/app/app-slices";
import {setLocalStorage} from "../../../scripts/common/helpers/localStorage";
import {useDispatch} from "react-redux";
import s from './Theme.module.css'

const ThemeComponent = () => {
    const dispatch = useDispatch();
    const changeTheme = (value) => {
        dispatch(setTheme(value));
        setLocalStorage("theme", value);
    };
    return (
        <div className={s.container_theme}>
            <img src={sun} onClick={() => changeTheme("light")} />
            <img src={moon} onClick={() => changeTheme("dark")} />
        </div>
    );
};

export default ThemeComponent;
