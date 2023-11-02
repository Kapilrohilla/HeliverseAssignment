import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
export const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 20;
  const totalPage = useRef(0);

  useEffect(() => {
    let link = `/users?page=${page}&limit=${limit}`;
    console.log(link);
    axios.get(link).then((d) => {
      setUser(d.data[0]);

      totalPage.current = Math.ceil(d.data[1] / limit);
      ("");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        page,
        setPage,
        totalPage: totalPage.current,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
UserContextProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
export default UserContextProvider;
