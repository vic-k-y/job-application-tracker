import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { LoginContextProvider } from "./context/LoginContext";
import { GeneralContextProvider } from "./context/GeneralContext";

import Dashboard from "./pages/Dashboard";
import ApplicationsList from "./components/ApplicationsList";
import CompanyList from "./components/CompanyList";
import SourceList from "./components/SourceList";
import Account from "./components/Account";

function App() {
  return (
    <LoginContextProvider>
      <GeneralContextProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            {/* <Route path="signup" element={<Signup />} /> */}
            <Route path="signup" element={<Signup />} />
            <Route path="dashboard" element={<Dashboard />}>
              <Route index element={<Navigate replace to="applications" />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="companies" element={<CompanyList />} />
              {/* <Route path="sources" element={<SourceList />} /> */}
              <Route path="account" element={<Account />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GeneralContextProvider>
    </LoginContextProvider>
  );
}

export default App;
