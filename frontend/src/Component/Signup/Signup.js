import React, { useState } from 'react';
import InputControl from '../InputControl/InputControl';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import styles from "./Signup.module.css";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase.config';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const handleSubmission = () => {
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");
    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        const user = res.user;
        await updateProfile(user, {
          displayName: values.name,
        });
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        if (err.code === 'auth/email-already-in-use') {
          setErrorMsg("This email is already in use.");
        } else if (err.code === 'auth/weak-password') {
          setErrorMsg("Password should be at least 6 characters.");
        } else {
          setErrorMsg("Error creating account. Please try again.");
        }
      });
  };

  return (

    <div className={styles.container}>
      <div className={styles.innerBox}>
        <h1 className={styles.heading}>Signup</h1>
        <InputControl label="Name" placeholder="Enter your Name" icon={<FaUser />}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, name: event.target.value }))} />
        <InputControl label="Email" placeholder="Enter your Email" icon={<FaEnvelope />}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))} />
        <InputControl label="Password" placeholder="Enter your Password" icon={<FaLock />}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, pass: event.target.value }))} />
        <div className={styles.footer}>
          <b className={styles.error}>{errorMsg}</b>
          <button onClick={handleSubmission} disabled={submitButtonDisabled}>{submitButtonDisabled ? "Signing up..." : "Signup"}</button>
          <p>
            Already have an account?{" "}
            <span>
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup;