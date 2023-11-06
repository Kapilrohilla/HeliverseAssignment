import "./header.scss";
import SearchIcon from "../../Icons/Search";
import { useEffect, useState } from "react";

import { UserContext } from "../../context/Context";
import { useContext } from "react";
import PropsTypes from "prop-types";
import axios from "axios";
const Header = ({ displayCreateUser }) => {
  const [searchString, setSearchString] = useState("");
  const { setQueryParams } = useContext(UserContext);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [gender, setGender] = useState("");
  const [available, setAvailable] = useState("");

  function handleSearchSubmit(e) {
    e.preventDefault();
    setQueryParams(
      `name=${searchString}&domain=${selectedDomain}&gender=${gender}&available=${available}`
    );
    // setSearchString("");
  }

  function handleResetBtn() {
    setSearchString("");
    setQueryParams("");
    setAvailable("");
    setGender("");
    setSearchString("");
  }
  useEffect(() => {
    async function getDomains() {
      const domain = (await axios.get("/feature/domain")).data;
      setDomains(domain);
    }
    getDomains();
  }, []);
  return (
    <header className="header">
      <h1>Users</h1>
      <form className="searchBlock" onSubmit={handleSearchSubmit}>
        <div className="search">
          <span>Search :</span>
          <div className="searchInput">
            <input
              type="search"
              placeholder="name..."
              value={searchString}
              onChange={({ target }) => setSearchString(target.value)}
            />
            <button type="submit">
              <SearchIcon />
            </button>
          </div>
          <div className="filters">
            <select
              name="domain"
              id="domain"
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value);
              }}
            >
              <option value="">Domain</option>
              {domains.map((domain, id) => {
                return (
                  <option value={domain} key={id}>
                    {domain}
                  </option>
                );
              })}
            </select>
            <select
              name="available"
              id="available"
              onChange={(e) => {
                setAvailable(e.target.value);
              }}
            >
              <option value="">Available</option>
              <option value="false">False</option>
              <option value="true">True</option>
            </select>
            <select
              name="gender"
              id="gender"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="features">
          <div className="reset">
            <button onClick={handleResetBtn}>RESET</button>
          </div>
          <div className="addUser">
            <button
              onClick={() => {
                displayCreateUser(true);
              }}
            >
              ADD-USER
            </button>
          </div>
        </div>
      </form>
    </header>
  );
};
Header.propTypes = {
  displayCreateUser: PropsTypes.func.isRequired,
};
export default Header;
