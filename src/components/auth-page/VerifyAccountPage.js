import React, {useState} from 'react';
import s from './Auth.module.css'
import Input from "../common/input/Input";
import logo from '../../assets/img/logo.png'
import Button from "../common/button/Button";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import {useLoginMutation, useRegistrationConfirmationMutation, useSendCodeMutation} from "../../scripts/api/auth-api";
import {useSelector} from "react-redux";
import {selectEmailVerify, selectTempPassword} from "../../scripts/store/slices/app/selectors";
import ProgressBar from "../common/progress-bar/ProgressBar";
import {setEmailVerify, setIsAuth} from "../../scripts/store/slices/app/app-slices";
import {useLocation, useNavigate} from "react-router-dom";
import {setLocalStorage} from "../../scripts/common/helpers/localStorage";
import {enqueueSnackbar} from "notistack";
import {useCookies} from "react-cookie";
import {useGetLastSessionMutation} from "../../scripts/api/chat-api";


const VerifyAccountPage = () => {

    const [sendCode,{isLoading}] = useSendCodeMutation();
    const [registrationConfirmation ] = useRegistrationConfirmationMutation();
    const [login] = useLoginMutation();
    const [getLastSession] = useGetLastSessionMutation();

    const email=useSelector(selectEmailVerify)
    const password=useSelector(selectTempPassword)

    const [isError,setIsError]=useState()
    const [code,setCode]=useState('')
    const navigate = useNavigate();
    const [cookies, setCookies] = useCookies(["refresh-token"]);


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const session = queryParams.get("session");

    const onSubmit = async () => {
            const res=await  sendCode({
                email:email,
                pin_code:code
            })

            if(res.error){
                setIsError('The code you entered is incorrect! Please try again or ask for a new verification code.')
                return
            }
        if (email&&password) {

            let res_login = await login({
                email:email,
                password: password,
            });
            if (res_login.error) {
                return;
            }

            setLocalStorage("access-token", res_login.data.access_token);
            setCookies("refresh-token", res_login.data.refresh_token);

            if (session) {
                setIsAuth(true); // Set redux store isAuth: TRUE
                enqueueSnackbar("User logged in successfully", { variant: "success" });
                navigate(`/chat?session=${session}`);
              //  setIsLoading(false);
                return;
            }

            const res_last = await getLastSession({
                email: email,
            });
            if (res_last.error) {
                setIsError(res_last.error.message);
                return;
            }
            const chat_session = res_last.data.session;

            setIsAuth(true);
            enqueueSnackbar("User logged in successfully", { variant: "success" });
            navigate(`/chat?session=${chat_session}`);

        }}

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
