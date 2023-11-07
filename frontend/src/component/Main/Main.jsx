import UserCard from "../userCard/UserCard";
import "./main.scss";
import { useContext } from "react";
import { UserContext } from "../../context/Context";
const Main = () => {
  const { users, setUsers } = useContext(UserContext);
  return (
    <main className="main">
      <table className="userTable">
        <thead>
          <tr>
            <th>User Details</th>
            <th>Email</th>
            <th>Domain</th>
            <th>Availablity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* <Suspense fallback={<p>Loading...</p>}> */}
          {users &&
            users.map((user, _index, arr) => {
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  users={arr}
                  setUsers={setUsers}
                />
              );
            })}
          {/* </Suspense> */}
        </tbody>
      </table>
    </main>
  );
};

export default Main;
