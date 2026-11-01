'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FiUser, FiUsers } from 'react-icons/fi';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { PiChalkboardTeacher, PiStudent } from 'react-icons/pi';
import { RiGovernmentLine } from 'react-icons/ri';
import { DataLoading } from '@/components/users/loading/LoadingOverlay';
import { FaLayerGroup } from 'react-icons/fa';
import dayjs from 'dayjs';
import Header from '@/components/users/layout/Header';

const roleColors = {
    student: { bg: 'bg-blue-50 border-blue-200', icon: 'text-blue-500', text: 'text-blue-700', label: 'นิสิต' },
    staff: { bg: 'bg-green-50 border-green-200', icon: 'text-green-500', text: 'text-green-700', label: 'เจ้าหน้าที่' },
    teacher: { bg: 'bg-purple-50 border-purple-200', icon: 'text-purple-500', text: 'text-purple-700', label: 'อาจารย์' },
    admin: { bg: 'bg-yellow-50 border-yellow-200', icon: 'text-yellow-500', text: 'text-yellow-700', label: 'ผู้ดูแลระบบ' },
};

const logTypeColors = {
    borrow: { bg: 'bg-blue-100 text-blue-700', label: 'ยืม' },
    return: { bg: 'bg-green-100 text-green-700', label: 'คืน' },
    request: { bg: 'bg-orange-100 text-orange-700', label: 'คำขอ' },
    maintenance: { bg: 'bg-red-100 text-red-700', label: 'แจ้งซ่อม' },
};

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [logsLoading, setLogsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('/api/admin/manage-users');
                setUsers(Array.isArray(res.data) ? res.data : []);
            } catch {
                setUsers([]);
            } finally {
                setUsersLoading(false);
            }
        };
        const fetchLogs = async () => {
            try {
                const res = await axios.get('/api/admin/logs', { params: { page: 1, limit: 8 } });
                const data = res.data;
                setLogs(Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []));
            } catch {
                setLogs([]);
            } finally {
                setLogsLoading(false);
            }
        };
        fetchUsers();
        fetchLogs();
    }, []);

    const countByRole = (role) => users.filter(u => u.role === role).length;

    const statCards = [
        {
            label: 'ผู้ใช้ทั้งหมด',
            value: users.length,
            icon: <FiUsers size={22} />,
            color: 'bg-gray-50 border-gray-200',
            iconColor: 'text-gray-500',
            textColor: 'text-gray-700',
            onClick: () => router.push('/admin/manage-users'),
        },
        {
            label: roleColors.student.label,
            value: countByRole('student'),
            icon: <PiStudent size={22} />,
            color: roleColors.student.bg,
            iconColor: roleColors.student.icon,
            textColor: roleColors.student.text,
            onClick: () => router.push('/admin/manage-users'),
        },
        {
            label: roleColors.teacher.label,
            value: countByRole('teacher'),
            icon: <PiChalkboardTeacher size={22} />,
            color: roleColors.teacher.bg,
            iconColor: roleColors.teacher.icon,
            textColor: roleColors.teacher.text,
            onClick: () => router.push('/admin/manage-users'),
        },
        {
            label: roleColors.staff.label,
            value: countByRole('staff'),
            icon: <RiGovernmentLine size={22} />,
            color: roleColors.staff.bg,
            iconColor: roleColors.staff.icon,
            textColor: roleColors.staff.text,
            onClick: () => router.push('/admin/manage-users'),
        },
        {
            label: roleColors.admin.label,
            value: countByRole('admin'),
            icon: <MdOutlineAdminPanelSettings size={22} />,
            color: roleColors.admin.bg,
            iconColor: roleColors.admin.icon,
            textColor: roleColors.admin.text,
            onClick: () => router.push('/admin/manage-users'),
        },
    ];

    return (
        <div className='m-6'>
            <Header title='แผงควบคุมผู้ดูแลระบบ' text='ภาพรวมและกิจกรรมล่าสุดในระบบ' />

            {/* Stat Cards */}
            <div className='grid grid-cols-5 gap-4 mb-6'>
                {usersLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className='bg-gray-50 border border-gray-200 rounded-md p-4 animate-pulse h-[80px]' />
                    ))
                    : statCards.map((card, i) => (
                        <div
                            key={i}
                            onClick={card.onClick}
                            className={`border rounded-md p-4 cursor-pointer duration-150 hover:shadow-md flex items-center gap-x-4 ${card.color}`}
                        >
                            <div className={`${card.iconColor}`}>{card.icon}</div>
                            <div>
                                <p className='text-xs text-gray-500'>{card.label}</p>
                                <p className={`text-xl font-bold ${card.textColor}`}>{card.value}</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Quick Actions + Recent Logs */}
            <div className='grid grid-cols-[1fr_2fr] gap-4'>
                {/* Quick Actions */}
                <div className='bg-white rounded-md shadow-sm border border-gray-200 p-5'>
                    <h2 className='text-base font-semibold text-gray-600 mb-4'>เมนูด่วน</h2>
                    <div className='flex flex-col gap-y-3'>
                        <button
                            onClick={() => router.push('/admin/manage-users')}
                            className='flex items-center gap-x-3 px-4 py-3 rounded-md border border-gray-200 hover:border-[#1BC688] hover:bg-green-50 duration-150 cursor-pointer text-left'
                        >
                            <FiUser size={20} className='text-[#1BC688]' />
                            <div>
                                <p className='text-sm font-medium text-gray-700'>จัดการผู้ใช้</p>
                                <p className='text-xs text-gray-400'>เพิ่ม ลบ แก้ไขผู้ใช้ในระบบ</p>
                            </div>
                        </button>
                        <button
                            onClick={() => router.push('/admin/logs')}
                            className='flex items-center gap-x-3 px-4 py-3 rounded-md border border-gray-200 hover:border-[#1BC688] hover:bg-green-50 duration-150 cursor-pointer text-left'
                        >
                            <HiOutlineClipboardList size={20} className='text-[#1BC688]' />
                            <div>
                                <p className='text-sm font-medium text-gray-700'>บันทึกกิจกรรม</p>
                                <p className='text-xs text-gray-400'>ดูประวัติการดำเนินการในระบบ</p>
                            </div>
                        </button>
                        <button
                            onClick={() => router.push('/admin/organization')}
                            className='flex items-center gap-x-3 px-4 py-3 rounded-md border border-gray-200 hover:border-[#1BC688] hover:bg-green-50 duration-150 cursor-pointer text-left'
                        >
                            <RiGovernmentLine size={20} className='text-[#1BC688]' />
                            <div>
                                <p className='text-sm font-medium text-gray-700'>จัดการองค์กร</p>
                                <p className='text-xs text-gray-400'>คณะและสาขาวิชา</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Recent Logs */}
                <div className='bg-white rounded-md shadow-sm border border-gray-200 p-5'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-base font-semibold text-gray-600'>กิจกรรมล่าสุด</h2>
                        <button onClick={() => router.push('/admin/logs')} className='text-xs text-[#1BC688] hover:underline cursor-pointer'>ดูทั้งหมด</button>
                    </div>
                    {logsLoading ? <DataLoading /> : logs.length === 0 ? (
                        <div className='h-[200px] flex flex-col justify-center items-center'>
                            <FaLayerGroup size={40} className='text-gray-200 mb-2' />
                            <p className='text-sm text-gray-400'>ยังไม่มีกิจกรรม</p>
                        </div>
                    ) : (
                        <div className='divide-y divide-gray-100'>
                            {logs.map((log, i) => {
                                const typeInfo = logTypeColors[log.type] || { bg: 'bg-gray-100 text-gray-600', label: log.type };
                                return (
                                    <div key={log.id ?? i} className='py-2.5 flex justify-between items-center gap-x-4'>
                                        <div className='flex items-center gap-x-3 min-w-0'>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${typeInfo.bg}`}>{typeInfo.label}</span>
                                            <p className='text-sm text-gray-600 truncate'>{log.borrow_code || log.request_code || log.maintenance_code || '-'}</p>
                                        </div>
                                        <div className='flex items-center gap-x-3 shrink-0'>
                                            <p className='text-xs text-gray-400'>{log.first_name} {log.last_name}</p>
                                            <p className='text-xs text-gray-400'>{dayjs(log.created_at || log.action_date).format('DD/MM/YY HH:mm')}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
