import React from "react";

import logo from "../../assets/img/logo.png";
import Button from "../common/button/Button";
import s from "../auth-page/Auth.module.css";
import SideBar from "../common/sidebar/SideBar";
import { useNavigate } from "react-router-dom";
import { useMeQuery } from "../../scripts/api/auth-api";
import ProgressBar from "../common/progress-bar/ProgressBar";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../scripts/store/slices/app/selectors";

const Home = () => {
  const isAuth = useSelector(selectIsAuth);

  const navigate = useNavigate();
  const handleButtonClick = () => {
    if (isAuth) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  };
  return (
    <div className={s.container}>
      <SideBar />

      <div className={s.content}>
        <img className={s.logo} src={logo} />

        <h3 className={s.bold_text}>Welcome to AIO</h3>
        <p style={{ color: "#F5F5F5", fontWeight: 700 }}>
          {" "}
          The All-In-One Intelligence Hub of Gaming
        </p>
        <p style={{ color: "rgba(255, 255, 255, 0.75", fontWeight: 300 }}>
          AIOChat is an AI-driven chat bot to help you find any information
          related to gaming. From game mechanics, development, tutorials, FAQ’s,
          content discovery and creation in gaming, AIOChat is constantly
          learning and training to help you with all your requests.
        </p>

        <Button
          text="Try AIOChat1.0"
          type="submit"
          style={{ width: "200px" }}
          onClick={() => handleButtonClick()}
        />
      </div>
    </div>
  );
};

export default Home;
