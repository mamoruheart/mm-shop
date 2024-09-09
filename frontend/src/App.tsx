import { Route, Routes } from "react-router-dom";

import { Login } from "./component/auth/Login";
import { Logout } from "./component/auth/Logout";
import { Main } from "./component/Main";
import { Categories } from "./component/Categories";
import { Product } from "./component/Product";
import { Order } from "./component/Order";
import { Dashboard } from "./component/Dashboard";
import { Manage } from "./component/manage";
import { Signup } from "./component/auth/Signup";
import { Page404 } from "./component/Page404";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/categories/:id" element={<Categories />}></Route>
        <Route path="/categories" element={<Categories />}></Route>
        <Route path="/product/:id" element={<Product />}></Route>
        <Route path="/order/:id" element={<Order />}></Route>
        <Route path="/dashboard/:mode/:id" element={<Dashboard />}></Route>
        <Route path="/dashboard/:mode/" element={<Dashboard />}></Route>
        <Route path="/dashboard/" element={<Dashboard />}></Route>
        <Route path="/manage/:mode/:id" element={<Manage />}></Route>
        <Route path="/manage/:mode" element={<Manage />}></Route>
        <Route path="/manage/" element={<Manage />}></Route>
        <Route path="/" element={<Main />}></Route>
        <Route path="*" element={<Page404 />}></Route>
        <Route path="*/*" element={<Page404 />}></Route>
      </Routes>
    </>
  );
}

export default App;
