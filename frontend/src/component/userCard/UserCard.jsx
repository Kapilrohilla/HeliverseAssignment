import Delete from "../../Icons/Delete";
import PropTypes from "prop-types";
import Edit from "../../Icons/Edit";
const UserCard = ({ user }) => {
  const { first_name, last_name, avatar, email, domain, available } = user;
  const name = first_name.trim() + " " + last_name.trim();
  return (
    <tr className="userCard">
      <td>
        <img style={{ height: "100%" }} src={avatar} alt={name} />
        <div className="userDetails">
          <p>{name}</p>
          <p>{email}</p>
        </div>
      </td>
      <td>{email}</td>
      <td>{domain}</td>
      <td>{available ? "Yes" : "No"}</td>
      <td>
        <button>
          <Edit />
        </button>
        <button>
          <Delete />
        </button>
      </td>
    </tr>
  );
};
UserCard.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    available: PropTypes.bool.isRequired,
  }),
};
export default UserCard;
