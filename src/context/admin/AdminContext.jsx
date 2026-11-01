import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export function AdminProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get('/api/users/profile');
                setAdmin(response.data);
            } catch (error) {
                console.error("Fetch user error:", error);
            }
        }
        fetchAdmin();
    }, []);
    return (
        <AdminContext.Provider value={admin}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdmin() {
    return useContext(AdminContext);
}