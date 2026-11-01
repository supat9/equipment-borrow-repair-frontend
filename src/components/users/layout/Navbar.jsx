'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SlLogout } from "react-icons/sl";
import { useUser } from '@/context/users/UserContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { RiShutDownLine } from "react-icons/ri";
import { PiList } from "react-icons/pi";
import Swal from 'sweetalert2';

export default function Navbar({ onToggleSidebar }) {
    const userInfo = useUser();
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
            <nav className='bg-[#03A96B] lg:px-8 lg:py-4.5 shadow-[0px_5px_15px_#00000014]'>
                <div className='tracking-[.5px] text-white'>
                    {/* Desktop Layout */}
                    <div className='hidden lg:flex justify-between items-center'>
                        <p className='text-[16px]'>ระบบยืมคืนครุภัณฑ์</p>
                        <div className='flex items-center gap-x-4'>
                            <p className='hidden lg:block'>{userInfo?.faculty_name} {userInfo?.major_name}</p>
                            <div className='flex items-center gap-x-4 border-l-2 border-[#E0E0E0] pl-4'>
                                <p className='text-[16px]'>{userInfo ? `${userInfo?.student_id || ''} ${userInfo.first_name} ${userInfo.last_name}` : 'Loading...'}</p>
                                <RiShutDownLine onClick={handleLogout} className='cursor-pointer duration-200 hover:scale-130' size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className='lg:hidden'>
                        <div className='p-4 flex justify-between items-center'>
                            <PiList
                                size={25}
                                color='white'
                                className='cursor-pointer'
                                onClick={onToggleSidebar}
                            />
                            <p className='text-base'>ระบบยืมคืนครุภัณฑ์</p>
                            <RiShutDownLine onClick={handleLogout} className='' size={20} />
                        </div>
                        <div className='text-base text-center bg-[#006b43] py-1.5'>
                            {/* <p>{userInfo?.faculty_name} {userInfo?.major_name}</p> */}
                            <p className='text-[#CAF1E3]'>{userInfo ? `${userInfo?.student_id || ''} ${userInfo.first_name} ${userInfo.last_name}` : 'Loading...'}</p>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}