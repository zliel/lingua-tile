import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../Contexts/AuthContext';
import {useSnackbar} from "../Contexts/SnackbarContext";
import {Typography} from "@mui/material";


const ProtectedRoute = ({ children }) => {
    const { auth, checkAdmin } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAdmin = async () => {
            const isAdmin = await checkAdmin();
            setLoading(false);
            if (!auth.isLoggedIn || !isAdmin) {
                showSnackbar("You are not authorized to view this page", "error");
                navigate('/home');
            }
        };

        if (auth.token) {
            verifyAdmin();
        } else {
            setLoading(false);
        }
    }, [auth.token, navigate, auth.isLoggedIn, showSnackbar, checkAdmin]);

    if (loading) {
        return (<>
            <Typography variant={"h5"} textAlign={"center"}>Loading...</Typography>
        </>);
    }

    return children;
};

export default ProtectedRoute;