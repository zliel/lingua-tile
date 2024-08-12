import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ token: null, isLoggedIn: false });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuth({ token, isLoggedIn: true });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setAuth({ token, isLoggedIn: true });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({ token: null, isLoggedIn: false });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;