import "./CreateUserModal.scss";
import Cross from "../../Icons/Cross";
import PropTypes from "prop-types";
import axios from "axios";
import { useState } from "react";
const CreateUserModal = ({ showCreateUser }) => {
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [email, set_email] = useState("");
  const [gender, set_gender] = useState("");
  const [domain, set_domain] = useState("");
  const [avatar, set_avatar] = useState("");
  const [available, set_available] = useState("");
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
      .post("/users", userData)
      .then((d) => {
        console.log(d.data);
        alert("user created successfully!");
      })
      .catch((err) => {
        console.log(err.message);
        alert(`Something went wrong!, ${err.message}`);
      });
  }
  return (
    <form className="modal" onSubmit={handleFormSubmit}>
      <div className="modal-top">
        <h2>Create User</h2>
        <div className="cancel" onClick={() => showCreateUser(false)}>
          <Cross />
        </div>
      </div>
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
        <br />
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
      <div className="row row2">
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
      <div className="row row3">
        <span>Gender: </span>
        <label htmlFor="Male">Male: </label>
        <input
          type="radio"
          name="gender"
          id="Male"
          value="Male"
          onChange={(e) => set_gender(e.target.defaultValue)}
          required
        />
        &nbsp;
        <label htmlFor="female">Female: </label>
        <input
          type="radio"
          name="gender"
          value="Female"
          onChange={(e) => set_gender(e.target.defaultValue)}
        />
      </div>
      <div className="row row4">
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
      <div className="row row5">
        <span>Available: </span>
        <label htmlFor="yes">Yes</label>
        <input
          type="radio"
          name="available"
          value="true"
          onChange={(e) => set_available(e.target.defaultValue)}
          id="yes"
        />
        &nbsp;
        <label htmlFor="no">No</label>
        <input
          type="radio"
          name="available"
          value="false"
          onChange={(e) => set_available(e.target.defaultValue)}
          id="no"
        />
      </div>
      <div className="row row6">
        Image:
        <input
          type="file"
          name="avatar"
          id="avatar"
          onChange={(e) => set_avatar(e.target.files[0])}
        />
      </div>
      <input type="submit" />
    </form>
  );
};
CreateUserModal.propTypes = {
  showCreateUser: PropTypes.func.isRequired,
};
export default CreateUserModal;
