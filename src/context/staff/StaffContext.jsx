import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const StaffContext = createContext();
const NotificationContext = createContext();

export function StaffProvider({ children }) {
    const [staff, setStaff] = useState(null);
    const [borrowRequests, setBorrowRequests] = useState(0);
    const [maintenanceRequests, setMaintenanceRequests] = useState(0);
    const [installRequests, setInstallRequests] = useState(0);
    const fetchBorrowRequests = async () => {
        try {
            const response = await axios.get('/api/staff/borrow/pending', {
                params: {
                    page: 1,
                    limit: 1000
                }
            });
            setBorrowRequests(response.data.data.length);
        } catch (error) {
            console.error("Fetch borrow requests error:", error);
        }
    }
    const fetchMaintenanceRequests = async () => {
        try {
            const response = await axios.get('/api/staff/maintenance-request/inspection', {
                params: {
                    page: 1,
                    limit: 1000
                }
            });
            setMaintenanceRequests(response.data.data.length);
        } catch (error) {
            console.error("Fetch maintenance requests error:", error);
        }
    }
    const fetchInstallRequests = async () => {
        try {
            const response = await axios.get('/api/staff/request/waiting',
                { params: { page: 1, limit: 1000 } }
            );
            setInstallRequests(response.data.data.length);
        } catch (error) {
            console.error("Fetch install requests error:", error);
        }
    }

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get('/api/users/profile');
                setStaff(response.data);
            } catch (error) {
                console.error("Fetch user error:", error);
            }
        }

        fetchStaff();
        fetchBorrowRequests();
        fetchMaintenanceRequests();
        fetchInstallRequests();

        const interval = setInterval(() => {
            fetchBorrowRequests();
            fetchMaintenanceRequests();
            fetchInstallRequests();
        }, 60 * 1000); // ทุก 60 วินาที
        return () => clearInterval(interval);
    }, []);

    return (
        <StaffContext.Provider value={staff}>
            <NotificationContext.Provider
                value={{
                    borrowRequests,
                    maintenanceRequests,
                    installRequests,
                    fetchBorrowRequests,
                    fetchMaintenanceRequests,
                    fetchInstallRequests
                }}>
                {children}
            </NotificationContext.Provider>
        </StaffContext.Provider>
    )
}

export function useStaff() {
    return useContext(StaffContext);
}

export function useNotifications() {
    return useContext(NotificationContext);
}