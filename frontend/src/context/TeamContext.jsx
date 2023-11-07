import { useEffect, useState } from "react";
import { createContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const TeamContext = createContext(null);

const TeamContextProvider = ({ children }) => {
  const [teamMember, setTeamMember] = useState([]);
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    axios
      .get("/team")
      .then((d) => setTeams(d.data))
      .catch((err) => {
        alert("Error: team should have unique domain members");
        console.log(err.message);
      });
  }, []);
  function displayTeams() {
    axios
      .get("/team")
      .then((d) => {
        setTeams(d.data);
        console.log(d.data);
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
      });
  }
  return (
    <TeamContext.Provider
      value={{ teamMember, setTeamMember, teams, setTeams, displayTeams }}
    >
      {children}
    </TeamContext.Provider>
  );
};

TeamContextProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
export default TeamContextProvider;
