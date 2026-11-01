'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { PiDevicesFill } from "react-icons/pi";
import { BsClock } from "react-icons/bs";
import { MdAssignment } from "react-icons/md";
import { BsClockFill } from "react-icons/bs";
import { MdHomeRepairService } from "react-icons/md";
// import { RxDotsVertical } from "react-icons/rx";
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend, AreaChart, Area } from 'recharts';
import { PiFileCsvLight } from "react-icons/pi";
import axios from 'axios';
import dayjs from 'dayjs';
import Select from 'react-select';
import Header from '@/components/staff/layout/Header';
import { IoCheckmarkDone } from "react-icons/io5";
import { MdRunningWithErrors } from "react-icons/md";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { LuClockAlert } from "react-icons/lu";
import { LuClock } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import { GoClock } from "react-icons/go";
import { PiDownloadSimple } from "react-icons/pi";
import { PiToolbox } from "react-icons/pi";
import { PiNewspaper } from "react-icons/pi";
import { DataLoading } from '@/components/users/loading/LoadingOverlay';
import { FaLayerGroup } from 'react-icons/fa';


export default function page() {
    const router = useRouter();
    const [summaryData, setSummaryData] = useState(null);
    const [equipmentByStatus, setEquipmentByStatus] = useState(null);
    const [pendingActions, setPendingActions] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [selectedUserType, setSelectedUserType] = useState({ label: 'ทั้งหมด', value: 'all' });

    const periodOptions = [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' }
    ];

    const userTypeOptions = [
        { label: 'ทั้งหมด', value: 'all' },
        { label: 'นิสิต', value: 'student' },
        { label: 'ครู', value: 'teacher' },
        { label: 'เจ้าหน้าที่', value: 'staff' }
    ];

    const [selectedPeriod, setSelectedPeriod] = useState({ label: 'Monthly', value: 'monthly' });
    // const [limit, setLimit] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(true);
    const fetchSummaryData = async () => {
        setSummaryLoading(true);
        try {
            const response = await axios.get('/api/staff/dashboard/summary');
            setSummaryData(response.data);
        } catch (error) {
            console.error('Error fetching summary data:', error);
        } finally {
            setSummaryLoading(false);
        }
    }
    const fetchEquipmentByStatus = async () => {
        try {
            const response = await axios.get('/api/staff/dashboard/by-status');
            setEquipmentByStatus(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching equipment by status:', error);
            setEquipmentByStatus([]);
        }
    }
    const [pendingActionsLoading, setPendingActionsLoading] = useState(true);
    const fetchPendingActions = async () => {
        setPendingActionsLoading(true);
        try {
            const response = await axios.get('/api/staff/dashboard/pending-actions');
            const data = response.data;
            setPendingActions({
                pendingBorrows: Array.isArray(data?.pendingBorrows) ? data.pendingBorrows : [],
                pendingMaintenance: Array.isArray(data?.pendingMaintenance) ? data.pendingMaintenance : [],
            });
        } catch (error) {
            console.error('Error fetching pending actions:', error);
            setPendingActions({ pendingBorrows: [], pendingMaintenance: [] });
        } finally {
            setPendingActionsLoading(false);
        }
    }
    const fetchStatistics = async () => {
        try {
            const response = await axios.get('/api/staff/dashboard/statistics',
                { params: { period: selectedPeriod.value } }
            );
            setStatistics(Array.isArray(response.data?.items) ? response.data.items : []);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setStatistics([]);
        }
    }
    useEffect(() => {
        fetchStatistics();
    }, [selectedPeriod]);
  
    useEffect(() => {
        fetchSummaryData();
        fetchEquipmentByStatus();
        fetchPendingActions();
    }, []);
    const truncate = (str, max = 10) => {
        if (!str && str !== 0) return '';
        const s = String(str);
        return s.length > max ? `${s.slice(0, max)} . . .` : s;
    }
    return (
        <div id="dashboard-staff" className='m-6'>
            <Header title='ยินดีต้อนรับสู่ระบบครุภัณฑ์' text='ดูและจัดการภาพรวมของระบบ' />
            <div className='grid grid-cols-[3fr_1fr] gap-x-5 items-start'>
                <div className='space-y-5'>
                    <div className='bg-white rounded-md shadow-md p-6'>
                        <div className='flex justify-between items-center mb-6'>
                            <h2 className='text-lg text-gray-600 font-semibold'>ภาพรวมในระบบ</h2>
                            <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                        </div>
                        {summaryLoading ? (
                            <DataLoading />
                        ) : <div className='grid grid-cols-3 gap-4 '>
                            <div onClick={() => router.push('/staff/manage-students')} className='border border-gray-300 rounded-md shadow-xs p-4 duration-100 hover:bg-green-50 hover:border-green-400 cursor-pointer'>
                                <div className='flex items-center justify-start gap-x-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <FiUser size={20} className='text-green-600' />
                                    </div>

                                    <div>
                                        <h2 className='text-sm text-gray-500'>ผู้ใช้ทั้งหมด</h2>
                                        <p className='text-lg text-gray-600 font-semibold'>{summaryData?.users || 0} คน</p>
                                    </div>
                                    {/* <RxDotsVertical onClick={() => router.push('/staff/equipment')} className='text-[#868686] cursor-pointer' size={20} /> */}
                                </div>
                            </div>
                            <div onClick={()=> router.push('/staff/equipment')} className='border border-gray-300 rounded-md shadow-xs p-4 duration-100 hover:bg-green-50 hover:border-green-400 cursor-pointer'>
                                <div className='flex items-center justify-start gap-x-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <BsBoxSeam size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-sm text-gray-500'>ครุภัณฑ์ทั้งหมด</h2>
                                        <p className='text-lg text-gray-600 font-semibold'>{summaryData?.equipments || 0} รายการ</p>
                                    </div>
                                    {/* <RxDotsVertical onClick={() => router.push('/staff/borrow-return')} className='text-[#868686] cursor-pointer' size={20} /> */}
                                </div>
                            </div>
                            {/* <div className='border border-gray-300 rounded-md shadow-xs p-4 duration-100 hover:bg-green-50 hover:border-green-400 cursor-default'>
                                <div className='flex items-center justify-start gap-x-6'>
                                    <BsClockFill size={30} color='#EF4444' />
                                    <div>
                                        <h2 className='text-sm text-gray-500'>รายการยืม-คืน</h2>
                                        <p className='text-lg text-gray-600 font-semibold'>เกินกำหนด 5 รายการ</p>
                                    </div>
                                    // <RxDotsVertical onClick={() => router.push('/staff/borrow-return')} className='text-[#868686] cursor-pointer' size={20} />
                                </div>
                            </div> */}
                            <div onClick={()=> router.push('/staff/equipment')} className='border border-gray-300 rounded-md shadow-xs p-4 duration-100 hover:bg-green-50 hover:border-green-400 cursor-pointer'>
                                <div className='flex items-center justify-start gap-x-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <BsBoxSeam size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-sm text-gray-500'>ครุภัณฑ์ที่พร้อมใช้งาน</h2>
                                        <p className='text-lg text-gray-600 font-semibold'>{summaryData?.availableEquipments || 0} รายการ</p>
                                    </div>
                                    {/* <RxDotsVertical onClick={() => router.push('/staff/repair-list')} className='text-[#868686] cursor-pointer' size={20} /> */}
                                </div>
                            </div>
                            <div onClick={()=> router.push('/staff/borrow-return')} className='border border-gray-300 rounded-md shadow-xs p-4 duration-100 hover:bg-green-50 hover:border-green-400 cursor-pointer'>
                                <div className='flex items-center justify-start gap-x-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <PiNewspaper size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-sm text-gray-500'>คำขอยืมรอดำเนินการ</h2>
                                        <p className='text-lg text-gray-600 font-semibold'>{summaryData?.pendingApprovalBorrows || 0} รายการ</p>
                                    </div>
                                    {/* <RxDotsVertical onClick={() => router.push('/staff/repair-list')} className='text-[#868686] cursor-pointer' size={20} /> */}
                                </div>
                            </div>
                            <div onClick={()=> router.push('/staff/installation-list')} className='border border-gray-300 rounded-md shadow-xs p-4 duration-100 hover:bg-green-50 hover:border-green-400 cursor-pointer'>
                                <div className='flex items-center justify-start gap-x-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <PiDownloadSimple size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-sm text-gray-500'>คำขอติดตั้งโปรแกรม</h2>
                                        <p className='text-lg text-gray-600 font-semibold'>{summaryData?.pendingRequests || 0} รายการ</p>
                                    </div>
                                    {/* <RxDotsVertical onClick={() => router.push('/staff/repair-list')} className='text-[#868686] cursor-pointer' size={20} /> */}
                                </div>
                            </div>
                            <div onClick={() => router.push('/staff/repair-list')} className='border border-gray-300 rounded-md shadow-xs p-4 duration-100 hover:bg-green-50 hover:border-green-400 cursor-pointer'>
                                <div className='flex items-center justify-start gap-x-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <PiToolbox size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-sm text-gray-500'>รายการแจ้งซ่อม</h2>
                                        <p className='text-lg text-gray-600 font-semibold'>{summaryData?.pendingMaintenance || 0} รายการ</p>
                                    </div>
                                    {/* <RxDotsVertical onClick={() => router.push('/staff/repair-list')} className='text-[#868686] cursor-pointer' size={20} /> */}
                                </div>
                            </div>
                        </div>}

                    </div>

                    {/* Borrow Management Section */}
                    <div className='bg-white rounded-md shadow-md p-6'>
                        <div className='flex justify-between items-center mb-6'>
                            <h2 className='text-lg text-gray-600 font-semibold'>รายการยืม - คืนครุภัณฑ์</h2>
                        </div>
                        {summaryLoading ? (
                            <DataLoading />
                        ) : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                            <div className='border border-gray-300 rounded-md shadow-xs p-4 duration-100 hover:bg-green-50 hover:border-green-400 cursor-default'>
                                <div className='flex items-center gap-3'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <GoClock size={22} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h3 className='text-sm text-gray-500'>รอดำเนินการ</h3>
                                        <p className='text-lg text-gray-600 font-semibold'>{summaryData?.pendingApprovalBorrows || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='border border-gray-300 rounded-md shadow-xs p-4 duration-100 hover:bg-green-50 hover:border-green-400 cursor-default'>
                                <div className='flex items-center gap-3'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <IoCheckmarkDone size={22} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h3 className='text-sm text-gray-500'>อนุมัติแล้ว</h3>
                                        <p className='text-lg text-gray-600 font-semibold'>{summaryData?.approvedBorrows || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='border border-gray-300 rounded-md shadow-xs p-4 duration-100 hover:bg-green-50 hover:border-green-400 cursor-default'>
                                <div className='flex items-center gap-3'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <LiaExchangeAltSolid size={22} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h3 className='text-sm text-gray-500'>กำลังยืม</h3>
                                        <p className='text-lg text-gray-600 font-semibold'>{summaryData?.activeBorrows || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='border border-gray-300 rounded-md shadow-xs p-4 duration-100 hover:bg-green-50 hover:border-green-400 cursor-default'>
                                <div className='flex items-center gap-3'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <MdRunningWithErrors size={22} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h3 className='text-sm text-gray-500'>เกินกำหนด</h3>
                                        <p className='text-lg text-gray-600 font-semibold'>{summaryData?.overdueBorrows || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>}

                    </div>

                    <div className='bg-white rounded-md shadow-md p-6'>
                        <div className='flex justify-between items-center mb-8'>
                            <h2 className='text-lg text-gray-600 font-semibold'>กราฟรายการยืมคืน</h2>
                            <div className='flex items-center gap-x-4'>
                                <div className='flex items-center gap-x-4'>
                                    <label className='text-sm text-gray-500' htmlFor="equipmentName">ระยะเวลา</label>
                                    <Select
                                        className='w-[250px]'
                                        inputId="faculty"
                                        name="faculty"
                                        options={periodOptions}
                                        value={selectedPeriod}
                                        onChange={setSelectedPeriod}
                                    />
                                </div>
                                <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                            </div>
                        </div>
                        <StatisticsAreaChart data={statistics} periodType={selectedPeriod.value} />
                    </div>
                    <div className='bg-white rounded-md shadow-md p-6'>
                        <div className='flex justify-between items-center mb-8'>
                            <h2 className='text-lg text-gray-600 font-semibold'>สถานะครุภัณฑ์ทั้งหมด</h2>
                            <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                        </div>
                        <EquipmentStatusPie data={equipmentByStatus} />
                    </div>
                </div>
                <div className='space-y-5'>
                    <div className='bg-white rounded-md shadow-md p-6'>
                        <div>
                            <div className='mb-2'>
                                <p className='text-lg text-gray-600 font-semibold mb-6'>รายการคำขอยืมล่าสุด</p>
                            </div>
                            {pendingActionsLoading ? (
                                <DataLoading />
                            ) : pendingActions?.pendingBorrows.length === 0 ? (
                                <div className='h-[280px] flex flex-col justify-center items-center tracking-[.5px]'>
                                    <div className='mb-3'>
                                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                                    </div>
                                    <p className='text-md text-[#6B7280] mb-2'>ไม่มีคำขอยืมในขณะนี้</p>
                                    <p className='text-sm text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                                </div>
                            ) : (<div className='h-[240px]'>
                                {pendingActions?.pendingBorrows.map((borrow) => (
                                    <div onClick={() => router.push('/staff/borrow-return')} className='p-3 border border-gray-300 cursor-pointer duration-200 hover:bg-green-50 hover:border-green-500  shadow-xs rounded-md mb-3 last:mb-0' key={borrow.id}>
                                        <ul>
                                            {/* <li className='text-sm text-gray-500'>{truncate(borrow.borrow_code, 25)}</li> */}
                                            <li className='text-sm text-gray-600 line-clamp-1 tracking-[1px] mb-2'>{borrow.borrow_code}</li>
                                            <div className='flex justify-between items-center'>
                                                <div className='flex items-center gap-2'>
                                                    <FiUser size={15} className='text-[#03a96b]' />
                                                    <li className='text-xs text-gray-500 line-clamp-1'>{borrow.first_name} {borrow.last_name}</li>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <GoClock size={15} className='text-[#03a96b]' />
                                                    <li className='text-xs text-gray-500 line-clamp-1'>{dayjs(borrow.borrow_date).format('DD/MM/YYYY')}</li>
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                ))}
                            </div>)}

                        </div>
                    </div>
                    <div className='bg-white rounded-md shadow-md p-6'>
                        <div>
                            <div className='mb-2'>
                                <p className='text-lg text-gray-600 font-semibold mb-6'>รายการแจ้งซ่อมล่าสุด</p>
                            </div>
                            {pendingActionsLoading ? (
                                <DataLoading />
                            ) : pendingActions?.pendingMaintenance.length === 0 ? (
                                <div className='h-[280px] flex flex-col justify-center items-center tracking-[.5px]'>
                                    <div className='mb-3'>
                                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                                    </div>
                                    <p className='text-md text-[#6B7280] mb-2'>ไม่มีรายการแจ้งซ่อมในขณะนี้</p>
                                    <p className='text-sm text-[#9CA3AF]'>กรุณารอผู้ใช้แจ้งซ่อม</p>
                                </div>
                            ) : (<div className='h-[240px]'>
                                {pendingActions?.pendingMaintenance.map((req) => (
                                    <div onClick={() => router.push('/staff/repair-list')} className='p-3 border border-gray-300 cursor-pointer duration-200 hover:bg-green-50 hover:border-green-500  shadow-xs rounded-md mb-3 last:mb-0' key={req.id}>
                                        <ul>
                                            <li className='text-sm text-gray-600 line-clamp-1 tracking-[1px] mb-2'>{(req.maintenance_request_code)}</li>
                                            <div className='flex justify-between items-center'>
                                                <div className='flex items-center gap-2'>
                                                    <FiUser size={15} className='text-[#03a96b]' />
                                                    <li className='text-xs text-gray-500 line-clamp-1'>{req.first_name} {req.last_name}</li>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <GoClock size={15} className='text-[#03a96b]' />
                                                    <li className='text-xs text-gray-500 line-clamp-1'>{dayjs(req.request_date).format('DD/MM/YYYY')}</li>
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                ))}
                            </div>)
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ...existing code...
export function StatisticsAreaChart({ data, periodType }) {
    if (!Array.isArray(data)) return <DataLoading />;

    // สร้างข้อมูลตามประเภท
    let transformed = [];
    if (periodType === 'weekly') {
        // คาดว่าโครงสร้าง: { period: '2025-W36', count, week_start, week_end, week_number, year }
        transformed = [...data]
            .sort((a, b) => (a.year - b.year) || (a.week_number - b.week_number))
            .map(d => {
                const start = dayjs(d.week_start).format('DD/MM');
                const end = dayjs(d.week_end).format('DD/MM');
                return {
                    ...d,
                    label: `W${d.week_number} (${start}-${end})`,
                    tooltipRange: `${dayjs(d.week_start).format('DD/MM/YYYY')} - ${dayjs(d.week_end).format('DD/MM/YYYY')}`
                };
            });
    } else if (periodType === 'monthly') {
        // คาดว่า period = '2025-09'
        transformed = data.map(d => ({
            ...d,
            label: dayjs(d.period + '-01').format('MMM YYYY')
        }));
    } else if (periodType === 'yearly') {
        // period = '2025'
        transformed = data.map(d => ({
            ...d,
            label: d.period
        }));
    } else {
        // fallback
        transformed = data.map(d => ({ ...d, label: d.period }));
    }

    const allZero = transformed.every(d => d.count === 0);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className='bg-white border border-[#E0E0E0] rounded px-3 py-2 text-[12px]'>
                    <p className='font-semibold mb-1'>{label}</p>
                    {periodType === 'weekly' && (
                        <p className='text-[#636363]'>{item.tooltipRange}</p>
                    )}
                    <p className='text-[#1BC688]'>จำนวน: {item.count}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={transformed} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1BC688" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#1BC688" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12, dy: 10, dx: 0 }} interval={0} height={periodType === 'weekly' ? 70 : 40} angle={periodType === 'weekly' ? 0 : 0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, dy: 0, dx: -5 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#1BC688"
                    strokeWidth={3}
                    fill="url(#colorCount)"
                    isAnimationActive={false}
                />
                {allZero && (
                    <text x="50%" y="50%" textAnchor="middle" fill="#868686" fontSize="14">
                        ยังไม่มีข้อมูล (ทั้งหมดเป็น 0)
                    </text>
                )}
            </AreaChart>
        </ResponsiveContainer>
    );
}
// ...existing code...

export function EquipmentStatusPie({ data }) {
    if (!Array.isArray(data)) return <DataLoading />;
    // const colorMap = {
    //     available: '#1BC688',
    //     borrowed: '#FACC15',
    //     repair: '#EF4444'
    // };
    const statusMap = {
        borrowed: {
            bg: "bg-orange-50 border border-orange-200",
            dot: "bg-orange-500",
            text: "text-orange-700",
            label: "กำลังยืม",
            fill: "#F97316", // tailwind bg-orange-500
        },
        available: {
            bg: "bg-green-50 border border-green-200",
            dot: "bg-green-500",
            text: "text-green-700",
            label: "ว่าง",
            fill: "#22C55E", // tailwind bg-green-500
        },
        repair: {
            bg: "bg-yellow-50 border border-yellow-200",
            dot: "bg-yellow-500",
            text: "text-yellow-700",
            label: "ซ่อมแซม",
            fill: "#EAB308", // tailwind bg-yellow-500
        },
        retired: {
            bg: "bg-red-50 border border-red-200",
            dot: "bg-red-500",
            text: "text-red-700",
            label: "นำออก",
            fill: "#EF4444", // tailwind bg-red-500
        },
        active: {
            bg: "bg-blue-50 border border-blue-200",
            dot: "bg-blue-500",
            text: "text-blue-700",
            label: "ใช้งานปกติ",
            fill: "#3B82F6", // tailwind bg-blue-500
        },
        cancelled: {
            bg: "bg-gray-50 border border-gray-300",
            dot: "bg-gray-500",
            text: "text-gray-700",
            label: "ยกเลิก",
            fill: "#6B7280", // tailwind bg-gray-500
        },
        selled: {
            bg: "bg-purple-50 border border-purple-200",
            dot: "bg-purple-500",
            text: "text-purple-700",
            label: "ขายแล้ว",
            fill: "#8B5CF6", // tailwind bg-purple-500
        },
        pending_approval: {
            bg: "bg-indigo-50 border border-indigo-200",
            dot: "bg-indigo-500",
            text: "text-indigo-700",
            label: "รออนุมัติ",
            fill: "#6366F1", // tailwind bg-indigo-500
        }
    };

    const pieData = data.map(item => ({
        name: statusMap[item.usage_name]?.label || item.usage_name,
        value: item.count,
        fill: statusMap[item.usage_name]?.fill || '#9CA3AF'
    }));
    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                >
                    {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                    ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} รายการ`, n]} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
