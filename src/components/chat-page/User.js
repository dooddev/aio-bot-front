import React, {useEffect, useState} from "react";
import avatar from "../../assets/img/Avatars.png";
import s from "./Chat.module.css";
import menu from "../../assets/img/menu.svg";
import SettingsModal from "../common/modal/SettingsModal";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../../scripts/store/slices/app/selectors";
import { clearLocalStorage } from "../../scripts/common/helpers/localStorage";
import { setIsAuth } from "../../scripts/store/slices/app/app-slices";
import {setMe, setMessages} from "../../scripts/store/slices/chat/chat-slice";
import { useCookies } from "react-cookie";
import {useLocation, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import { useLogoutQuery } from "../../scripts/api/auth-api";
import { useSendMessageMutation } from "../../scripts/api/chat-api";

const User = ({ isMenu, user }) => {
  const [skip, setSkip] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  const { data,isSuccess} = useLogoutQuery(undefined, { skip });

  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const session = queryParams.get("session");

  const handleSettings = () => {
    setIsMenuOpen(false);
    setIsOpenSettings(true);
  };

  useEffect(()=>{

    if(isSuccess){
      Cookies.remove("refresh-token");
      clearLocalStorage("access-token");
      dispatch(setIsAuth(false));
      dispatch(setMe(null));
      dispatch(setMessages([]))
      const params = new URLSearchParams(location.search);
      params.delete('session'); // Remove the session parameter
      setTimeout(() => {
        navigate({
          pathname: '/login',
          search: ''
        });
      }, 0);
    }
  },[isSuccess])
  const handleLogout = () => {

    setSkip(false);
  };

  return (
    <div className={`${s.user_container} ${s[`user_container_${theme}`]}`}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {user?.avatar_url ? (
          <img src={user.avatar_url} className={s.img_avatar} />
        ) : (
          <span
            className={s.img_avatar}
            style={{
              border: "3px solid gray",
              fontSize: "19px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {user.email.charAt(0).toUpperCase()}
          </span>
        )}
        <p className={s.name}>{user.username || user.email}</p>
      </div>
      {isMenu && (
        <img
          src={menu}
          className={s.img_menu}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      )}
      {isMenuOpen && (
        <div className={`${s.menu_container} ${s[`menu_container_${theme}`]}`}>
          <p
            className={`${s.menu_item} ${s[`menu_item_${theme}`]}`}
            onClick={() => handleSettings()}
            style={{ borderRadius: "10px 10px 0px 0px" }}
          >
            Setting
          </p>
          <p
            className={`${s.menu_item} ${s[`menu_item_${theme}`]}`}
            style={{ borderRadius: "0px 0px 10px 10px" }}
            onClick={() => handleLogout()}
          >
            Logout
          </p>
        </div>
      )}

      <SettingsModal
        isOpen={isOpenSettings}
        setIsOpen={(value) => setIsOpenSettings(value)}
      />
    </div>
  );
};

export default User;
