'use client';
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { RiHome9Fill } from "react-icons/ri";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { PiDevicesFill } from "react-icons/pi";
import { PiList } from "react-icons/pi";
import { PiTreeStructureFill } from "react-icons/pi";
import { HiUsers } from "react-icons/hi";
import { MdInstallDesktop } from "react-icons/md";
import { MdHomeRepairService } from "react-icons/md";
import { useAdmin } from '@/context/admin/AdminContext';
import { MdAssignment } from "react-icons/md";
import { FiUser } from 'react-icons/fi';
import { IoNewspaperSharp } from "react-icons/io5";


export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const adminInfo = useAdmin();
    const menuItems = [
        { icon: <RiHome9Fill size={20} />, label: "หน้าหลัก", path: "/admin" },
        { icon: <HiUsers size={20} />, label: "จัดการบุคลากร", path: "/admin/manage-users" },
        { icon: <PiTreeStructureFill size={20} />, label: "จัดการคณะ", path: "/admin/organization" },
        { icon: <IoNewspaperSharp size={20} />, label: "ประวัติการใช้งาน", path: "/admin/logs" },
    ];


    return (
        <div className={`relative ${collapsed ? 'w-20' : 'w-65'} bg-[#2f3337] min-h-screen py-4.5 flex flex-col transition-all duration-500 ease-in-out shadow-[10px_0px_15px_#00000014]`}>
            <div className='text-[#454545] pb-4 border-b border-[#3c4043] mb-4'>
                {!collapsed ? (
                    <div className='flex items-center justify-between px-8'>
                        <div className='flex items-center gap-x-4'>
                            <div className='size-10 rounded-full bg-[#03a96b] flex justify-center items-center'>
                                <FiUser size={20} className='text-white' />
                            </div>

                            <div className='flex flex-col'>
                                <p className='text-[13.5px] text-[#03a96b]'>
                                    {adminInfo ? `${adminInfo.first_name} ${adminInfo.last_name}` : 'Loading...'}
                                </p>
                                <p className='text-[13.5px] text-[#cbcbcb]'>
                                    {adminInfo ? adminInfo.role : 'Loading...'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setCollapsed(!collapsed)} className=' duration-200 cursor-pointer'>
                            <PiList size={25} color='white' className={`transition-all duration-300 ease-in-out ${collapsed && 'rotate-180'}`} />
                        </button>
                    </div>
                ) : (
                    <div className='flex items-center justify-center'>
                        <button onClick={() => setCollapsed(!collapsed)} className=' duration-200 cursor-pointer'>
                            <PiList size={25} color='white' className={`transition-all duration-300 ease-in-out ${collapsed && 'rotate-180'}`} />
                        </button>
                    </div>
                )}
            </div>
            <ul className='space-y-3 text-[#9b9b9b]'>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <Link href={item.path}>
                            <div className={`transition-all duration-200 py-3 tracking-[.5px]
                ${pathname === item.path ? 'text-white bg-[#03a96b]' : 'hover:text-white'}`}>
                                {!collapsed ? (
                                    <div className='flex items-center gap-x-4 px-8'>
                                        {item.icon}
                                        <p className='text-[15px]'>{item.label}</p>
                                    </div>
                                ) : (
                                    <div className='flex items-center justify-center'>
                                        {item.icon}
                                    </div>
                                )}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

