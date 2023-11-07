import "./header.scss";
import SearchIcon from "../../Icons/Search";
import { useEffect, useState } from "react";

import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import PropsTypes from "prop-types";
import axios from "axios";
import { TeamContext } from "../../context/TeamContext";

const disabledBtnCss = {
  backgroundColor: "rgb(238, 238, 238)",
  color: "black",
};

const Header = ({ displayCreateUser, displayTeams }) => {
  const [searchString, setSearchString] = useState("");
  const { setQueryParams, setPage } = useContext(UserContext);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [gender, setGender] = useState("");
  const [available, setAvailable] = useState("");
  const { teamMember, setTeams, teams } = useContext(TeamContext);

  function handleCreateTeam() {
    console.log(teamMember);
    if (teamMember.length === 0) {
      return;
    }
    const teamTitle = prompt("Please, team name: ");
    if (!teamTitle) {
      return;
    }
    const team = { title: teamTitle, members: teamMember };
    axios
      .post("/team", team)
      .then((d) => {
        setTeams(teams.concat(d.data));
        alert("successfully created team");
        window.location.reload();
      })
      .catch((err) => {
        alert("Error: team should have unique domain members");
        console.log(err.message);
      });
  }
  function handleSearchSubmit(e) {
    e.preventDefault();
    setQueryParams(
      `name=${searchString}&domain=${selectedDomain}&gender=${gender}&available=${available}`
    );
  }

  function handleResetBtn() {
    // setTeamMember([]);
    setSearchString("");
    setQueryParams("");
    setAvailable("");
    setGender("");
    setSearchString("");
    setSelectedDomain("");
    setAvailable("");
    setGender("");
    setPage(1);
    // window.location.reload();
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
          <span style={{ minWidth: "70px" }}>Search :</span>
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
              value={available}
              onChange={(e) => {
                setAvailable(e.target.value);
              }}
            >
              <option value="">Available</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            <select
              name="gender"
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="features">
          <div className="left">
            <div className="reset">
              <button onClick={handleResetBtn}>Reset Search</button>
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
          <div className="right">
            <button onClick={displayTeams}>Displays Team</button>
            <button
              style={teamMember.length === 0 ? disabledBtnCss : {}}
              onClick={handleCreateTeam}
            >
              Create Team
            </button>
          </div>
        </div>
      </form>
    </header>
  );
};
Header.propTypes = {
  displayCreateUser: PropsTypes.func.isRequired,
  displayTeams: PropsTypes.func.isRequired,
};
export default Header;
