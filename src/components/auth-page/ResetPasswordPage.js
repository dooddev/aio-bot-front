import React, {useEffect, useState} from 'react';
import s from "./Auth.module.css";
import logo from "../../assets/img/logo.png";
import Input from "../common/input/Input";
import Button from "../common/button/Button";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import {useNewPasswordMutation} from "../../scripts/api/auth-api";
import ProgressBar from "../common/progress-bar/ProgressBar";
import {useNavigate} from "react-router-dom";

export const resetPasswordPage = yup.object().shape({
    password: yup.string()
        .required('Password is required')
        .min(8, 'The password must contain 8 to 40 characters! Please try again.')
        .max(40, 'The password must contain 8 to 40 characters! Please try again.')
    ,
    confirmPassword: yup.string()
        .required('Confirm password is required')
        .oneOf([yup.ref('password')], 'The passwords do not match! Please try again.'),
});
const ResetPassword = () => {

    const [setNewPassword,{isLoading}] = useNewPasswordMutation();
    const [code,setCode]=useState('')
    const [email,setEmail]=useState('')
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(resetPasswordPage),
    })

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        const pin = urlParams.get('code');
        const email=urlParams.get('email')
        setEmail(email)
        setCode(pin)

    }, [])
    const onSubmit = async (data) => {
        if(data){
            const res= await setNewPassword({
                email:email,
                pin_code:code,
                new_password: data.password,

            }).unwrap();

            if(res.error){
                return
            }
            navigate('/login')

        }
    }

    return (
        <div className={s.container}>
            <div className={s.content}>

                <img className={s.logo} src={logo}/>
                <h1 className={s.logo_text}>AIO</h1>
                <h3 className={s.bold_text}>Password Change</h3>
                <p style={{color:'rgba(255, 255, 255, 0.75',fontWeight: 500}}>
                    You have made a request for a new password. Please enter the new password below
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className={s.content}>

                    <Input placeholder="Enter the new password here"
                           text="New password"
                           error={errors.password?.message}
                           register={() => register('password')}
                    />
                    <Input placeholder="Enter the new password here"
                           register={() => register('confirmPassword')}
                           text="Confirm Password"
                           error={errors.confirmPassword?.message}
                    />
                    <Button
                        text="Save and Continue"
                        type="submit"
                        style={{width:'200px'}}
                        onClick={onSubmit}
                    />


                </form>


            </div>
            {isLoading&& <ProgressBar/>}

        </div>
    );
};

export default ResetPassword;
