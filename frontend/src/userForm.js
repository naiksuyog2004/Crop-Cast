import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase/firebase.config"; // Firebase imports
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
                // Redirect or show an error message if not authenticated
                console.log("User is not logged in");
            }
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    // Check Firestore to see if the user has already submitted the form
    const checkIfFormSubmitted = async (uid) => {
        const userDocRef = doc(db, "users", uid);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists() && docSnapshot.data().isFormSubmitted) {
            setIsFormSubmitted(true);
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("You must be logged in to submit the form.");
            return;
        }

        setLoading(true);

        try {
            // Save user data to Firestore under the authenticated user's email
            const userDocRef = doc(db, "users", user.uid);

            // Save form data and mark it as submitted
            await setDoc(userDocRef, {
                fullName: formData.fullName,
                phone: formData.phone,
                city: formData.city,
                email: user.email, // Save the user's email to Firestore
                isFormSubmitted: true, // Mark the form as submitted
            });

            // Success message
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
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <h2>User Information Form</h2>
            {user && !isFormSubmitted ? (
                <>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "10px" }}>
                            <label>
                                Full Name:
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                                />
                            </label>
                        </div>

                        <div style={{ marginBottom: "10px" }}>
                            <label>
                                Phone Number:
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    required
                                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                                />
                            </label>
                        </div>

                        <div style={{ marginBottom: "10px" }}>
                            <label>
                                City/District:
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter your city or district"
                                    required
                                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: loading ? "#aaa" : "#4CAF50",
                                color: "#fff",
                                border: "none",
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </>
            ) : (
                <p>{isFormSubmitted ? "Form already submitted." : "Please log in to fill out the form."}</p>
            )}
        </div>
    );
};

export default UserForm;