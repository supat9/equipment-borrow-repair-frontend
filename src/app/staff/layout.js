'use client';
import Sidebar from '@/components/staff/layout/Sidebar';
import Navbar from '@/components/staff/layout/Navbar';
import Footer from '@/components/staff/layout/Footer';
import { StaffProvider } from '@/context/staff/StaffContext';

export default function StaffLayout({ children }) {
    return (
        <StaffProvider>
            <div className="flex ">
                <Sidebar />
                <div className="flex-1">
                    <Navbar />
                    <main className=''>{children}</main>
                    <Footer />
                </div>
            </div>
        </StaffProvider>
    );
}
