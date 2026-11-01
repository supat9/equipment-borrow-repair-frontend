import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/users/profile');
                setUser(response.data);
            } catch (error) {
                console.error("Fetch user error:", error);
            }
        }
        fetchUser();
    }, []);
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext);
}