import "./TeamMemberCard.scss";
import PropTypes from "prop-types";
const TeamMemberCard = ({ user }) => {
  return (
    <div className="team_member_card">
      <div className="left">
        <img src={user.avatar} alt={user.first_name} />
        <div className="details">
          <p>{user.first_name + " " + user.last_name}</p>
          <p className="email">{user.email}</p>
        </div>
      </div>
      <div className="right">
        <p>Domain: {user.domain}</p>
        <p>Available: {user.available ? "Yes" : "No"}</p>
      </div>
    </div>
  );
};
TeamMemberCard.propTypes = {
  user: PropTypes.object.isRequired,
};
export default TeamMemberCard;
