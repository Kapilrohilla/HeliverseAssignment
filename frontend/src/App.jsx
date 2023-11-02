import "./App.scss";
import Header from "./component/Header/Header";
import Main from "./component/Main/Main";
import axios from "axios";
import UserContextProvider from "./context/Context";
import Pagination from "./pagination/Pagination";
function App() {
  axios.defaults.baseURL = "http://localhost:3000/api/";

  return (
    <UserContextProvider>
      <div className="app-container">
        <Header />
        <Main />
        <Pagination />
      </div>
    </UserContextProvider>
  );
}

export default App;
