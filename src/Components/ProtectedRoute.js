import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../Contexts/AuthContext';
import {useSnackbar} from "../Contexts/SnackbarContext";
import {Typography} from "@mui/material";
import {useQuery} from "@tanstack/react-query";

const ProtectedRoute = ({ children }) => {
    const { auth, checkAdmin } = useAuth();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const token = auth.token || localStorage.getItem('token');
    const { data: isAdmin, isLoading, isError } = useQuery({
        queryKey: ['checkAdmin', token],
        queryFn: async () => {
            if (token) {
                return await checkAdmin();
            }
            return false;
        },
        enabled: !!token
    });

    useEffect(() => {
        if (!isLoading) {
            if (isError || !isAdmin) {
                showSnackbar("You are not authorized to view that page", "error");
                navigate('/home');
            }
        }
    }, [isError, isLoading, isAdmin, navigate, showSnackbar]);

    if (isLoading) {
        return (<>
            <Typography variant={"h5"} textAlign={"center"}>Loading...</Typography>
        </>);
    }

    if (isError || !isAdmin) {
        return null;
    }

    return children;
};

export default ProtectedRoute;