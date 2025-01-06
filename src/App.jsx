import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout/Layout";
import Activity from "./pages/Activity";
import Account from "./pages/Account";
import Friends from "./pages/friends/Friends";
import Friend from "./pages/friends/Friend";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Protected from "./components/layout/Protected";
import ProtectedFriend from "./components/layout/ProtectedFriend";
import Error from "./pages/Error";
import SettledExpenses from "./pages/friends/SettledExpenses";
import { StatusProvider } from "./context/StatusContext";
import ExpenseDetail from "./pages/ExpenseDetail";
import { PopupProvider } from "./context/PopupContext";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Impressum from "./pages/Impressum";
import Disclaimer from "./pages/Disclaimer";
import Group from "./pages/groups/Group";
import ProtectedGroup from "./components/layout/ProtectedGroup";
import Groups from "./pages/groups/Groups";
import ExpenseDetailViewer from "./pages/ExpenseDetailViewer";
import Home from "./pages/Home";

function App() {
  return (
    <PopupProvider>
      <StatusProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route element={<Protected />}>
                <Route index element={<Friends />} />
                <Route path="friends" element={<Friends />} />
                <Route element={<ProtectedFriend />}>
                  <Route path="friend/:id" element={<Friend />}></Route>
                  <Route
                    path="friend/:id/settledExpenses"
                    element={<SettledExpenses />}
                  ></Route>
                </Route>
                <Route path="groups" element={<Groups />}></Route>
                <Route element={<ProtectedGroup />}>
                  <Route path="group/:id" element={<Group />}></Route>
                </Route>
                <Route path="activity" element={<Activity />}></Route>
                <Route path="account" element={<Account />}></Route>
                <Route
                  path="expense/:id"
                  element={<ExpenseDetailViewer />}
                ></Route>
              </Route>
              <Route path="home" element={<Home />}></Route>
              <Route path="login" element={<Login />}></Route>
              <Route path="register" element={<Register />}></Route>
              <Route path="about" element={<About />}></Route>
              <Route path="privacypolicy" element={<PrivacyPolicy />}></Route>
              <Route path="tos" element={<TermsOfService />}></Route>
              <Route path="impressum" element={<Impressum />}></Route>
              <Route path="disclaimer" element={<Disclaimer />}></Route>
              <Route path="*" element={<Error />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StatusProvider>
    </PopupProvider>
  );
}

export default App;
