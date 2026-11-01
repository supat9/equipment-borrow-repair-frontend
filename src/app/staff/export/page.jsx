'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { PiDownloadSimple, PiFileCsvLight } from "react-icons/pi";
import { HiDocumentReport } from "react-icons/hi";
import { MdFileDownload } from "react-icons/md";
import Select from 'react-select';
import Header from '@/components/staff/layout/Header';
import axios from 'axios';
import DatePickerInput from '@/components/inputs/DatePicker';


export default function ExportPage() {
    // User export filters
    const [selectedUserType, setSelectedUserType] = useState({ label: 'ทั้งหมด', value: 'all' });

    // Borrow request filters
    const [borrowStartDate, setBorrowStartDate] = useState('');
    const [borrowEndDate, setBorrowEndDate] = useState('');
    const [borrowStatus, setBorrowStatus] = useState({ label: 'ทุกสถานะ', value: 'all' });

    // Maintenance request filters
    const [maintenanceStartDate, setMaintenanceStartDate] = useState('');
    const [maintenanceEndDate, setMaintenanceEndDate] = useState('');
    const [maintenanceType, setMaintenanceType] = useState({ label: 'ทุกประเภท', value: 'all' });

    // Installation request filters
    const [installationStartDate, setInstallationStartDate] = useState('');
    const [installationEndDate, setInstallationEndDate] = useState('');
    const [installationStatus, setInstallationStatus] = useState({ label: 'ทุกสถานะ', value: 'all' });

    // Equipment filters
    const [equipmentStatus, setEquipmentStatus] = useState({ label: 'ทุกสถานะ', value: 'all' });
    const [equipmentCategory, setEquipmentCategory] = useState({ label: 'ทุกหมวดหมู่', value: 'all' });
    const [equipmentCategoryOptions, setEquipmentCategoryOptions] = useState([
        { label: 'ทุกหมวดหมู่', value: 'all' }
    ]);
    const [equipmentStatusOptions, setEquipmentStatusOptions] = useState([
        { label: 'ทุกสถานะ', value: 'all' }
    ]);

    const userTypeOptions = [
        { label: 'ทั้งหมด', value: 'all' },
        { label: 'นิสิต', value: 'student' },
        { label: 'ครู', value: 'teacher' },
        { label: 'เจ้าหน้าที่', value: 'staff' }
    ];

    const statusOptions = [
        { label: 'ทุกสถานะ', value: 'all' },
        { label: 'รอดำเนินการ', value: 'waiting' },
        { label: 'อนุมัติแล้ว', value: 'confirmed' },
        { label: 'ปฏิเสธ', value: 'rejected' },
        { label: 'ยกเลิก', value: 'cancelled' },
        { label: 'เสร็จสิ้น', value: 'completed' }
    ];

    const borrowStatusOptions = [
        { label: 'ทุกสถานะ', value: 'all' },
        { label: 'รอการอนุมัติ', value: 'pending_approval' },
        { label: 'อนุมัติแล้ว', value: 'approved' },
        { label: 'ปฏิเสธ', value: 'rejected' },
        { label: 'กำลังยืม', value: 'active' },
        { label: 'เกินกำหนด', value: 'overdue' },
        { label: 'คืนแล้ว', value: 'returned' },
        { label: 'ยกเลิก', value: 'cancelled' }
    ];

    const maintenanceTypeOptions = [
        { label: 'ทุกประเภท', value: 'all' },
        { label: 'ซ่อมแซม', value: 'repair' },
        { label: 'บำรุงรักษา', value: 'maintenance' },
        { label: 'ตรวจสอบ', value: 'inspection' },
        { label: 'เปลี่ยนทดแทน', value: 'replacement' },
        { label: 'เสร็จสิ้น', value: 'completed' }
    ];

    // Helper function to format date to YYYY-MM-DD
    // const formatDate = (date) => {
    //     if (!date) return '';
    //     if (typeof date === 'string') return date; // เผื่อกรณีเป็น string อยู่แล้ว
    //     return date.toISOString().slice(0, 10);
    // };
    function formatDate(date) {
        if (!date) return '';
        if (typeof date === 'string') return date;
        // ใช้ local time
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Fetch equipment categories from API
    const fetchEquipmentCategories = async () => {
        try {
            const response = await axios.get('/api/staff/equipment-category');
            const categories = response.data;
            const categoryOptions = [
                { label: 'ทุกหมวดหมู่', value: 'all' },
                ...categories.filter(category => category && (category.id || category.category_id)).map(category => ({
                    label: category.categoryName || category.category_name || 'ไม่ระบุชื่อ',
                    value: String(category.id || category.category_id)
                }))
            ];

            setEquipmentCategoryOptions(categoryOptions);
        } catch (error) {
            console.error('Error fetching equipment categories:', error);
            setEquipmentCategoryOptions([
                { label: 'ทุกหมวดหมู่', value: 'all' }
            ]);
        }
    };

    // Fetch equipment usage status from API
    const fetchEquipmentUsageStatus = async () => {
        try {
            const response = await axios.get('/api/staff/equipment/status/usage-status');
            const statuses = response.data;



            const usageNameTH = {
                available: "ว่าง",
                borrowed: "กำลังยืม",
                repair: "ซ่อมแซม",
                pending_approval: "รออนุมัติ",
                retired: "นำออก",
                active: "ใช้งาน",
                cancelled: "ยกเลิก",
                selled: "ขายแล้ว"
            };

            const statusOptions = [
                { label: 'ทุกสถานะ', value: 'all' },
                ...statuses.map((status) => ({
                    value: status.usage_name || status.status_name || String(status.id),
                    label: usageNameTH[status.usage_name] || status.status_name || status.usage_name || 'ไม่ระบุสถานะ'
                }))
            ];

            setEquipmentStatusOptions(statusOptions);
        } catch (error) {
            console.error('Error fetching equipment usage status:', error);
            setEquipmentStatusOptions([
                { label: 'ทุกสถานะ', value: 'all' }
            ]);
        }
    };
    // Load categories and usage status on component mount
    useEffect(() => {
        fetchEquipmentCategories();
        fetchEquipmentUsageStatus();
    }, []);

    // Export functions
    const handleDownloadUsers = () => {
        let url = '/api/staff/export/user?format=csv';

        if (selectedUserType.value !== 'all') {
            url += `&role=${selectedUserType.value}`;
        }

        window.location.href = url;
    }

    const buildBorrowURL = () => {
        let url = `/api/staff/export/borrow?format=csv`;

        if (borrowStartDate) {
            url += `&startDate=${formatDate(borrowStartDate)}`;
        }
        if (borrowEndDate) {
            url += `&endDate=${formatDate(borrowEndDate)}`;
        }
        if (borrowStatus.value !== 'all') {
            url += `&status=${borrowStatus.value}`;
        }

        return url;
    };

    const buildInstallationURL = () => {
        let url = `/api/staff/export/request?format=csv&type=installation`;

        if (installationStartDate) {
            url += `&startDate=${formatDate(installationStartDate)}`;
        }
        if (installationEndDate) {
            url += `&endDate=${formatDate(installationEndDate)}`;
        }
        if (installationStatus.value !== 'all') {
            url += `&status=${installationStatus.value}`;
        }

        return url;
    }

    const handleDownloadBorrowRequests = () => {
        window.location.href = buildBorrowURL();
    }

    const handleDownloadMaintenanceRequests = () => {
        let url = '/api/staff/export/maintenance-request?format=csv';

        if (maintenanceStartDate) {
            url += `&startDate=${formatDate(maintenanceStartDate)}`;
        }
        if (maintenanceEndDate) {
            url += `&endDate=${formatDate(maintenanceEndDate)}`;
        }
        if (maintenanceType.value !== 'all') {
            url += `&maintenance_type=${maintenanceType.value}`;
        }

        window.location.href = url;
    }

    const handleDownloadInstallationRequests = () => {
        window.location.href = buildInstallationURL();
    }

    const handleDownloadEquipment = () => {
        let url = '/api/staff/export/equipment?format=csv';

        if (equipmentStatus.value !== 'all') {
            url += `&status=${equipmentStatus.value}`;
        }
        if (equipmentCategory.value !== 'all') {
            url += `&category_id=${equipmentCategory.value}`;
        }

        window.location.href = url;
    }

    return (
        <div id="export-staff" className='m-6'>
            <Header title='ส่งออกข้อมูล' text='ดาวน์โหลดรายงานและข้อมูลต่างๆ ในรูปแบบ CSV' />
            {/* Header Section */}
            {/* <div className='bg-gradient-to-r from-[#1BC688] to-[#03a96b] rounded-[10px] p-6 mb-8 text-white'>
                <div className='flex items-center gap-4'>
                    <HiDocumentReport size={40} />
                    <div>
                        <h2 className='text-[24px] font-bold'>ระบบส่งออกข้อมูล</h2>
                        <p className='text-[16px] opacity-90'>เลือกประเภทข้อมูลและตัวกรองที่ต้องการ แล้วดาวน์โหลดเป็นไฟล์ CSV</p>
                    </div>
                </div>
            </div> */}

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Borrow Request Export Section */}
                <div className='bg-white rounded-md shadow-md p-6 h-[435px] '>
                    <div className='flex flex-col justify-between h-full'>
                        <div>
                            <div className='flex justify-between items-start'>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                                        <PiFileCsvLight size={24} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h3 className='text-[20px] font-bold text-[#4E5155]'>รายการยืม-คืน</h3>
                                        <p className='text-[14px] text-[#868686]'>ส่งออกข้อมูลการยืม-คืนครุภัณฑ์</p>
                                    </div>
                                </div>
                                <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-sm text-gray-600 mb-3'>สถานะ</label>
                                <Select
                                    inputId="borrowStatusFilter"
                                    name="borrowStatusFilter"
                                    options={borrowStatusOptions}
                                    value={borrowStatus}
                                    onChange={setBorrowStatus}
                                    placeholder="เลือกสถานะ..."
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                                        control: (base, state) => ({
                                            ...base,
                                            width: '100%',
                                            minHeight: '40px',
                                            height: '40px',
                                            borderRadius: '5px',
                                            borderColor: state.isFocused ? '#1BC688' : '#D1D5DB',
                                            boxShadow: state.isFocused ? '0 0 0 1.5px #1BC688' : 'none',
                                            fontSize: '15px',
                                            color: '#4E5155',
                                            transition: 'border-color 0.2s',
                                            zIndex: 999, // รวม zIndex ไว้ใน control เดียว
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: '#868686',
                                        }),
                                    }}
                                />
                            </div>
                            <div className='grid grid-cols-1 gap-4 mb-4'>
                                <div>
                                    <label className='block text-sm text-gray-600 mb-3'>วันที่เริ่มต้น</label>
                                    {/* <input
                                        type="date"
                                        value={borrowStartDate}
                                        onChange={(e) => setBorrowStartDate(e.target.value)}
                                        className='w-full h-[40px] text-gray-600 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                    /> */}
                                    <DatePickerInput
                                        value={borrowStartDate}
                                        onChange={setBorrowStartDate}
                                        placeholderText="เลือกวันที่เริ่มต้น"
                                        maxDate={borrowEndDate || null}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-gray-600 mb-3'>วันที่สิ้นสุด  <span className='text-yellow-600 text-sm'>( ต้องระบุวันเริ่มต้นก่อน )</span></label>
                                    {/* <input
                                        type="date"
                                        value={borrowEndDate}
                                        onChange={(e) => setBorrowEndDate(e.target.value)}
                                        className='w-full h-[40px] text-gray-600 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                    /> */}
                                    <DatePickerInput
                                        value={borrowEndDate}
                                        onChange={setBorrowEndDate}
                                        placeholderText="เลือกวันที่สิ้นสุด"
                                        minDate={borrowStartDate || null}
                                        disabled={!borrowStartDate}
                                        containerClassName={`flex items-center justify-between border border-[#D1D5DB] group rounded-[5px] py-2.5 px-4 duration-300 focus-within:border-[#1BC688] focus-within:ring-1 focus-within:ring-[#1BC688] ${!borrowStartDate ? 'bg-gray-100' : 'bg-white'}`}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className='flex justify-end'>
                            <button
                                onClick={handleDownloadBorrowRequests}
                                className='flex justify-center items-center gap-x-2 cursor-pointer rounded-[5px] w-fit px-4 py-2 hover:scale-105 bg-green-600 text-white duration-200 hover:bg-green-700'
                            >
                                <PiDownloadSimple size={20} />

                                <span className='text-sm'>ดาวน์โหลด</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Maintenance Request Export Section */}
                <div className='bg-white rounded-md shadow-md p-6 h-[435px]'>
                    <div className='flex flex-col justify-between h-full'>
                        <div>
                            <div className='flex justify-between items-start'>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center'>
                                        <PiFileCsvLight size={24} className='text-yellow-600' />
                                    </div>
                                    <div>
                                        <h3 className='text-[20px] font-bold text-[#4E5155]'>รายการแจ้งซ่อม</h3>
                                        <p className='text-[14px] text-[#868686]'>ส่งออกข้อมูลการแจ้งซ่อมครุภัณฑ์</p>
                                    </div>
                                </div>
                                <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-sm text-gray-600 mb-3'>ประเภทการซ่อมบำรุง</label>
                                <Select
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                                        control: (base, state) => ({
                                            ...base,
                                            width: '100%',
                                            minHeight: '40px',
                                            height: '40px',
                                            borderRadius: '5px',
                                            borderColor: state.isFocused ? '#1BC688' : '#D1D5DB',
                                            boxShadow: state.isFocused ? '0 0 0 1.5px #1BC688' : 'none',
                                            fontSize: '15px',
                                            color: '#4E5155',
                                            transition: 'border-color 0.2s',
                                            zIndex: 1, // รวม zIndex ไว้ใน control เดียว
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: '#868686',
                                        }),
                                    }}

                                    inputId="maintenanceTypeFilter"
                                    name="maintenanceTypeFilter"
                                    options={maintenanceTypeOptions}
                                    value={maintenanceType}
                                    onChange={setMaintenanceType}
                                    placeholder="เลือกประเภทการซ่อมบำรุง..."
                                />
                            </div>
                            <div className='grid grid-cols-1 gap-4 mb-4'>
                                <div>
                                    <label className='block text-sm text-gray-600 mb-3'>วันที่เริ่มต้น</label>
                                    {/* <input
                                        type="date"
                                        value={maintenanceStartDate}
                                        onChange={(e) => setMaintenanceStartDate(e.target.value)}
                                        className='w-full h-[40px] text-gray-600 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                                    /> */}
                                    <DatePickerInput
                                        value={maintenanceStartDate}
                                        onChange={setMaintenanceStartDate}
                                        placeholderText="เลือกวันที่เริ่มต้น"
                                        maxDate={maintenanceEndDate || null}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-gray-600 mb-3'>วันที่สิ้นสุด  <span className='text-yellow-600 text-sm'>( ต้องระบุวันเริ่มต้นก่อน )</span></label>
                                    {/* <input
                                        type="date"
                                        value={maintenanceEndDate}
                                        onChange={(e) => setMaintenanceEndDate(e.target.value)}
                                        className='w-full h-[40px] text-gray-600 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
                                    /> */}
                                    <DatePickerInput
                                        value={maintenanceEndDate}
                                        onChange={setMaintenanceEndDate}
                                        placeholderText="เลือกวันที่สิ้นสุด"
                                        minDate={maintenanceStartDate || null}
                                        disabled={!maintenanceStartDate}
                                        containerClassName={`flex items-center justify-between border border-[#D1D5DB] group rounded-[5px] py-2.5 px-4 duration-300 focus-within:border-[#1BC688] focus-within:ring-1 focus-within:ring-[#1BC688] ${!maintenanceStartDate ? 'bg-gray-100' : 'bg-white'}`}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className='flex justify-end'>
                            <button
                                onClick={handleDownloadMaintenanceRequests}
                                className='flex justify-center items-center gap-x-2 cursor-pointer rounded-[5px] w-fit px-4 py-2 hover:scale-105 bg-yellow-600 text-white duration-200 hover:bg-yellow-700 '
                            >
                                <PiDownloadSimple size={20} />
                                <span className='text-sm'>ดาวน์โหลด</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Installation Request Export Section */}
                <div className='bg-white rounded-md shadow-md p-6 h-[435px]'>
                    <div className='flex flex-col justify-between h-full'>
                        <div className=''>
                            <div className='flex justify-between items-start'>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center'>
                                        <PiFileCsvLight size={24} className='text-purple-600' />
                                    </div>
                                    <div>
                                        <h3 className='text-[20px] font-bold text-[#4E5155]'>รายการติดตั้งโปรแกรม</h3>
                                        <p className='text-[14px] text-[#868686]'>ส่งออกข้อมูลการติดตั้งโปรแกรม</p>
                                    </div>
                                </div>
                                <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-sm text-gray-600 mb-3'>สถานะ</label>
                                <Select
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                                        control: (base, state) => ({
                                            ...base,
                                            width: '100%',
                                            minHeight: '40px',
                                            height: '40px',
                                            borderRadius: '5px',
                                            borderColor: state.isFocused ? '#1BC688' : '#D1D5DB',
                                            boxShadow: state.isFocused ? '0 0 0 1.5px #1BC688' : 'none',
                                            fontSize: '15px',
                                            color: '#4E5155',
                                            transition: 'border-color 0.2s',
                                            zIndex: 1, // รวม zIndex ไว้ใน control เดียว
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: '#868686',
                                        }),
                                    }}

                                    inputId="installationStatusFilter"
                                    name="installationStatusFilter"
                                    options={statusOptions}
                                    value={installationStatus}
                                    onChange={setInstallationStatus}
                                    placeholder="เลือกสถานะ..."
                                />
                            </div>
                            <div className='grid grid-cols-1 gap-4 mb-4'>
                                <div>
                                    <label className='block text-sm text-gray-600 mb-3'>วันที่เริ่มต้น</label>
                                    {/* <input
                                        type="date"
                                        value={installationStartDate}
                                        onChange={(e) => setInstallationStartDate(e.target.value)}
                                        className='w-full h-[40px] text-gray-600 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                                    /> */}
                                    <DatePickerInput
                                        value={installationStartDate}
                                        onChange={setInstallationStartDate}
                                        placeholderText="เลือกวันที่เริ่มต้น"
                                        maxDate={installationEndDate || null}
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-gray-600 mb-3'>วันที่สิ้นสุด <span className='text-yellow-600 text-sm'>( ต้องระบุวันเริ่มต้นก่อน )</span></label>
                                    {/* <input
                                        type="date"
                                        value={installationEndDate}
                                        onChange={(e) => setInstallationEndDate(e.target.value)}
                                        className='w-full h-[40px] text-gray-600 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                                    /> */}
                                    <DatePickerInput
                                        value={installationEndDate}
                                        onChange={setInstallationEndDate}
                                        placeholderText="เลือกวันที่สิ้นสุด"
                                        minDate={installationStartDate || null}
                                        disabled={!installationStartDate}
                                        containerClassName={`flex items-center justify-between border border-[#D1D5DB] group rounded-[5px] py-2.5 px-4 duration-300 focus-within:border-[#1BC688] focus-within:ring-1 focus-within:ring-[#1BC688] ${!installationStartDate ? 'bg-gray-100' : 'bg-white'}`}
                                    />
                                </div>
                            </div>


                        </div>

                        <div className='flex justify-end'>
                            <button
                                onClick={handleDownloadInstallationRequests}
                                className='flex justify-center items-center gap-x-2 cursor-pointer rounded-[5px] w-fit px-4 py-2 hover:scale-105 bg-purple-600 text-white duration-200 hover:bg-purple-700 '
                            >
                                <PiDownloadSimple size={20} />
                                <span className='text-sm'>ดาวน์โหลด</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Equipment Export Section */}
                <div className='bg-white rounded-md shadow-md p-6 h-[435px]'>
                    <div className='flex justify-between flex-col h-full'>
                        <div>
                            <div className='flex justify-between items-start'>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center'>
                                        <PiFileCsvLight size={24} className='text-orange-600' />
                                    </div>
                                    <div>
                                        <h3 className='text-[20px] font-bold text-[#4E5155]'>รายการครุภัณฑ์</h3>
                                        <p className='text-[14px] text-[#868686]'>ส่งออกข้อมูลครุภัณฑ์ในระบบ</p>
                                    </div>
                                </div>
                                <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                            </div>
                            <div className='grid grid-cols-1 gap-4 mb-4'>
                                <div>
                                    <label className='block text-sm text-gray-600 mb-3'>สถานะ</label>
                                    <Select
                                        styles={{
                                            menu: (base) => ({
                                                ...base,
                                                zIndex: 9999
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                width: '100%',
                                                minHeight: '40px',
                                                height: '40px',
                                                borderRadius: '5px',
                                                borderColor: state.isFocused ? '#1BC688' : '#D1D5DB',
                                                boxShadow: state.isFocused ? '0 0 0 1.5px #1BC688' : 'none',
                                                fontSize: '15px',
                                                color: '#4E5155',
                                                transition: 'border-color 0.2s',
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: '#868686',
                                            }),
                                        }}
                                        menuPosition="absolute"
                                        inputId="equipmentStatusFilter"
                                        name="equipmentStatusFilter"
                                        options={equipmentStatusOptions}
                                        value={equipmentStatus}
                                        onChange={setEquipmentStatus}
                                        placeholder="เลือกสถานะ..."
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm text-gray-600 mb-3'>หมวดหมู่</label>
                                    <Select
                                        styles={{
                                            menu: (base) => ({
                                                ...base,
                                                zIndex: 9999
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                width: '100%',
                                                minHeight: '40px',
                                                height: '40px',
                                                borderRadius: '5px',
                                                borderColor: state.isFocused ? '#1BC688' : '#D1D5DB',
                                                boxShadow: state.isFocused ? '0 0 0 1.5px #1BC688' : 'none',
                                                fontSize: '15px',
                                                color: '#4E5155',
                                                transition: 'border-color 0.2s',
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: '#868686',
                                            }),
                                        }}
                                        menuPosition="absolute"
                                        inputId="equipmentCategoryFilter"
                                        name="equipmentCategoryFilter"
                                        options={equipmentCategoryOptions}
                                        value={equipmentCategory}
                                        onChange={setEquipmentCategory}
                                        placeholder="เลือกหมวดหมู่..."
                                    />
                                </div>

                            </div>
                        </div>

                        <div className='flex justify-end'>
                            <button
                                onClick={handleDownloadEquipment}
                                className='flex justify-center items-center gap-x-2 cursor-pointer rounded-[5px] w-fit px-4 py-2 hover:scale-105 bg-orange-600 text-white duration-200 hover:bg-orange-700'
                            >
                                <PiDownloadSimple size={20} />
                                <span className='text-sm'>ดาวน์โหลด</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* User Export Section */}
                <div className='bg-white rounded-md shadow-md p-6 h-[435px]'>
                    <div className='flex flex-col justify-between h-full'>
                        <div>
                            <div className='flex justify-between items-start'>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                                        <PiFileCsvLight size={24} className='text-blue-600' />
                                    </div>
                                    <div>
                                        <h3 className='text-[20px] font-bold text-[#4E5155]'>รายชื่อผู้ใช้ระบบ</h3>
                                        <p className='text-[14px] text-[#868686]'>ส่งออกข้อมูลผู้ใช้งานในระบบ</p>
                                    </div>
                                </div>
                                <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                            </div>
                            <div className=''>
                                <label className='block text-sm text-gray-600 mb-3'>เลือกประเภทผู้ใช้</label>
                                <Select
                                    inputId="userType"
                                    name="userType"
                                    options={userTypeOptions}
                                    value={selectedUserType}
                                    onChange={setSelectedUserType}
                                    placeholder="เลือกประเภทผู้ใช้..."

                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                                        control: (base, state) => ({
                                            ...base,
                                            width: '100%',
                                            minHeight: '40px',
                                            height: '40px',
                                            borderRadius: '5px',
                                            borderColor: state.isFocused ? '#1BC688' : '#D1D5DB',
                                            boxShadow: state.isFocused ? '0 0 0 1.5px #1BC688' : 'none',
                                            fontSize: '15px',
                                            color: '#4E5155',
                                            transition: 'border-color 0.2s',
                                            zIndex: 1, // รวม zIndex ไว้ใน control เดียว
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: '#868686',
                                        }),
                                    }}
                                />
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <button
                                onClick={handleDownloadUsers}
                                className='flex justify-center items-center gap-x-2 cursor-pointer rounded-[5px] w-fit px-4 py-2 hover:scale-105 bg-blue-600 text-white duration-200 hover:bg-blue-700'
                            >
                                <PiDownloadSimple size={20} />
                                <span className='text-sm'>ดาวน์โหลด</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Info Section */}
            <div className='bg-blue-50 border border-blue-200 rounded-[10px] p-6 mt-8'>
                <div className='flex items-start gap-4'>
                    <AiFillInfoCircle className='text-blue-600 mt-1' size={24} />
                    <div>
                        <h4 className='text-[18px] font-semibold text-blue-800 mb-2'>หมายเหตุ</h4>
                        <ul className='text-[14px] text-blue-700 space-y-1'>
                            <li><span className='mr-2'>•</span> ไฟล์ที่ดาวน์โหลดจะอยู่ในรูปแบบ CSV</li>
                            <li><span className='mr-2'>•</span> สามารถเปิดด้วยโปรแกรม Excel หรือ Google Sheets</li>
                            <li><span className='mr-2'>•</span> หากไม่เลือกช่วงวันที่ ระบบจะส่งออกข้อมูลทั้งหมด</li>
                            <li><span className='mr-2'>•</span> การกรองตามสถานะจะช่วยให้ได้ข้อมูลที่ต้องการเฉพาะเจาะจง</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}