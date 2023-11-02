import "./header.scss";
import SearchIcon from "../../Icons/Search";
import { useState } from "react";

import { UserContext } from "../../context/Context";
import { useContext } from "react";

const Header = () => {
  const [searchString, setSearchString] = useState("");

  const { setQueryParams } = useContext(UserContext);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setQueryParams(`name=${searchString}`);
    setSearchString("");
  }
  function handleResetBtn() {
    setSearchString("");
    setQueryParams("");
  }
  return (
    <header className="header">
      <h1>Users</h1>
      <form className="searchBlock" onSubmit={handleSearchSubmit}>
        <div className="search">
          <span>Search :</span>
          <div className="searchInput">
            <input
              type="search"
              value={searchString}
              onChange={({ target }) => setSearchString(target.value)}
            />
            <button type="submit">
              <SearchIcon />
            </button>
          </div>
        </div>
        <div className="reset">
          <button onClick={handleResetBtn}>RESET</button>
        </div>
        <div className="addUser">
          <button>ADD-USER</button>
        </div>
      </form>
    </header>
  );
};

export default Header;
