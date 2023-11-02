import UserCard from "../userCard/UserCard";
import "./main.scss";
import { Suspense, useContext } from "react";
import { UserContext } from "../../context/Context";
const Main = () => {
  const { user } = useContext(UserContext);
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
          <Suspense fallback={<p>Loading...</p>}>
            {user &&
              user.map((user) => {
                return <UserCard key={user._id} user={user} />;
              })}
          </Suspense>
        </tbody>
      </table>
    </main>
  );
};

export default Main;
