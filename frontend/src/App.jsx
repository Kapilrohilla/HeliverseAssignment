import "./App.scss";
import Header from "./component/Header/Header";
import Main from "./component/Main/Main";
import axios from "axios";
import UserContextProvider from "./context/Context";
import Pagination from "./pagination/Pagination";
import CreateUserModal from "./component/Modal/CreateUserModal";
import { useState } from "react";
function App() {
  axios.defaults.baseURL = "http://localhost:3000/api/";
  const [showUser, setShowUser] = useState(false);
  return (
    <UserContextProvider>
      <div className="app-container">
        <Header displayCreateUser={setShowUser} />
        <Main />
        <Pagination />
        {showUser ? <CreateUserModal showCreateUser={setShowUser} /> : ""}
      </div>
    </UserContextProvider>
  );
}

export default App;
