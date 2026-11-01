'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SlLogout } from "react-icons/sl";
import { useAdmin } from '@/context/admin/AdminContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { RiShutDownLine } from "react-icons/ri";
import Swal from 'sweetalert2';

export default function Navbar() {
    const adminInfo = useAdmin();
    const router = useRouter();
    const handleLogout = async () => {
        try {
            const result = await Swal.fire({
                title: 'ยืนยันการออกจากระบบ',
                text: `คุณต้องการออกจากระบบหรือไม่?`,
                icon: 'warning',
                confirmButtonText: 'ออกจากระบบ',
                confirmButtonColor: '#d9534f',
                showCancelButton: true,
                cancelButtonColor: '#6B7280',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    container: 'z-[10000]'
                }
            });
            if (!result.isConfirmed) return;
            await axios.post('/api/auth/logout');
            router.push('/login');
            // Cookies.remove('token');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
    return (
        <div>
            <nav className='bg-[#03A96B]  px-8 py-4.5 shadow-[0px_5px_15px_#00000014]'>
                <div className=' tracking-[.5px] flex justify-between items-center text-white'>
                    <p className='text-[16px]'>Admin Dashboard</p>
                    <div className='flex items-center gap-x-4'>
                        <p>{adminInfo?.faculty_name} {adminInfo?.major_name}</p>
                        <div className='flex items-center gap-x-4 border-l-2 border-[#E0E0E0] pl-4'>
                            <p className='text-[16px]'>{adminInfo ? `${adminInfo?.student_id || ''} ${adminInfo?.first_name || ''} ${adminInfo?.last_name || ''}` : 'Loading...'}</p>
                            <RiShutDownLine onClick={handleLogout} className='cursor-pointer duration-200 hover:scale-130' size={20} />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
