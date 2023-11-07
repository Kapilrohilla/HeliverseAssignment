import TeamMemberCard from "../TeamMemberCard/TeamMemberCard";
import "./TeamCard.scss";
import PropTypes from "prop-types";
const TeamCard = ({ team }) => {
  return (
    <section className="teamCard">
      <h3>{team.title} Team</h3>
      <div className="users">
        {team.members &&
          team.members.map((user) => {
            return <TeamMemberCard key={user.id} user={user} />;
          })}
      </div>
    </section>
  );
};

TeamCard.propTypes = {
  team: PropTypes.shape({
    title: PropTypes.string.isRequired,
    members: PropTypes.array,
    id: PropTypes.string.isRequired,
  }),
};

export default TeamCard;
