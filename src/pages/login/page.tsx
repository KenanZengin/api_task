import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertColor, Snackbar, CircularProgress } from "@mui/material";
import { login } from "../../actions/login";
import { LoginSchema } from "../../schema";
import { LoginReturnType } from "../../types";
import { FcGoogle } from "react-icons/fc";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";

const Login = () => {

    const navigate = useNavigate();

    const [passwordState, setPasswordState] = useState<boolean>(true)
    const [formMessage,setFormMessage] = useState<null | string>();
    const [open, setOpen] = useState<boolean>(false);
    const [messageType, setMessageType] = useState<AlertColor | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(()=>{
        if(localStorage.getItem("fake_token")){
            navigate("/")
        }
    },[navigate])

    const { handleSubmit, register, formState:{errors, isValid} } = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues:{
            username: "",
            password: ""
        }
    });


    const onSubmit = (values: z.infer<typeof LoginSchema>) => {

        login(values).then((data: LoginReturnType)=>{
            if(data){
                setMessageType(() => data.messageType);
                setFormMessage(() => data.message);
                setOpen(() => true);
            }
            if(data.messageType === "success"){
                
                setLoading(() => true);
                setTimeout(()=>{
                    navigate("/");
                },2500);
                // navigate(window.location.pathname);

               localStorage.setItem("fake_token","123456")
            }
        });

    };
    
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {

        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
    <div className="login_form">
        <div className="login_form_wrapper">
            <h2>Oturum Aç</h2>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <label htmlFor="username">
                    <div className="l-sp">
                        <span className="l-nm">Kullanıcı adı</span>
                    </div>
                    <div className="inp_w">
                        <input 
                            type="text" 
                            id="username" 
                            className={`${errors.username ? "err-inp" : "sccs-inp"}`}
                            placeholder="Enter your user name..." 
                            {...register("username")}
                            disabled={loading}
                        />
                        {errors.username?.message && <p className="frm-err-msg">{errors.username.message}</p>}
                    </div>
                </label>
                <label htmlFor="password">
                    <div className="l-sp">
                        <span className="l-nm">Şifre</span>
                        <span className="l-frgtpss">Parolanızı mı unuttunuz?</span>
                    </div>
                    <div className="inp_w">
                        <input 
                            type={passwordState ? "password" : "text"} 
                            id="password" 
                            className={`${errors.password ? "err-inp" : "sccs-inp"}`}
                            placeholder="Enter your password..." 
                            {...register("password")}
                            disabled={loading}
                        />
                        <span onClick={() => setPasswordState(() => !passwordState)}>
                            {passwordState ?  <FaRegEyeSlash size={25} /> : <IoEye size={25} />}
                        </span>
                        {errors.password?.message && <p className="frm-err-msg">{errors.password.message}</p>}
                    </div>
                </label>
                <button type="submit" className={`${isValid ? "form_ok":"form_err"}`}>
                    {loading 
                        ? <CircularProgress color="inherit" size={25} />
                        : "Giriş yap"
                    }
                </button>
            </form>
            <div className="or">OR</div>
            <div className="other_op"><FcGoogle size={20}/> Google ile giriş yap</div>
            <p className="dnt_accnt">Henüz hesabınız yok mu? <span>Üye ol</span></p>
        </div>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{vertical:"top",horizontal:"center"}}>
            <Alert
                onClose={handleClose}
                severity={messageType}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {formMessage}
            </Alert>
        </Snackbar>
    </div>
    )
}

export default Login