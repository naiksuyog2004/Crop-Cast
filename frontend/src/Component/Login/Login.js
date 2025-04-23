
import styles from './Login.module.css';
import InputControl from '../InputControl/InputControl';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import { FaEnvelope, FaLock } from 'react-icons/fa';
function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);


  const handleSubmission = async () => {
    if (!values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);

    try {
      // Authenticate the user with your backend
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email: values.email,
        password: values.pass,
      });

      // Extract token and username from the response
      const { token, username } = response.data;

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Optionally store the username for immediate use
      localStorage.setItem('username', username);

      console.log("User authenticated. Token stored:", token);

      // Navigate to the home page
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMsg("Invalid email or password. Please try again.");
    } finally {
      setSubmitButtonDisabled(false);
    }
  };


  // const handleSubmission = () => {
  //   if (!values.email || !values.pass) {
  //     setErrorMsg("Fill all fields");
  //     return;
  //   }
  //   setErrorMsg("");

  //   setSubmitButtonDisabled(true);
  //   signInWithEmailAndPassword(auth, values.email, values.pass)
  //     .then(async (res) => {
  //       setSubmitButtonDisabled(false);

  //       // Fetch user details from backend or Firebase
  //       try {
  //         const userId = res.user.uid; // Firebase user ID
  //         localStorage.setItem('userId', userId); // Store userId in localStorage

  //         // Fetch username from backend
  //         const response = await axios.get(`http://localhost:5001/api/user/${userId}`);
  //         const username = response.data.username;

  //         localStorage.setItem('username', username); // Store username in localStorage
  //         console.log("Username stored:", username);

  //         navigate("/"); // Navigate to the home page
  //       } catch (error) {
  //         console.error("Error fetching user details:", error);
  //         setErrorMsg("Failed to fetch user details. Please try again.");
  //       }
  //     })
  //     .catch((err) => {
  //       setSubmitButtonDisabled(false);
  //       setErrorMsg(err.message);
  //     });
  // };
  return (
    <div className={styles.container}>
      <div className={styles.innerBox}>
        <h1 className={styles.heading}>Login</h1>
        <InputControl label="Email" placeholder="Enter your Email"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))} icon={<FaEnvelope />} />
        <InputControl type="password" label="Password" placeholder="Enter your Password" icon={<FaLock />}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, pass: event.target.value }))} />
        <b className={styles.error}>{errorMsg}</b>
        <button disabled={submitButtonDisabled} onClick={handleSubmission}>Login</button>
        <p>
          New User{" "}
          <span>
            <Link to="/signup">Sign up</Link>
          </span>
        </p>
        {/* <p>
          Login with phone? <Link to="/phonelogin">Phone Login</Link>
        </p> */}
      </div>
    </div>

  )
}
export default Login;