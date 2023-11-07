import Cross from "../../Icons/Cross";
import PropTypes from "prop-types";
import TeamCard from "../TeamCard/TeamCard";
import { useContext } from "react";
import "./ShowTeamModal.scss";
import { TeamContext } from "../../context/TeamContext";
const ShowTeamsModal = ({ displayTeams }) => {
  const { teams } = useContext(TeamContext);
  if (teams.length < 1) {
    return (
      <div className="modal-contailer">
        <div className="modal">
          <div className="modal-top">
            <h2>Create a team first to display</h2>
            <div className="cancel" onClick={() => displayTeams(false)}>
              <Cross />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-top">
          <h2>Teams</h2>
          <div className="cancel" onClick={() => displayTeams(false)}>
            <Cross />
          </div>
        </div>
        <div className="teams">
          {teams.map((team) => {
            return <TeamCard key={team.id} team={team} />;
          })}
        </div>
      </div>
    </div>
  );
};

ShowTeamsModal.propTypes = {
  displayTeams: PropTypes.func.isRequired,
};

export default ShowTeamsModal;
