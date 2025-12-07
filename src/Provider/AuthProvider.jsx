import React, { useEffect, useState, createContext } from 'react';
import { app } from '../firebase/firebase.config';
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
} from "firebase/auth";

export const AuthContext = createContext();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Authprovider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Save login time
    const saveLoginTime = () => {
        localStorage.setItem("lastLogin", new Date().toLocaleString());
    };

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const updateUser = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    };

    const logOut = () => {
        return signOut(auth);
    };

    //  Email Login + save login time
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password).then(res => {
            saveLoginTime();
            return res;
        });
    };

    //  Google Login + save login time
    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, provider).then(res => {
            saveLoginTime();
            return res;
        });
    };

    const resetPassword = (email) => {
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    };

    //  When Firebase restores login on refresh, also save time
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Only set when user exists and nothing stored yet
                if (!localStorage.getItem("lastLogin")) {
                    saveLoginTime();
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authData = {
        user,
        setUser,
        createUser,
        signIn,
        logOut,
        updateUser,
        googleLogin,
        resetPassword,
        loading,
    };

    return (
        <AuthContext value={authData}>
            {children}
        </AuthContext>
    );
};

export default Authprovider;
