import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { SnackbarProvider } from "notistack";
import "./App.css";
import "./assets/nucleo-icons.css";
import Dashboard from "./components/chat-page/Dashboard";
import Train from "./components/Train";
import { createContext, useEffect, useState } from "react";
import LoginPage from "./components/auth-page/LoginPage";
import RegistrationPage from "./components/auth-page/RegistrationPage";
import Footer from "./components/common/footer/Footer";
import VerifyAccountPage from "./components/auth-page/VerifyAccountPage";
import RecoveryPasswordPage from "./components/auth-page/RecoveryPasswordPage";
import Home from "./components/home-page/Home";
import ResetPassword from "./components/auth-page/ResetPasswordPage";
import { getLocalStorage } from "./scripts/common/helpers/localStorage";
import { useDispatch } from "react-redux";
import { setTheme } from "./scripts/store/slices/app/app-slices";
import InformPage from "./components/auth-page/InformPage";
import PrivateRoute from "./components/common/auth-redirect/PrivateRout";

import AcceptInvitation from "./components/chat-page/AcceptInvitation";
export const DataContext = createContext();

let socket;

function App() {
  const [data, setData] = useState({});
  const location = useLocation();
  const dispatch = useDispatch();

  const isChatPath = location?.pathname === "/chat";

  useEffect(() => {
    const theme = getLocalStorage("theme");
    dispatch(setTheme(theme || "dark"));
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
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<LoginPage />} />

            {/* <Route
              path={"/registration"}
              element={<PrivateRoute path={"registration"} />}
            > */}
            <Route path="/registration" element={<RegistrationPage />} />
            {/* </Route> */}
            <Route path={"/chat"} element={<PrivateRoute path={"chat"} />}>
              <Route path="/chat" element={<Dashboard />} />
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
