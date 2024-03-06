import React, { useState } from "react";
import logo from "../../assets/img/logo.png";
import Input from "../common/input/Input";
import Button from "../common/button/Button";
import s from "./Auth.module.css";
import CheckBox from "../common/checkbox/CheckBox";
import twitter from "../../assets/img/twitter.svg";
import google from "../../assets/img/google.svg";
import twitch from "../../assets/img/twitch.svg";
import discord from "../../assets/img/discord.svg";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useRegistrationConfirmationMutation,
  useRegistrationMutation,
} from "../../scripts/api/auth-api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {setEmailVerify, setTempPassword} from "../../scripts/store/slices/app/app-slices";
import ProgressBar from "../common/progress-bar/ProgressBar";
import { GoogleLogin } from "@react-oauth/google";
export const signupSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter the correct email and try again.")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "The password must contain 8 to 40 characters! Please try again.")
    .max(40, "The password must contain 8 to 40 characters! Please try again."),
  checkbox: yup
    .boolean()
    .oneOf(
      [true],
      "You must agree to the terms first before continuing to the next step!"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf(
      [yup.ref("password")],
      "The passwords do not match! Please try again."
    ),
});
const RegistrationPage = () => {
  const [registration, { isLoading }] = useRegistrationMutation();
  const [registrationConfirmation] = useRegistrationConfirmationMutation();

  const [isError, setIsError] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });
  const onSubmit = async (data) => {
    if (data) {
      const res = await registration({
        email: data.email,
        password: data.password,
      });
      if (res.error) {
        setIsError(res.error.message);
        console.log(res);
        return;
      }
      const verify = await registrationConfirmation({
        email: data.email,
      });
      if (verify.error) {
        return;
      }
      dispatch(setEmailVerify(data.email));
      dispatch(setTempPassword(data.password))
      navigate("/verify");
    }
  };
  const changePage = () => {
    navigate("/");
  };

  const responseMessage = (response) => {
    console.log(response);
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div className={s.container}>
      <div className={s.btn_back} onClick={() => changePage()}>
        Back
      </div>
      <div className={s.content}>
        <img className={s.logo} src={logo} />
        <h1 className={s.logo_text}>AIO</h1>
        <div style={{ textAlign: "center" }}>
          <h3 className={s.bold_text}>Get Started</h3>
          <p style={{ color: "rgba(255, 255, 255, 0.75", fontWeight: 700 }}>
            {" "}
            Already have an account?
            <Link to="/login" style={{ color: "#643CF0" }}>
              {" "}
              Sign in
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={s.content}>
          <Input
            placeholder="Enter with your email"
            text="Email"
            register={() => register("email")}
            error={errors.email?.message}
          />
          <Input
            placeholder="Type your password here"
            type="password"
            register={() => register("password")}
            text="Password"
            error={errors.password?.message}
          />
          <Input
            placeholder="Re-type your password here"
            type="password"
            register={() => register("confirmPassword")}
            text="Confirm Password"
            error={errors.confirmPassword?.message}
          />
          <CheckBox
            register={() => register("checkbox")}
            error={errors.checkbox?.message}
          >
            <span
              style={{ color: "rgba(255, 255, 255, 0.75)", fontWeight: 300 }}
            >
              By creating an account you agree to the
              <a style={{ color: "#643CF0" }}> terms of use </a>
              and our
              <a style={{ color: "#643CF0" }}> privacy policy </a>
            </span>
          </CheckBox>
          <span className={s.error}>{errors.checkbox?.message}</span>

          <span className={s.error}>{isError}</span>

          <Button text="Agree and Continue" type="submit" onClick={onSubmit} />
        </form>
      </div>
      {/*<div className={s.line_container}>*/}
      {/*  <div className={s.line}></div>*/}
      {/*  <div style={{ color: "rgba(255, 255, 255, 0.75)" }}>Or</div>*/}
      {/*  <div className={s.line}></div>*/}
      {/*</div>*/}

      {/*<div className={s.social_networks}>*/}
      {/*    <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />*/}
      {/*    <img className={s.social_network} src={twitter}/>*/}
      {/*    <img className={s.social_network} src={google}/>*/}
      {/*    <img className={s.social_network}  src={twitch}/>*/}
      {/*    <img className={s.social_network} src={discord}/>*/}
      {/*</div>*/}

      {isLoading && <ProgressBar />}
    </div>
  );
};

export default RegistrationPage;
