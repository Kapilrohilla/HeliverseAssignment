import "./App.scss";
import Header from "./component/Header/Header";
import Main from "./component/Main/Main";
import axios from "axios";
import UserContextProvider from "./context/UserContext";
import Pagination from "./component/pagination/Pagination";
import CreateUserModal from "./component/Modal/CreateUserModal";
import { useState } from "react";
import TeamContextProvider from "./context/TeamContext";
import ShowTeamsModal from "./component/Modal/ShowTeamsModal";

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_BASE_URL;
  const [showUser, setShowUser] = useState(false);
  const [showTeams, setShowTeams] = useState(false);

  return (
    <UserContextProvider>
      <TeamContextProvider>
        <div className="app-container">
          <Header
            displayCreateUser={setShowUser}
            displayTeams={() => setShowTeams(true)}
          />
          <Main />
          <Pagination />
          {showUser && <CreateUserModal showCreateUser={setShowUser} />}
          {showTeams && (
            <ShowTeamsModal displayTeams={() => setShowTeams(false)} />
          )}
        </div>
      </TeamContextProvider>
    </UserContextProvider>
  );
}

export default App;
