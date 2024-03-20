import React from 'react';
import s from "./Modal.module.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {useChangeUserMutation} from "../../../scripts/api/user-api";
import {useSelector} from "react-redux";
import {selectMe} from "../../../scripts/store/slices/chat/selectors";
import {enqueueSnackbar} from "notistack";
import ProgressBar from "../progress-bar/ProgressBar";

export const changePasswordSchema = yup.object().shape({
    old_pwd:yup.string().required(),
    new_pwd: yup
        .string()
        .required("Password is required")
        .min(8, "The password must contain 8 to 40 characters! Please try again.")
        .max(40, "The password must contain 8 to 40 characters! Please try again."),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf(
            [yup.ref("new_pwd")],
            "The passwords do not match! Please try again."
        ),
});

const PasswordPage = () => {
    const [changeUser,{isLoading:loadingChangeUser}]=useChangeUserMutation()
    const me=useSelector(selectMe)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(changePasswordSchema),
    });

    const onSubmit = async (data) => {
        if (data) {
            console.log('hi');
            console.log(data);
            const res =await changeUser({id:me.id,data:{new_pwd:data.new_pwd,old_pwd:data.old_pwd}})
            if(res.error){
                enqueueSnackbar('Something went wrong', {
                    variant: "error",
                });
                return
            }
            enqueueSnackbar(`Changes have been saved!`, {
                variant: "success",
            });
        }
    };

    return (
        <div>


            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={s.container}>
                    <p>Current Password</p>
                    <div className={s.name_container}>
                        <input className={s.input}  type="password"  {...register("old_pwd")}/>
                        <span className={s.error}>{errors.old_pwd?.message}</span>
                        <p className={s.note}>Note: Please input your current password and type the new <br/> password below and click save.</p>
                    </div>
                    <p>New Password</p>
                    <input
                        className={s.input}
                        placeholder="Type your new password here"
                        type="password"
                        {...register("new_pwd")} // Use register correctly
                    />
                    <span className={s.error}>{errors.new_pwd?.message}</span>
                    <input
                        className={s.input}
                        placeholder="Re-type your new password here"
                        type="password"
                        {...register("confirmPassword")} // Use register correctly
                    />
                    <span className={s.error}>{errors.confirmPassword?.message}</span>
                    <button
                        type="submit"
                        className={s.btn}
                    >
                        Change password
                    </button>
                </div>
            </form>
            {loadingChangeUser&& <ProgressBar/>}

        </div>
    );
};

export default PasswordPage;
