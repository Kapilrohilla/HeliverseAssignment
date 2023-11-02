import Delete from "../../Icons/Delete";
import PropTypes from "prop-types";
import Edit from "../../Icons/Edit";
import axios from "axios";

const UserCard = ({ user, users, setUsers }) => {
  const { _id, first_name, last_name, avatar, email, domain, available } = user;
  const name = first_name.trim() + " " + last_name.trim();
  async function handleDelete() {
    await axios.delete(`/users/${_id}`).then((d) => {
      console.log(d.data);
      setUsers(
        users.filter((user) => {
          return _id !== user._id;
        })
      );
    });
  }
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
        <button onClick={handleDelete}>
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
    _id: PropTypes.string.isRequired,
  }),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
      available: PropTypes.bool.isRequired,
      _id: PropTypes.string.isRequired,
    })
  ),
  setUsers: PropTypes.func.isRequired,
};
export default UserCard;
