import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
export const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 20;
  const totalPage = useRef(0);
  const [queryParam, setQueryParams] = useState(``);
  useEffect(() => {
    let link = `/users?page=${page}&limit=${limit}&${queryParam}`;
    console.log(link);
    axios.get(link).then((d) => {
      setUsers(d.data[0]);

      totalPage.current = Math.ceil(d.data[1] / limit);
    });
  }, [page, queryParam]);
  return (
    <UserContext.Provider
      value={{
        users,
        setUsers,
        page,
        setPage,
        totalPage: totalPage.current,
        queryParam,
        setQueryParams,
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
