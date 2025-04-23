// PhoneLogin.js
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from "../../firebase/firebase.config"; // Make sure this path is correct
import styles from './Login.module.css';

function PhoneLogin() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const setUpRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    console.log("Recaptcha verified");
                },
                'expired-callback': () => {
                    setErrorMsg("Recaptcha expired, please try again.");
                }
            }, auth);
        }
    };

    const sendVerificationCode = async () => {
        if (!phoneNumber) {
            setErrorMsg("Enter a valid phone number");
            return;
        }

        setLoading(true);
        setErrorMsg('');

        setUpRecaptcha(); // Setup Recaptcha before sending the code
        const appVerifier = window.recaptchaVerifier;

        try {
            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
            alert("Verification code sent!");
        } catch (error) {
            console.error("Error during signInWithPhoneNumber:", error);
            setErrorMsg(error.message);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        if (!verificationCode) {
            setErrorMsg("Enter the verification code");
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            await confirmationResult.confirm(verificationCode);
            alert("Phone number verified successfully!");
            navigate('/');
        } catch (error) {
            setErrorMsg("Invalid verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.innerBox}>
                <h1 className={styles.heading}>Phone Login</h1>

                <div className={styles.inputContainer}>
                    <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={styles.inputField}
                    />
                </div>

                <button
                    onClick={sendVerificationCode}
                    disabled={loading || confirmationResult}
                    className={styles.button}
                >
                    {loading ? "Sending..." : "Send Verification Code"}
                </button>

                {confirmationResult && (
                    <>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                placeholder="Enter verification code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className={styles.inputField}
                            />
                        </div>

                        <button
                            onClick={verifyCode}
                            disabled={loading}
                            className={styles.button}
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </>
                )}

                <div id="recaptcha-container"></div>

                {errorMsg && <p className={styles.error}>{errorMsg}</p>}
            </div>
        </div>
    );
}

export default PhoneLogin;
