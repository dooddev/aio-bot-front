import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { SnackbarProvider } from "notistack";
import ReactGA from "react-ga"
import "./App.css";
import "./assets/nucleo-icons.css";
import Dashboard from "./components/chat/Dashboard";
import Train from "./components/train/Train";
import { createContext, useEffect, useState } from "react";
import LoginPage from "./components/auth/login-page/LoginPage";
import RegistrationPage from "./components/auth/registration-page/RegistrationPage";
import Footer from "./components/common/footer/Footer";
import VerifyAccountPage from "./components/auth/verify-page/VerifyAccountPage";
import RecoveryPasswordPage from "./components/auth/recovery-password-page/RecoveryPasswordPage";
import HomePage from "./components/home/HomePage";
import ResetPassword from "./components/auth/resest-password-page/ResetPasswordPage";
import { getLocalStorage } from "./scripts/common/helpers/localStorage";
import { useDispatch } from "react-redux";
import { setTheme } from "./scripts/store/slices/app/app-slices";
import InformPage from "./components/auth/inform-page/InformPage";
import PrivateRoute from "./components/common/auth-redirect/PrivateRout";
import { ContextSocketProvider } from "./scripts/context/SocketContext";
import AcceptInvitation from "./components/chat/AcceptInvitation";
export const DataContext = createContext();

const TRACKING_ID = "G-WCSG6BH638"
ReactGA.initialize(TRACKING_ID);

function App() {
  const [data, setData] = useState({});
  const location = useLocation();
  const dispatch = useDispatch();

  const isChatPath = location?.pathname === "/chat";

  useEffect(() => {
    const theme = getLocalStorage("theme");
    dispatch(setTheme(theme || "dark"));

    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <DataContext.Provider value={{ data, setData }}>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<LoginPage />} />

            {/* <Route
              path={"/registration"}
              element={<PrivateRoute path={"registration"} />}
            > */}
            <Route path="/registration" element={<RegistrationPage />} />
            {/* </Route> */}
            <Route path={"/chat"} element={<PrivateRoute path={"chat"} />}>
              <Route
                path="/chat"
                element={
                  <ContextSocketProvider>
                    <Dashboard />
                  </ContextSocketProvider>
                }
              />
            </Route>
            <Route path="/train" element={<Train />} />
            <Route path="/verify" element={<VerifyAccountPage />} />
            <Route path="/recovery" element={<RecoveryPasswordPage />} />
            <Route path="/reset_password" element={<ResetPassword />} />
            <Route path="/inform" element={<InformPage />} />
            <Route path="/accept-invitation" element={<AcceptInvitation />} />
          </Routes>
          {!isChatPath && <Footer />}
        </div>
      </DataContext.Provider>
    </SnackbarProvider>
  );
}

export default App;
