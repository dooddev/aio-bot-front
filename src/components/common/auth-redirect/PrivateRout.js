import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useMeQuery } from "../../../scripts/api/auth-api";
import { useEffect, useState } from "react";
import { useGetUserQuery } from "../../../scripts/api/chat-api";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMe } from "../../../scripts/store/slices/chat/chat-slice";
import ProgressBar from "../progress-bar/ProgressBar";
import { setIsAuth } from "../../../scripts/store/slices/app/app-slices";
import { selectIsAuth } from "../../../scripts/store/slices/app/selectors";

function PrivateRoute({ path }) {
  const [skip, setSkip] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { isSuccess, isError, data: auth, refetch } = useMeQuery();
  const { data: user } = useGetUserQuery(auth?.id, { skip });
  const isAuth = useSelector(selectIsAuth);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const session = queryParams.get("session");

  const dispatch = useDispatch();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (isError) {
      setIsLoading(false);
    }
  }, [isError]);

  useEffect(() => {
    console.log('CHANGE USER',user)
    if (user) {
      dispatch(setMe(user));
      dispatch(setIsAuth(true));
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log("isError", isError);
    console.log("isSuccess", isSuccess);
    console.log(auth);
    if (auth?.id) {
      setSkip(false);
    }
  }, [auth, isError, isSuccess]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('REFETCH')
      await refetch({ forceRefetch: true });
    };

    fetchData();
  }, [path]);

  // useEffect(() => {
  //   console.log('CHANGEUSER')
  //   console.log(user)
  //   if (user) {
  //     dispatch(setMe(user));
  //     dispatch(setIsAuth(true));
  //   }
  //   setIsLoading(false)
  // }, [user]);

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
            : "/login"
        }
      />
    );
  }
  // if (path === "login" || path === "registration") {
  //   return !isAuth ? <Outlet /> : <Navigate to={"/chat"} />;
  // }
}

export default PrivateRoute;
