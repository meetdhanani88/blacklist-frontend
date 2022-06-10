import { useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { useState, useEffect } from "react";
import { useJwt } from "react-jwt";
import AuthLogin3 from "views/pages/authentication/authentication3/Login3";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
// routing
//import Routes from 'routes';

// defaultTheme
import themes from "themes";

// project imports
import NavigationScroll from "layout/NavigationScroll";
import MainLayout from "layout/MainLayout";
import Dashboard from "views/dashboard/Default";
import SamplePage from "views/sample-page";
import CustomPaginationActionsTable from "CustomComponents/Admin/ManageUser";
import ManageBlacklistVendor from "CustomComponents/Admin/ManageBlacklistVendor";
import ManageBlacklistReq from "CustomComponents/Admin/ManageBlacklistReq";
import UserHomePage from "./CustomComponents/User/UserHomepage/Index";
import BlacklistedDetails from "CustomComponents/User/UserHomepage/BlacklistedDetails/BlacklistedDetails";
import Forgotpass from "CustomComponents/Forgotpass";
import Reset from "CustomComponents/Forgotpass/Reset";
import Resetpass from "CustomComponents/ResetPass";
// ==============================|| APP ||============================== //
let currentpatharr = [];
const queryClient = new QueryClient();

const App = () => {
  const [Role, setrole] = useState("");
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const { pathname } = useLocation();
  const customization = useSelector((state) => state.customization);
  const userlist = useSelector((state) => state.Login.blacklistedvendorlist);

  if (currentpatharr.length < 1) {
    currentpatharr.push(pathname);
  }

  useEffect(() => {
    setrole(decodedToken?.role?._id);
  }, [decodedToken]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          {/* <Routes /> */}
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/" element={<Navigate to={"/login"} />}></Route>

              <Route
                path="/login"
                element={
                  <AuthLogin3
                    setrole={setrole}
                    role={Role}
                    path={currentpatharr[0]}
                  />
                }
              />

              <Route
                path="/forgotpass"
                element={<Forgotpass></Forgotpass>}
              ></Route>
              <Route
                path="/forgotpassword/:code"
                element={<Reset></Reset>}
              ></Route>
              <Route
                path="/resetpass"
                element={<Resetpass></Resetpass>}
              ></Route>

              {Role === 1 && (
                <Route path="/admin" element={<MainLayout></MainLayout>}>
                  <Route index element={<Dashboard />} />
                  <Route
                    path="userlist"
                    element={<CustomPaginationActionsTable />}
                  />
                  <Route
                    path="blacklistvendor"
                    element={<ManageBlacklistVendor />}
                  />
                  <Route path="blacklistreq" element={<ManageBlacklistReq />} />
                  <Route
                    path="/sample-page"
                    element={<SamplePage></SamplePage>}
                  />
                </Route>
              )}

              {Role === 2 && (
                <Route
                  path="/user"
                  element={<UserHomePage></UserHomePage>}
                ></Route>
              )}

              <Route
                path="/blacklist/:code"
                element={
                  userlist?.length >= 1 ? (
                    <BlacklistedDetails />
                  ) : (
                    <Navigate to={"/login"}></Navigate>
                  )
                }
              />

              <Route path="*" element={<Navigate to={"/login"} />} />
            </Routes>
          </QueryClientProvider>
        </NavigationScroll>
      </ThemeProvider>
      <ToastContainer></ToastContainer>
    </StyledEngineProvider>
  );
};

export default App;
