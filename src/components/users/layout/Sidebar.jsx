'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/users/UserContext';
import { RiHome9Fill } from "react-icons/ri";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { PiDevicesFill, PiNewspaper } from "react-icons/pi";
import { PiList } from "react-icons/pi";
import { IoCall } from "react-icons/io5";
import { PiUser } from "react-icons/pi";
import { PiListBulletsBold } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { FiUser } from 'react-icons/fi';
import { BsBoxSeam } from 'react-icons/bs';

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
    const [collapsed, setCollapsed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [justCollapsed, setJustCollapsed] = useState(false);
    const pathname = usePathname();
    const menuItems = [
        { icon: <RiHome9Fill size={20} />, label: "หน้าหลัก", path: "/users" },
        { icon: <BsBoxSeam size={20} />, label: "ครุภัณฑ์", path: "/users/equipment" },
        { icon: <LiaExchangeAltSolid size={20} />, label: "รายการคำขอยืม", path: "/users/borrows" },
        { icon: <IoCall size={20} />, label: "ติดต่อเจ้าหน้าที่", path: "/users/request" },
        { icon: <PiNewspaper size={20} />, label: "รายการติดต่อเจ้าหน้าที่", path: "/users/request-list" },
        { icon: <FiUser size={20} />, label: "ประวัตินิสิต", path: "/users/profile" },
    ];
    const userInfo = useUser();

    // ตัวแปรสำหรับตรวจสอบว่าควรแสดงเป็นขนาดเต็มหรือไม่
    const shouldShowExpanded = !collapsed || (collapsed && isHovered && !justCollapsed);

    // useEffect สำหรับ reset justCollapsed หลังจากกดปิด
    useEffect(() => {
        if (justCollapsed) {
            const timer = setTimeout(() => {
                setJustCollapsed(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [justCollapsed]);

    // ฟังก์ชันสำหรับจัดการการกดปุ่มปิด/เปิด
    const handleToggleCollapse = () => {
        if (!collapsed) {
            setJustCollapsed(true);
            setIsHovered(false);
        }
        setCollapsed(!collapsed);
    };

    // Close mobile menu when clicking a link
    const handleMobileMenuItemClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <div
                className={`hidden lg:block relative ${shouldShowExpanded ? 'w-70' : 'w-20'} bg-[#2f3337] min-h-screen py-4.5 flex flex-col transition-all duration-500 ease-in-out shadow-[10px_0px_15px_#00000014] ${collapsed ? 'z-50' : ''}`}
                onMouseEnter={() => collapsed && setIsHovered(true)}
                onMouseLeave={() => collapsed && setIsHovered(false)}
            >
                {/* Desktop Sidebar content - unchanged from original */}
                <div className={`text-[#454545] border-b border-[#3c4043] transition-all duration-300 ease-in-out ${shouldShowExpanded ? 'pb-4 mb-4' : 'pb-0 mb-0'}`}>
                    <div className={`flex items-center transition-all duration-300 ease-in-out ${shouldShowExpanded ? 'justify-between px-6 h-auto opacity-100' : 'justify-center px-0 h-0 opacity-0'}`}>
                        <div className={`flex items-center gap-x-4 transition-all duration-300 ease-in-out ${shouldShowExpanded ? 'w-auto opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>
                            <div className='size-10 rounded-full bg-[#03a96b] flex justify-center items-center'>
                                <FiUser size={20} className='text-white' />
                            </div>
                            
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${shouldShowExpanded ? 'w-auto' : 'w-0'}`}>
                                <div className='flex flex-col'>
                                    <p className='text-[13.5px] text-[#03a96b] whitespace-nowrap'>
                                        {userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : 'Loading...'}
                                    </p>
                                    <p className='text-[13.5px] text-[#cbcbcb] whitespace-nowrap'>
                                        {userInfo?.role ? 'นิสิต' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {shouldShowExpanded && (
                            <button onClick={handleToggleCollapse} className='duration-300 cursor-pointer'>
                                <PiList size={25} color='white' className={`transition-all duration-300 ease-in-out ${collapsed && 'rotate-180'}`} />
                            </button>
                        )}
                    </div>
                    {!shouldShowExpanded && (
                        <div className='flex justify-center items-center pb-6 pt-1 mb-4 border-b border-[#3c4043]'>
                            <button onClick={handleToggleCollapse} className='duration-200 cursor-pointer'>
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
                                    <div className={`flex items-center transition-all duration-300 ease-in-out ${shouldShowExpanded ? 'gap-x-4 px-6' : 'justify-center px-0'}`}>
                                        {item.icon}
                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${shouldShowExpanded ? 'w-auto ml-4' : 'w-0 ml-0'}`}>
                                            <p className='text-sm whitespace-nowrap'>{item.label}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile Sidebar (Overlay) */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop overlay */}
                    <div
                        className={`lg:hidden fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-40 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>

                    {/* Mobile sidebar */}
                    <div
                        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-60 bg-[#2f3337] shadow-lg transition-all duration-300 ease-in-out transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-[#3c4043]">
                            <div className="flex items-center gap-x-3">
                                <div className="w-10 h-10 bg-[#E0E0E0] rounded-full shadow-sm"></div>
                                <div>
                                    <p className="text-sm text-[#03a96b]">
                                        {userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : 'Loading...'}
                                    </p>
                                    <p className="text-xs text-[#cbcbcb]">
                                        {userInfo?.role ? 'นิสิต' : ''}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-gray-300 transition-colors">
                                <PiList size={24} />
                            </button>
                        </div>

                        <ul className="mt-4 space-y-1">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.path}
                                        onClick={() => {
                                            handleMobileMenuItemClick();
                                        }}
                                    >
                                        <div className={`flex items-center gap-x-4 px-4 py-3 transition-colors duration-200 ${pathname === item.path
                                            ? 'bg-[#03a96b] text-white'
                                            : 'text-[#9b9b9b] hover:bg-[#3c4043] hover:text-white'
                                            }`}>
                                            {item.icon}
                                            <span className="text-sm">{item.label}</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </>
    );
}