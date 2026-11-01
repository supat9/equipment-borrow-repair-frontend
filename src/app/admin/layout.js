'use client';
import Sidebar from '@/components/admin/layout/Sidebar';
import Navbar from '@/components/admin/layout/Navbar';
import Footer from '@/components/admin/layout/Footer';
import { AdminProvider } from '@/context/admin/AdminContext';

export default function AdminLayout({ children }) {
    return (
        <AdminProvider>
            <div className="flex">
                <Sidebar />
                <div className="flex-1">
                    <Navbar />
                    <main className=''>{children}</main>
                    <Footer />
                </div>
            </div>
        </AdminProvider>
    );
}
