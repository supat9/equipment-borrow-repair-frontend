'use client';
import Sidebar from '@/components/users/layout/Sidebar';
import StaffSidebar from '@/components/staff/layout/Sidebar';
import Navbar from '@/components/users/layout/Navbar';
import StaffNavbar from '@/components/staff/layout/Navbar';
import Footer from '@/components/users/layout/Footer';
import { UserProvider, useUser } from '@/context/users/UserContext';
import { StaffProvider } from '@/context/staff/StaffContext';
import { useEffect, useState } from 'react';

// สร้าง Component แยกเพื่อใช้ context hooks ภายใน Provider
function LayoutContent({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    const [isStaff, setIsStaff] = useState(false);

    // const staffInfo = useStaff();
    // useEffect(() => {
    //     if (staffInfo && staffInfo.role === 'staff') {
    //         setIsStaff(true);
    //     }
    // }, [staffInfo]);

    const userInfo = useUser(); // ใช้ useUser() แทน useStaff()
    useEffect(() => {
        if (userInfo && userInfo.role === 'staff') {
            setIsStaff(true);
        } else {
            setIsStaff(false);
        }
    }, [userInfo]);

    if (isStaff) {
        return (
            <StaffProvider>
                <div className="flex">
                    <StaffSidebar />
                    <div className="flex-1">
                        <StaffNavbar />
                        <main className=''>{children}</main>
                        <Footer />
                    </div>
                </div>
            </StaffProvider>
        );
    }

    return (
        <div className="flex">
            <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            <div className="flex-1">
                <Navbar onToggleSidebar={toggleMobileMenu} />
                <main className=''>{children}</main>
                <Footer />
            </div>
        </div>
    );
}

export default function UsersLayout({ children }) {
    return (

        <UserProvider>
            <LayoutContent>{children}</LayoutContent>
        </UserProvider>

    );
}