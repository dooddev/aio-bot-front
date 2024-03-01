import React, {useState} from 'react';
import s from './Auth.module.css'
import Input from "../common/input/Input";
import logo from '../../assets/img/logo.png'
import Button from "../common/button/Button";
import CheckBox from "../common/checkbox/CheckBox";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import {useRecoveryPasswordMutation} from "../../scripts/api/auth-api";
import {Link, useNavigate} from "react-router-dom";
import ProgressBar from "../common/progress-bar/ProgressBar";

const schema = yup.object().shape({
    email: yup
        .string()
        .required('We couldn’t find an account associated with this email! Please try again'),
});

const RecoveryPasswordPage = () => {

    const [recoveryPassword,{isLoading,isError:err}]=useRecoveryPasswordMutation()

    const [isError,setIsError]=useState()
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const isErrorEmail=errors.email && errors.email.message
    const onSubmit = async (data) => {
        if(data){
            const res=await recoveryPassword({email:data.email})
            if (res.error){
                setIsError(res.error.message)
                return
            }
            navigate('/inform');

        }
    }

    return (
        <div className={s.container}>
            <div className={s.content}>

                <img className={s.logo} src={logo}/>
                <h1 className={s.logo_text}>AIO</h1>
                <h3 className={s.bold_text}>Forgot your password?</h3>
                <p style={{color:'rgba(255, 255, 255, 0.75',fontWeight: 700}}>
                    Have you forgotten your password? No problem we are here to help!
                    Please enter the email associated with the account and follow the instructions sent to you.

                </p>
                <form onSubmit={handleSubmit(onSubmit)} className={s.content}>

                    <Input placeholder="Enter with your email"
                           text="Account email"
                           error={isErrorEmail}
                           register={() => register('email')}
                    />
                    <span className={s.error}>{isError}</span>
                    <Button
                            text={(isError)
                                ? 'Try again'
                                : 'Send'}
                            error={isError}
                            type="submit"
                            style={{width:'200px'}}
                            onClick={onSubmit}
                    />
                    {isError&&
                        <p style={{color: 'rgba(255, 255, 255, 0.75)',fontWeight: 300}}>
                        If you can’t find the correct email for this account, please create a new account by clicking the
                        <Link  to="/registration" style={{color:'#643CF0'}}> sign up </Link>
                        or
                        <Link style={{color:'#643CF0'}}> contact us.</Link>
                    </p>}

                </form>

            </div>
            {isLoading&& <ProgressBar/>}

        </div>
    );
};

export default RecoveryPasswordPage;
