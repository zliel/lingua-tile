import React, {createContext, useState, useEffect, useContext, useCallback} from 'react';
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({token: '', isLoggedIn: false, isAdmin: false, username: ""});

    const checkAdmin = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/auth/check-admin', {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            return new Promise((resolve) => {
                setAuth(prevAuth => {
                    resolve(response.data.isAdmin);
                    return {
                        ...prevAuth,
                        isAdmin: response.data.isAdmin
                    };
                });
            });
        } catch (error) {
            // console.error(error);
            return Promise.resolve(false);
        }
    }, [auth.token]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token) {
            checkAdmin().then(isAdmin => {
                setAuth({token: token, isLoggedIn: true, isAdmin: isAdmin, username: username});
            });
        }
    }, [checkAdmin]);

    const login = (data, callback) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setAuth({token: data.token, isLoggedIn: true, isAdmin: data.isAdmin, username: data.username});
        if (callback) callback();
    };

    const logout = (callback) => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setAuth({token: '', isLoggedIn: false, isAdmin: false, username: ""});
        if (callback) callback();
    };




    return (
        <AuthContext.Provider value={{auth, login, logout, checkAdmin}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;