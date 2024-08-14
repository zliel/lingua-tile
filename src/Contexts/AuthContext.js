import React, {createContext, useState, useEffect, useContext, useCallback} from 'react';
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({token: '', isLoggedIn: false, isAdmin: false});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuth({token, isLoggedIn: true, isAdmin: false});
        }
    }, []);

    const login = (token, callback) => {
        localStorage.setItem('token', token);
        setAuth({token, isLoggedIn: true, isAdmin: false});
        if (callback) callback();
    };

    const logout = (callback) => {
        localStorage.removeItem('token');
        setAuth({token: '', isLoggedIn: false, isAdmin: false});
        if (callback) callback();
    };

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
            console.error(error);
            return Promise.resolve(false);
        }
    }, [auth.token]);

    return (
        <AuthContext.Provider value={{auth, login, logout, checkAdmin}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;