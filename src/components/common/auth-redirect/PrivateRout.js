import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useMeQuery } from "../../../scripts/api/auth-api";
import { useEffect, useState } from "react";
import { useGetUserQuery } from "../../../scripts/api/auth-api";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMe } from "../../../scripts/store/slices/chat/chat-slice";
import ProgressBar from "../progress-bar/ProgressBar";
import {fetchMeData, setIsAuth} from "../../../scripts/store/slices/app/app-slices";
import { selectIsAuth } from "../../../scripts/store/slices/app/selectors";
import {instance} from "../../../scripts/instance/instance";

function PrivateRoute({ path }) {
  //const [skip, setSkip] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  //const { isSuccess, isLoading:isLoadingMe, isError, data: auth, refetch } = useMeQuery();
  //const { data: user,refetch:refetchGetUser } = useGetUserQuery(auth?.id, { skip });
  const isAuth = useSelector(selectIsAuth);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const session = queryParams.get("session");

  const dispatch = useDispatch();

  useEffect(() => {
    if (!session) {
      navigate("/login-page");
    }
  }, []);

  useEffect( ()=>{
    async function fetchData() {
      try {
        const {data}= await instance(`auth/me`, { method: 'GET' })

        if(data){
          const {data:user}=await instance(`user/${data.id}`, { method: 'GET' })
          dispatch(setMe(user))
          dispatch(setIsAuth(true))
          setIsLoading(false);
        }
      }
      catch (e){
        setIsLoading(false);
      }

    }
    fetchData();


  },[])

  // useEffect(() => {
  //   if (isError) {
  //     setIsLoading(false);
  //   }
  // }, [isError]);

  // useEffect(() => {
  //     changeUser()
  // }, [user]);
  //
  //
  // const changeUser=()=>{
  //   if (user) {
  //     dispatch(setMe(user));
  //     dispatch(setIsAuth(true));
  //     setIsLoading(false);
  //   }
  //
  // }
  //
  // useEffect(() => {
  //   console.log("isError", isError);
  //   console.log("isSuccess", isSuccess);
  //   console.log('auth',auth);
  //   if (auth?.id) {
  //     console.log('SETSKIP')
  //     console.log(skip)
  //     setSkip(false);
  //   }
  // }, [auth, isError, isSuccess,isLoadingMe]);
  //
  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log('REFETCH')
  //     const {isSuccess} =await refetch({ forceRefetch: true });
  //     console.log(isSuccess, skip)
  //     if(isSuccess){
  //       console.log('im going send req')
  //       try{
  //         const res=await refetchGetUser()
  //         console.log(res)
  //       }
  //       catch (e) {
  //         console.log(e)
  //       }
  //
  //
  //     }
  //
  //
  //   };
  //
  //   fetchData();
  // }, [path]);


  if (isLoading) {
    return (
      <ProgressBar add_style={{ background: "rgba(9, 1, 25)", opacity: 1 }} />
    );
  }

  if (path === "chat") {
    console.log("this is redirecting me");
    console.log(isAuth);
    return isAuth ? (
      <Outlet />
    ) : (
      <Navigate
        to={
          session != undefined && session != null
            ? `/login?session=${session}`
            : "/login-page"
        }
      />
    );
  }
  // if (path === "login-page" || path === "registration") {
  //   return !isAuth ? <Outlet /> : <Navigate to={"/chat"} />;
  // }
}

export default PrivateRoute;
