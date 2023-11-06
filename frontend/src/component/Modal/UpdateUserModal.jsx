import { useState } from "react";
import "./UpdateUserModal.scss";
import axios from "axios";
import Cross from "../../Icons/Cross";
import PropTypes from "prop-types";

const UpdateUserModal = ({ setShowUpdateUser, user, users, setUser }) => {
  const [first_name, set_first_name] = useState(user.first_name);
  const [last_name, set_last_name] = useState(user.last_name);
  const [email, set_email] = useState(user.email);
  const [gender, set_gender] = useState(user.gender);
  const [domain, set_domain] = useState(user.domain);
  const [avatar, set_avatar] = useState(user.avatar);
  const [available, set_available] = useState(user.available);
  function handleFormSubmit(e) {
    e.preventDefault();
    const userData = new FormData();
    userData.append("first_name", first_name);
    userData.append("last_name", last_name);
    userData.append("email", email);
    userData.append("gender", gender);
    userData.append("domain", domain);
    userData.append("avatar", avatar);
    userData.append("available", available);

    axios
      .put(`/users/${user._id}`, userData)
      .then((d) => {
        console.log(d.data);
        setUser(
          users.map((someone) => {
            if (someone._id === user._id) {
              return d.data;
            } else {
              return user;
            }
          })
        );
        alert("user updated successfully!");
      })
      .catch((err) => {
        console.log(err.message);
        alert(`Something went wrong!, ${err.message}`);
      });
  }
  function convertAvatarToImg() {
    let image;
    try {
      image = URL.createObjectURL(avatar);
    } catch (err) {
      image = avatar;
    }
    return image;
  }
  return (
    <div className="modal-container">
      <form className="modal" onSubmit={handleFormSubmit}>
        <div className="modal-top">
          <h2>Update User</h2>
          <div
            className="cancel"
            onClick={() => {
              setShowUpdateUser(false);
            }}
          >
            <Cross />
          </div>
        </div>
        <p className="info">change the value to update the user</p>
        <div className="row row1">
          <label htmlFor="fname">First Name:</label>
          <input
            type="text"
            name="first_name"
            id="fname"
            value={first_name}
            onChange={({ target }) => set_first_name(target.value)}
            required
          />
        </div>
        <div className="row row2">
          <label htmlFor="lname">Last Name:</label>
          <input
            type="text"
            name="last_name"
            id="lname"
            value={last_name}
            onChange={({ target }) => set_last_name(target.value)}
            required
          />
        </div>
        <div className="row row3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={({ target }) => set_email(target.value)}
            required
          />
        </div>
        <div className="row row4">
          <span>Gender: </span>
          <div className="radioBtns">
            <label htmlFor="Male">Male: </label>
            <input
              type="radio"
              name="gender"
              id="Male"
              value="Male"
              checked={gender === "Male"}
              onChange={(e) => {
                set_gender(e.target.defaultValue);
              }}
              required
            />
            {/* &nbsp; */}
            <label htmlFor="female">Female: </label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={gender === "Female"}
              onChange={(e) => set_gender(e.target.defaultValue)}
            />
          </div>
        </div>
        <div className="row row5">
          <label htmlFor="domain">Domain: </label>
          <input
            type="text"
            name="domain"
            id="domain"
            value={domain}
            onChange={(e) => set_domain(e.target.value)}
            required
          />
        </div>
        <div className="row row6">
          <span>Available: </span>
          <div className="radioBtns">
            <label htmlFor="yes">Yes</label>
            <input
              type="radio"
              name="available"
              value="true"
              checked={available.toString() === "true"}
              onChange={(e) => set_available(e.target.defaultValue)}
              id="yes"
            />
            <label htmlFor="no">No</label>
            <input
              type="radio"
              name="available"
              value="false"
              checked={available.toString() === "false"}
              onChange={(e) => set_available(e.target.defaultValue)}
              id="no"
            />
          </div>
        </div>
        <div className="row row6">
          <img src={convertAvatarToImg()} alt={first_name + " " + last_name} />
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={(e) => {
              set_avatar(e.target.files[0]);
            }}
          />
        </div>
        <input type="submit" />
      </form>
    </div>
  );
};
UpdateUserModal.propTypes = {
  setShowUpdateUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  setUser: PropTypes.func.isRequired,
};
export default UpdateUserModal;
