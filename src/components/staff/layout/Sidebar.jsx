'use client';
import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { RiHome9Fill } from "react-icons/ri";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { PiDevicesFill } from "react-icons/pi";
import { PiList } from "react-icons/pi";
import { HiUsers } from "react-icons/hi";
import { MdInstallDesktop } from "react-icons/md";
import { MdHomeRepairService } from "react-icons/md";
import { PiUser } from "react-icons/pi";
import { IoCall } from "react-icons/io5";
import { PiListBulletsBold } from "react-icons/pi";
import { HiDocumentReport } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { useStaff, useNotifications } from '@/context/staff/StaffContext';
import { usePathname } from 'next/navigation';
import { FiUser } from 'react-icons/fi';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [openSubMenus, setOpenSubMenus] = useState([0]);
    const staffInfo = useStaff();
    const { borrowRequests, maintenanceRequests, installRequests } = useNotifications();
    const pathname = usePathname();

    const menuItems = [
        {
            icon: <FiUser size={20} />,
            label: "เมนูเจ้าหน้าที่",
            path: "/staff/",
            children: [
                { icon: <RiHome9Fill size={20} />, label: "หน้าหลัก", path: "/staff/dashboard" },
                { icon: <LiaExchangeAltSolid size={20} />, label: "การยืม-คืน", path: "/staff/borrow-return", notification: borrowRequests },
                { icon: <PiDevicesFill size={20} />, label: "ครุภัณฑ์", path: "/staff/equipment" },
                { icon: <PiBuildingOfficeFill size={20} />, label: "สถานที่", path: "/staff/location" },
                // { icon: <PiTreeStructureFill size={20} />, label: "จัดการคณะ", path: "/staff/organization" },
                { icon: <HiUsers size={20} />, label: "รายการนิสิต", path: "/staff/manage-students" },
                { icon: <MdInstallDesktop size={20} />, label: "รายการแจ้งติดตั้ง", path: "/staff/installation-list", notification: installRequests },
                { icon: <MdHomeRepairService size={20} />, label: "รายการแจ้งซ่อม", path: "/staff/repair-list", notification: maintenanceRequests },
                { icon: <HiDocumentReport size={20} />, label: "ส่งออกข้อมูล", path: "/staff/export" },
            ]
        },
        {
            icon: <HiUsers size={20} />,
            label: "เมนูผู้ใช้",
            path: "/users/",
            children: [
                // { icon: <RiHome9Fill size={20} />, label: "หน้าหลัก", path: "/users/" },
                { icon: <PiDevicesFill size={20} />, label: "ครุภัณฑ์", path: "/users/equipment" },
                { icon: <LiaExchangeAltSolid size={20} />, label: "รายการคำขอยืม", path: "/users/borrows" },
                { icon: <PiUser size={20} />, label: "ประวัตินิสิต", path: "/users/profile" },
                { icon: <IoCall size={20} />, label: "ติดต่อเจ้าหน้าที่", path: "/users/request" },
                { icon: <PiListBulletsBold size={20} />, label: "รายการติดต่อเจ้าหน้าที่", path: "/users/request-list" },
            ]
        }
    ];

    const checkActive = (path) => pathname === path;

    const hasActiveChild = (children) => {
        return children && children.some(child => pathname === child.path);
    };

    useEffect(() => {
        menuItems.forEach((item, index) => {
            if (hasActiveChild(item.children)) {
                setOpenSubMenus(prev => prev.includes(index) ? prev : [...prev, index]);
            }
        });
    }, [pathname]);

    const handleToggleSubMenu = (index) => {
        setOpenSubMenus(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    return (
        <div className={`relative ${collapsed ? 'w-20' : 'w-70'} bg-[#2f3337] min-h-screen py-4.5 flex flex-col transition-all duration-500 ease-in-out shadow-[10px_0px_15px_#00000014]`}>
            <div className='text-[#454545] pb-4 border-b border-[#3c4043] mb-4'>
                {!collapsed ? (
                    <div className='flex items-center justify-between px-6'>
                        <div className='flex items-center gap-x-4'>
                            {/* <div className='size-[40px] bg-[#E0E0E0] rounded-[50%] shadow-[2px_2px_10px_#00000014]'></div> */}
                            <div className='size-10 rounded-full bg-[#03a96b] flex justify-center items-center'>
                                <FiUser size={20} className='text-white' />
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-[13.5px] text-[#03a96b]'>
                                    {staffInfo ? `${staffInfo.first_name} ${staffInfo.last_name}` : 'Loading...'}
                                </p>
                                <p className='text-[13.5px] text-[#cbcbcb]'>
                                    {staffInfo ? staffInfo.role : 'Loading...'}
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
                        {item.children ? (
                            <button
                                type="button"
                                className="w-full text-left"
                                onClick={() => handleToggleSubMenu(index)}
                            >
                                <div className={`transition-all duration-200 py-3 tracking-[.5px] mx-3 cursor-pointer
                                    ${openSubMenus.includes(index) || hasActiveChild(item.children) ? 'text-white bg-[#03a96b] rounded-[5px]' : 'hover:text-white'}`}>
                                    {!collapsed ? (
                                        <div className='flex justify-between items-center gap-x-4 px-6'>
                                            <div className='flex items-center gap-x-4'>
                                                {item.icon}
                                                <p className='text-[15px]'>{item.label}</p>
                                            </div>
                                            {openSubMenus.includes(index) ? <IoIosArrowForward size={18} className='rotate-90 duration-350' /> : <IoIosArrowForward size={18} className='duration-350' />}
                                        </div>
                                    ) : (
                                        <div className='flex items-center justify-center'>
                                            {item.icon}
                                        </div>
                                    )}
                                </div>
                            </button>
                        ) : (
                            <Link href={item.path}>
                                <div className={`transition-all duration-200 py-3 tracking-[.5px]
                                    ${checkActive(item.path) ? 'text-white bg-[#03a96b]' : 'hover:text-white'}`}>
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
                        )}
                        {/* Sub menu */}
                        {!collapsed && item.children && openSubMenus.includes(index) && (
                            <ul className='ml-11 mt-3 space-y-1 border-l-2 border-gray-300'>
                                {item.children.map((sub, subIdx) => (
                                    <li key={subIdx}>
                                        <Link href={sub.path}>
                                            <div className={`py-2 pl-6.5 text-[14px] flex items-center ${checkActive(sub.path) ? 'text-[white]' : 'hover:text-[#03a96b]'}`}>
                                                {/* <span>{sub.icon}</span> */}
                                                {/* <span className='size-[5px] rounded-[50%] bg-white'></span> */}
                                                <span>{sub.label}</span>
                                                {sub.notification > 0 && (
                                                    <span className={`${sub.notification > 99 ? 'size-6 p-1' : 'size-5 '} ml-4 flex justify-center items-center bg-[#d9534f] text-white text-xs rounded-full`}>
                                                        {sub.notification > 99 ? '99+' : sub.notification}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
