import React, {createContext, useState, useEffect, useContext, useCallback} from 'react';
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({token: '', isLoggedIn: false, isAdmin: false});

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
        if (token) {
            checkAdmin().then(isAdmin => {
                setAuth({token, isLoggedIn: true, isAdmin: isAdmin});
            });
        }
    }, [checkAdmin]);

    const login = (data, callback) => {
        localStorage.setItem('token', data.token);
        setAuth({token: data.token, isLoggedIn: true, isAdmin: data.isAdmin});
        if (callback) callback();
    };

    const logout = (callback) => {
        localStorage.removeItem('token');
        setAuth({token: '', isLoggedIn: false, isAdmin: false});
        if (callback) callback();
    };




    return (
        <AuthContext.Provider value={{auth, login, logout, checkAdmin}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;