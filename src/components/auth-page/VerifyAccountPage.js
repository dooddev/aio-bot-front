import React, {useState} from 'react';
import s from './Auth.module.css'
import Input from "../common/input/Input";
import logo from '../../assets/img/logo.png'
import Button from "../common/button/Button";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import {useRegistrationConfirmationMutation, useSendCodeMutation} from "../../scripts/api/auth-api";
import {useSelector} from "react-redux";
import {selectEmailVerify} from "../../scripts/store/slices/app/selectors";
import ProgressBar from "../common/progress-bar/ProgressBar";
import {setEmailVerify} from "../../scripts/store/slices/app/app-slices";
import {useNavigate} from "react-router-dom";


const VerifyAccountPage = () => {

    const [sendCode,{isLoading}] = useSendCodeMutation();
    const [registrationConfirmation ] = useRegistrationConfirmationMutation();

    const [isError,setIsError]=useState()
    const [code,setCode]=useState('')
    const navigate = useNavigate();

    const email=useSelector(selectEmailVerify)

    const onSubmit = async () => {
        setIsError(false)
            const res=await  sendCode({
                email:email,
                pin_code:code
            })

            if(res.error){
                setIsError('The code you entered is incorrect! Please try again or ask for a new verification code.')
                return
            }
            navigate('/login');

        }

    const resendCode=async ()=>{
        setIsError(false)
        const verify=await registrationConfirmation({
            email:email
        })
    }

    return (
        <div className={s.container}>
            <div className={s.content}>

                <img className={s.logo} src={logo}/>
                <h1 className={s.logo_text}>AIO</h1>
                <div style={{marginBottom:'50px'}}>
                    <h3 className={s.bold_text}>Verify account</h3>
                    <p style={{color:'rgba(255, 255, 255, 0.75',fontWeight: 700}}>

                        You should have received an email with a verification code to complete your sign up process.
                        Please check your inbox and spam folder and enter the code below.
                    </p>
                </div>

                <form className={s.content} >

                    <Input placeholder="Enter the verification code here"
                           text="Verification Code"
                           value={code}
                           onChange={(e)=>setCode(e.target.value)}
                    />
                    {isError&&<span style={{   color:'#F03C5C',fontWeight: 300}}>{isError}</span>}

                    {
                        (isError) && (
                            <Button
                                text="Resend"
                                error={(isError)}
                                type="button"
                                style={{width:'200px'}}
                                onClick={()=>resendCode()}
                            />
                        )
                    }

                    <Button text="Verify and continue"
                            type="button"
                            onClick={()=>onSubmit()}
                    />
                </form>


            </div>

            {isLoading&& <ProgressBar/>}

        </div>
    );
};

export default VerifyAccountPage;
