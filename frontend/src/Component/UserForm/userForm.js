import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase.config"; // Firebase imports
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions
import { onAuthStateChanged } from "firebase/auth"; // Firebase Auth listener

const UserForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        city: "",
    });
    const [user, setUser] = useState(null); // Store logged-in user
    const [loading, setLoading] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    // Check if the user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                checkIfFormSubmitted(user.uid); // Check if form was already submitted
            } else {
                console.log("User is not logged in");
            }
        });

        return () => unsubscribe();
    }, []);

    // Check Firestore to see if the user has already submitted the form
    const checkIfFormSubmitted = async (uid) => {
        try {
            const userDocRef = doc(db, "users", uid);
            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists() && docSnapshot.data().isFormSubmitted) {
                setIsFormSubmitted(true);
            }
        } catch (error) {
            console.error("Error checking form submission:", error);
        }
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Validate phone number
    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePhoneNumber(formData.phone)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        if (!user) {
            alert("You must be logged in to submit the form.");
            return;
        }

        setLoading(true);

        try {
            const userDocRef = doc(db, "users", user.uid);

            await setDoc(userDocRef, {
                fullName: formData.fullName,
                phone: formData.phone,
                city: formData.city || "Not provided",
                email: user.email, // Save the user's email to Firestore
                isFormSubmitted: true, // Mark the form as submitted
            });

            alert("User information saved successfully!");
            setIsFormSubmitted(true); // Prevent further form submission
            setFormData({ fullName: "", phone: "", city: "" });
        } catch (error) {
            console.error("Error saving user data:", error);
            alert("Failed to save user information.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "500px",
                margin: "0 auto",
                background: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
        >
            <h2 style={{ textAlign: "center", color: "#333" }}>User Information Form</h2>
            {user && !isFormSubmitted ? (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "15px" }}>
                        <label htmlFor="fullName" style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                            Full Name:
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label htmlFor="phone" style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                            Phone Number:
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your 10-digit phone number"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label htmlFor="city" style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                            City/District (optional):
                        </label>
                        <input
                            type="text"
                            name="city"
                            id="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter your city or district"
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: loading ? "#aaa" : "#4CAF50",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            fontSize: "16px",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            ) : (
                <p
                    style={{
                        textAlign: "center",
                        color: "#555",
                        fontSize: "16px",
                    }}
                >
                    {isFormSubmitted
                        ? "You have already submitted the form."
                        : "Please log in to fill out the form."}
                </p>
            )}
        </div>
    );
};

export default UserForm;
