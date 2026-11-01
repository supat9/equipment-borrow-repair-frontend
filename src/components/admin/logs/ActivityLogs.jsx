'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'; // เพิ่ม import axios
import Select from 'react-select';
import { IoSearchOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { DataLoading } from '@/components/users/loading/LoadingOverlay';
import Swal from 'sweetalert2';
import { FaLayerGroup } from "react-icons/fa";
import Pagination from "@/components/staff/pagination/Pagination";
import dayjs from 'dayjs';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { BsArrowRight, BsBoxSeam } from "react-icons/bs";
import DateTimePicker from '@/components/inputs/DateTimePicker';
import { MdAssignment } from "react-icons/md";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { BsBoxSeamFill } from "react-icons/bs";
import { IoCheckmarkDone } from "react-icons/io5";
import { PiNewspaper, PiScanLight } from 'react-icons/pi';
import { IoRefresh } from "react-icons/io5";


export function LogDetailsModal({ log, onClose }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    const fmt = (time) => dayjs(time).format('DD/MM/YYYY HH:mm');
    const typeActions = {
        'borrow': () => (
            <div className="">
                <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <PiNewspaper size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลการยืม</h2>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสคำขอ</label>
                            <p className='text-slate-700 text-base'>{log?.borrow_code || 'ไม่มีรหัสคำขอ'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">วันที่ดำเนินการ</label>
                            <p className='text-slate-700 text-base'>{log?.created_at ? fmt(log?.created_at) : 'ยังไม่ระบุวันที่ดำเนินการ'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสประจำตัว</label>
                            <p className='text-slate-700 text-base'>{log?.user_identifier || 'ยังไม่ระบุรหัสประจำตัว'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">ชื่อผู้ยืม</label>
                            <p className='text-slate-700 text-base'>{log?.user_name || 'ยังไม่ระบุชื่อผู้ยืม'}</p>
                        </div>
                    </div>
                </div>
                <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <LiaExchangeAltSolid size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลสถานะ</h2>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">สถานะ</label>
                            <p className='text-slate-700 text-base'>{log?.action_type || 'ยังไม่ระบุการกระทำ'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">สถานะเก่า</label>
                            <p className='text-slate-700 text-base'>{log?.old_status || 'ยังไม่ระบุสถานะเก่า'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">สถานะใหม่</label>
                            <p className='text-slate-700 text-base'>{log?.new_status || 'ยังไม่ระบุสถานะใหม่'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">หมายเหตุ</label>
                            <p className='text-slate-700 text-base'>{log?.notes || 'ยังไม่ระบุหมายเหตุ'}</p>
                        </div>
                    </div>
                </div>
                <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <IoIosInformationCircleOutline size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลอ้างอิง</h2>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสบันทึกกิจกรรม</label>
                            <p className='text-slate-700 text-base'>{log?.log_id || 'ไม่มีรหัสบันทึกกิจกรรม'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">หมวดหมู่</label>
                            <p className='text-slate-700 text-base'>{log?.log_type || 'ยังไม่ระบุหมวดหมู่'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสคำขอยืมภายใน</label>
                            <p className='text-slate-700 text-base'>{log?.borrow_id || 'ยังไม่ระบุรหัสคำขอยืม'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสผู้ยืม</label>
                            <p className='text-slate-700 text-base'>{log?.borrower_id || 'ยังไม่ระบุรหัสผู้ยืม'}</p>
                        </div>
                    </div>
                </div>
            </div>
        ),
        'equipment': () => (
            <div>
                <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <BsBoxSeam size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลครุภัณฑ์</h2>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสครุภัณฑ์</label>
                            <p className='text-slate-700 text-base'>{log?.equipment_code || 'ไม่มีรหัสครุภัณฑ์'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">ชื่อครุภัณฑ์</label>
                            <p className='text-slate-700 text-base'>{log?.equipment_name || 'ยังไม่ระบุชื่อครุภัณฑ์'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">ชื่อเจ้าหน้าที่</label>
                            <p className='text-slate-700 text-base'>{log?.user_name || 'ยังไม่ระบุเจ้าหน้าที่'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">วันที่ดำเนินการ</label>
                            <p className='text-slate-700 text-base'>{log?.created_at ? fmt(log?.created_at) : 'ยังไม่ระบุวันที่ดำเนินการ'}</p>
                        </div>
                    </div>
                </div>
                <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <LiaExchangeAltSolid size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลสถานะ</h2>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">สถานะ</label>
                            <p className='text-slate-700 text-base'>{log?.action_type || 'ยังไม่ระบุการกระทำ'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">สถานะเก่า</label>
                            <p className='text-slate-700 text-base'>{log?.old_status || 'ยังไม่ระบุสถานะเก่า'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">สถานะใหม่</label>
                            <p className='text-slate-700 text-base'>{log?.new_status || 'ยังไม่ระบุสถานะใหม่'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">หมายเหตุ</label>
                            <p className='text-slate-700 text-base'>{log?.notes || 'ยังไม่ระบุหมายเหตุ'}</p>
                        </div>
                    </div>
                </div>
                <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <IoIosInformationCircleOutline size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลอ้างอิง</h2>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสบันทึกกิจกรรม</label>
                            <p className='text-slate-700 text-base'>{log?.log_id || 'ไม่มีรหัสบันทึกกิจกรรม'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">หมวดหมู่</label>
                            <p className='text-slate-700 text-base'>{log?.log_type || 'ยังไม่ระบุหมวดหมู่'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสคำขอยืม</label>
                            <p className='text-slate-700 text-base'>{log?.borrow_id || 'ยังไม่ระบุรหัสคำขอยืม'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสครุภัณฑ์ภายใน</label>
                            <p className='text-slate-700 text-base'>{log?.equipment_id || 'ยังไม่ระบุรหัสครุภัณฑ์'}</p>
                        </div>
                    </div>
                </div>
            </div>
        ),
        'approval': () => (
            <div>
                <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <PiNewspaper size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลการอนุมัติ</h2>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสคำขอ</label>
                            <p className='text-slate-700 text-base'>{log?.borrow_code || 'ไม่มีรหัสคำขอ'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">วันที่ดำเนินการ</label>
                            <p className='text-slate-700 text-base'>{log?.created_at ? fmt(log?.created_at) : 'ยังไม่ระบุวันที่ดำเนินการ'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">ชื่อผู้ยืม</label>
                            <p className='text-slate-700 text-base'>{log?.borrower_name || 'ยังไม่ระบุชื่อผู้ยืม'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">ผู้อนุมัติ / ไม่อนุมัติ</label>
                            <p className='text-slate-700 text-base'>{log?.approver_name || 'ยังไม่ระบุเจ้าหน้าที่'}</p>
                        </div>
                    </div>
                </div>
                <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <IoCheckmarkDone size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลดำเนินการ</h2>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">สถานะ</label>
                            <p className='text-slate-700 text-base'>{log?.action_type || 'ยังไม่ระบุสถานะ'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">หมายเหตุ</label>
                            <p className='text-slate-700 text-base'>{log?.notes || 'ยังไม่ระบุหมายเหตุ'}</p>
                        </div>
                    </div>
                </div>
                <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <IoIosInformationCircleOutline size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลอ้างอิง</h2>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสบันทึกกิจกรรม</label>
                            <p className='text-slate-700 text-base'>{log?.log_id || 'ไม่มีรหัสบันทึกกิจกรรม'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">หมวดหมู่</label>
                            <p className='text-slate-700 text-base'>{log?.log_type || 'ยังไม่ระบุหมวดหมู่'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสคำขอภายใน</label>
                            <p className='text-slate-700 text-base'>{log?.borrow_id || 'ยังไม่ระบุรหัสคำขอ'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสผู้ยืม</label>
                            <p className='text-slate-700 text-base'>{log?.borrower_id || 'ยังไม่ระบุรหัสผู้ยืม'}</p>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <label className='text-gray-500 text-sm' htmlFor="">รหัสเจ้าหน้าที่</label>
                            <p className='text-slate-700 text-base'>{log?.approver_id || 'ยังไม่ระบุรหัสเจ้าหน้าที่'}</p>
                        </div>
                    </div>
                </div>
            </div>
        ),
        'default': () => (
            <div>
                <p>ไม่พบข้อมูล</p>
            </div>
        )
    }

    const renderTypeContent = () => {
        const renderer = typeActions[log.log_type] || typeActions['default'];
        return renderer();
    }

    return (
        <div id="log-details-modal">
            <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[600px] max-w-[800px] w-full bg-white rounded-[5px] pt-6 shadow-xl relative">
                    <div className="flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-6 mb-6">
                        <div className="flex items-center gap-x-2">
                            <h2 className="text-[18px] font-bold text-[#4E5155]">
                                รายละเอียดกิจกรรม
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]"
                        >
                            <RxCross2 size={20} color="#454545" />
                        </button>
                    </div>
                    <div className="px-6 max-h-[70vh] overflow-y-auto">
                        {log?.log_type && <>
                            {renderTypeContent()}
                        </>}
                        <div className='mb-6 flex justify-end'>
                            <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export function ActivityLogs() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [logsList, setLogsList] = useState([]);

    const [logDetailsModal, setLogDetailsModal] = useState(null);

    // type มี all, borrow, equipment, approval
    const typesList = [
        { value: 'all', label: 'หมวดหมู่ทั้งหมด' },
        { value: 'borrow', label: 'คำขอยืม' },
        { value: 'equipment', label: 'ครุภัณฑ์' },
        { value: 'approval', label: 'อนุมัติแล้ว' },
    ];
    const [selectedType, setSelectedType] = useState(typesList[0]);
    const [start_date, setStartDate] = useState(null);
    const [end_date, setEndDate] = useState(null);
    const [borrow_id, setBorrowId] = useState('');
    const [equipment_id, setEquipmentId] = useState('');

    const [searchBorrowId, setSearchBorrowId] = useState('');
    const [searchEquipmentId, setSearchEquipmentId] = useState('');

    const [loading, setLoading] = useState(true);
    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/logs', {
                params: {
                    page,
                    limit: itemsPerPage,
                    type: selectedType.value || '',
                    start_date,
                    end_date,
                    borrow_id: borrow_id.trim(),
                    equipment_id: equipment_id.trim(),
                }
            });
            setLogsList(response.data.data);
            // setCurrentPage(response.data.pagination?.current_page || 1);
            setTotalPages(response.data.pagination?.total_pages || 1);
            setTotalItems(response.data.pagination?.total_items || 0);
            setItemsPerPage(response.data.pagination?.items_per_page || 10);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLogs(currentPage);
    }, [currentPage, start_date, end_date, borrow_id, equipment_id, selectedType]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setBorrowId(searchBorrowId);
            setEquipmentId(searchEquipmentId);
            setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
        }, 500); // 500ms หลังหยุดพิมพ์

        return () => clearTimeout(handler);
    }, [searchBorrowId, searchEquipmentId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, start_date, end_date]);


    const handleClear = async () => {
        try {
            setSearchBorrowId('');
            setSearchEquipmentId('');
            setSelectedType(typesList[0]);
            setStartDate(null);
            setEndDate(null);
            setBorrowId('');
            setEquipmentId('');
            setCurrentPage(1);
            // await fetchEquipments(1); // รีเฟรชข้อมูลที่หน้า 1
        } catch (error) {
            console.error("Clear search errors:", error);
        }
    };

    // UXUI - show detail log
    const typeMap = {
        'borrow': 'คำขอยืม',
        'equipment': 'ครุภัณฑ์',
        'approval': 'อนุมัติแล้ว',
    }

    const actionStatusMaps = {
        approval: {
            approved: {
                label: 'อนุมัติแล้ว',
                bg: 'bg-green-50 border border-green-200',
                dot: 'bg-green-500',
                text: 'text-green-700',
            },
            rejected: {
                label: 'ไม่อนุมัติ',
                bg: 'bg-red-50 border border-red-200',
                dot: 'bg-red-500',
                text: 'text-red-700',
            },
            pending_review: {
                label: 'รออนุมัติ',
                bg: 'bg-yellow-50 border border-yellow-200',
                dot: 'bg-yellow-500',
                text: 'text-yellow-700',
            },
        },
        borrow: {
            requested: {
                label: 'รออนุมัติ',
                bg: 'bg-yellow-50 border border-yellow-200',
                dot: 'bg-yellow-500',
                text: 'text-yellow-700',
            },
            approved: {
                label: 'อนุมัติแล้ว',
                bg: 'bg-green-50 border border-green-200',
                dot: 'bg-green-500',
                text: 'text-green-700',
            },
            rejected: {
                label: 'ไม่อนุมัติ',
                bg: 'bg-red-50 border border-red-200',
                dot: 'bg-red-500',
                text: 'text-red-700',
            },
            borrowed: {
                label: 'กำลังยืม',
                bg: 'bg-blue-50 border border-blue-200',
                dot: 'bg-blue-500',
                text: 'text-blue-700',
            },
            returned: {
                label: 'คืนแล้ว',
                bg: 'bg-green-50 border border-green-200',
                dot: 'bg-green-500',
                text: 'text-green-700',
            },
            overdue: {
                label: 'เกินกำหนด',
                bg: 'bg-red-50 border border-red-200',
                dot: 'bg-red-500',
                text: 'text-red-700',
            },
            cancelled: {
                label: 'ยกเลิก',
                bg: 'bg-gray-50 border border-gray-200',
                dot: 'bg-gray-500',
                text: 'text-gray-700',
            },
        },
        equipment: {
            borrowed: {
                label: 'กำลังยืม',
                bg: 'bg-blue-50 border border-blue-200',
                dot: 'bg-blue-500',
                text: 'text-blue-700',
            },
            returned: {
                label: 'คืนแล้ว',
                bg: 'bg-green-50 border border-green-200',
                dot: 'bg-green-500',
                text: 'text-green-700',
            },
            approved_for_borrow: {
                label: 'อนุมัติให้ยืม',
                bg: 'bg-green-50 border border-green-200',
                dot: 'bg-green-500',
                text: 'text-green-700',
            },
            rejected_for_borrow: {
                label: 'ไม่อนุมัติให้ยืม',
                bg: 'bg-red-50 border border-red-200',
                dot: 'bg-red-500',
                text: 'text-red-700',
            },
        }
    };

    const getStatusLabel = (log_type, action_type) =>
        actionStatusMaps[log_type]?.[action_type] || '-';

    const oldAndNewStatusMap = {
        equipment: {
            available: {
                label: 'ว่าง',
                bg: 'bg-green-50 border border-green-200',
                dot: 'bg-green-500',
                text: 'text-green-700',
            },
            borrowed: {
                label: 'กำลังยืม',
                bg: 'bg-blue-50 border border-blue-200',
                dot: 'bg-blue-500',
                text: 'text-blue-700',
            },
            repair: {
                label: 'ซ่อมบำรุง',
                bg: 'bg-yellow-50 border border-yellow-200',
                dot: 'bg-yellow-500',
                text: 'text-yellow-700',
            },
            retired: {
                label: 'ปลดระวาง',
                bg: 'bg-gray-50 border border-gray-200',
                dot: 'bg-gray-500',
                text: 'text-gray-700',
            },
            active: {
                label: 'กำลังใช้งาน',
                bg: 'bg-blue-50 border border-blue-200',
                dot: 'bg-blue-500',
                text: 'text-blue-700',
            },
            cancelled: {
                label: 'ยกเลิก',
                bg: 'bg-gray-50 border border-gray-200',
                dot: 'bg-gray-500',
                text: 'text-gray-700',
            },
            selled: {
                label: 'จำหน่ายแล้ว',
                bg: 'bg-purple-50 border border-purple-200',
                dot: 'bg-purple-500',
                text: 'text-purple-700',
            },
            test: {
                label: 'ทดสอบ',
                bg: 'bg-orange-50 border border-orange-200',
                dot: 'bg-orange-500',
                text: 'text-orange-700',
            },
            reserved: {
                label: 'จองแล้ว',
                bg: 'bg-orange-50 border border-orange-200',
                dot: 'bg-orange-500',
                text: 'text-orange-700',
            }
        },
        borrow: {
            pending_approval: {
                label: 'รออนุมัติ',
                bg: 'bg-yellow-50 border border-yellow-200',
                dot: 'bg-yellow-500',
                text: 'text-yellow-700',
            },
            approved: {
                label: 'อนุมัติแล้ว',
                bg: 'bg-green-50 border border-green-200',
                dot: 'bg-green-500',
                text: 'text-green-700',
            },
            rejected: {
                label: 'ไม่อนุมัติ',
                bg: 'bg-red-50 border border-red-200',
                dot: 'bg-red-500',
                text: 'text-red-700',
            },
            active: {
                label: 'กำลังยืม',
                bg: 'bg-blue-50 border border-blue-200',
                dot: 'bg-blue-500',
                text: 'text-blue-700',
            },
            returned: {
                label: 'คืนแล้ว',
                bg: 'bg-green-50 border border-green-200',
                dot: 'bg-green-500',
                text: 'text-green-700',
            },
            overdue: {
                label: 'เกินกำหนด',
                bg: 'bg-red-50 border border-red-200',
                dot: 'bg-red-500',
                text: 'text-red-700',
            },
            cancelled: {
                label: 'ยกเลิก',
                bg: 'bg-gray-50 border border-gray-200',
                dot: 'bg-gray-500',
                text: 'text-gray-700',
            },
        },
    };

    const getOldAndNewStatusLabel = (log_type, status) =>
        oldAndNewStatusMap[log_type]?.[status] || '-';

    return (
        <div id="admin-logs">
            <div className='mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการทั้งหมด</h2>
            </div>
            <div>
                <form className="mb-6" action="">
                    <div>
                        <div className='flex gap-x-4 items-center'>
                            <div className='flex flex-col gap-y-2 mb-4'>
                                <label className='text-gray-600' htmlFor="">วันเริ่มต้น</label>
                                <DateTimePicker
                                    value={start_date}
                                    onChange={setStartDate}
                                    placeholderText="เลือกวันและเวลา"
                                />
                            </div>
                            <div className='flex flex-col gap-y-2 mb-4'>
                                <label className='text-gray-600' htmlFor="">วันสิ้นสุด <span className='text-yellow-600 text-sm'>( ต้องระบุวันเริ่มต้นก่อน )</span></label>
                                <DateTimePicker
                                    value={end_date}
                                    onChange={setEndDate}
                                    placeholderText="เลือกวันและเวลา"
                                    disabled={!start_date}
                                    // กันวันก่อนหน้าไม่ได้
                                    minDate={start_date || undefined}
                                    // กันเวลาให้ไม่ต่ำกว่า startDate เมื่อเป็นวันเดียวกัน
                                    minDateTime={start_date || undefined}
                                />
                            </div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className="flex items-center gap-x-4">
                                <div className="flex items-center w-[249px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none">
                                    <IoSearchOutline size={20} color="#4E5155" />
                                    <input
                                        value={searchBorrowId}
                                        onChange={(e) => setSearchBorrowId(e.target.value)}
                                        className="w-full text-[#4E5155] duration-300 focus:outline-none"
                                        type="text"
                                        placeholder="รหัสคำขอยืม"
                                    />
                                </div>
                                <div className="flex items-center w-[249px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none">
                                    <PiScanLight size={20} color="#4E5155" />
                                    <input
                                        value={searchEquipmentId}
                                        onChange={(e) => setSearchEquipmentId(e.target.value)}
                                        className="w-full text-[#4E5155] duration-300 focus:outline-none"
                                        type="text"
                                        placeholder="รหัสครุภัณฑ์"
                                    />
                                </div>
                                <Select
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            width: "250px",
                                            minHeight: "40px",
                                            height: "40px",
                                            borderRadius: "5px",
                                            borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                                            boxShadow: state.isFocused
                                                ? "0 0 0 1.5px #1BC688"
                                                : "none",
                                            fontSize: "15px",
                                            color: "#4E5155",
                                            transition: "border-color 0.2s",
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: "#868686",
                                        }),
                                    }}
                                    options={typesList}
                                    value={selectedType}
                                    onChange={setSelectedType}
                                    placeholder="เลือกหมวดหมู่"
                                />
                            </div>
                            <div className="flex items-center gap-x-4">
                                <button
                                    onClick={handleClear}
                                    type="button"
                                    className="flex items-center justify-center gap-x-2 h-[40px] text-[14px] px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-[5px] font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                                >
                                    <span><IoRefresh size={20} className='text-gray-500' /></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <div>
                    {loading ? (
                        <DataLoading />
                    ) : logsList.length === 0 ? (
                        <div className="h-[180px] flex flex-col justify-center items-center tracking-[.5px]">
                            <div className="mb-3">
                                <FaLayerGroup size={48} className="mx-auto text-[#E5E7EB]" />
                            </div>
                            <p className="text-[16px] text-[#6B7280] mb-2">
                                ยังไม่มีข้อมูลใดในระบบขณะนี้
                            </p>
                            <p className="text-[14px] text-[#9CA3AF]">
                                ลองเปลี่ยนเงื่อนไขการค้นหา หรือรีเฟรชหน้าจออีกครั้ง
                            </p>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full tracking-[.5px] text-left border-collapse">
                                <thead className="bg-slate-50 border border-gray-300">
                                    <tr className="text-md text-gray-700">
                                        <th className="font-light px-4 py-3">
                                            <span className="cursor-pointer inline-flex items-center gap-x-2">
                                                รหัสคำขอยืม
                                            </span>
                                        </th>
                                        <th className="font-light px-4 py-3">
                                            <span className="cursor-pointer inline-flex items-center gap-x-2">
                                                รหัสครุภัณฑ์
                                            </span>
                                        </th>
                                        <th className="font-light px-4 py-3">
                                            <span className="cursor-pointer inline-flex items-center gap-x-2">
                                                หมวดหมู่
                                            </span>
                                        </th>
                                        <th className="font-light px-4 py-3">
                                            <span className="cursor-pointer inline-flex items-center gap-x-2">
                                                สถานะ
                                            </span>
                                        </th>

                                        <th className="font-light px-4 py-3">
                                            <span className="cursor-pointer inline-flex items-center gap-x-2">
                                                การเปลี่ยนสถานะ
                                            </span>
                                        </th>
                                        <th className="font-light px-4 py-3">
                                            <span className="cursor-pointer inline-flex items-center gap-x-2">
                                                สร้างเมื่อ
                                            </span>
                                        </th>
                                        <th className="font-light px-4 py-3 rounded-r-[3px] text-center">
                                            รายละเอียด
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logsList.map((log, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <td className="p-4">{log.borrow_id || '-'}</td>
                                            <td className="p-4">{log.equipment_id || '-'}</td>
                                            <td className="p-4">{typeMap[log.log_type] || '-'}</td>
                                            <td className="p-4">
                                                {actionStatusMaps[log.log_type]?.[log.action_type] && (
                                                    <div
                                                        className={`inline-flex items-center w-[105px] gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${actionStatusMaps[log.log_type][log.action_type].bg
                                                            } ${actionStatusMaps[log.log_type][log.action_type].text}`}
                                                    >
                                                        <div
                                                            className={`size-2 rounded-full ${actionStatusMaps[log.log_type][log.action_type].dot
                                                                }`}
                                                        ></div>
                                                        <span className="text-xs font-medium tracking-wide">
                                                            {actionStatusMaps[log.log_type][log.action_type].label}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {log.old_status && log.new_status ? (
                                                    <div className="flex items-center gap-x-4">
                                                        {/* old_status */}
                                                        {oldAndNewStatusMap[log.log_type]?.[log.old_status] && (
                                                            <div
                                                                className={`inline-flex items-center w-[105px] gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${oldAndNewStatusMap[log.log_type][log.old_status].bg} ${oldAndNewStatusMap[log.log_type][log.old_status].text}`}
                                                            >
                                                                <div
                                                                    className={`size-2 rounded-full ${oldAndNewStatusMap[log.log_type][log.old_status].dot}`}
                                                                ></div>
                                                                <span className="text-xs font-medium tracking-wide">
                                                                    {oldAndNewStatusMap[log.log_type][log.old_status].label}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <span><BsArrowRight size={13} className='text-gray-500' /></span>
                                                        {/* new_status */}
                                                        {oldAndNewStatusMap[log.log_type]?.[log.new_status] && (
                                                            <div
                                                                className={`inline-flex items-center w-[105px] gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${oldAndNewStatusMap[log.log_type][log.new_status].bg} ${oldAndNewStatusMap[log.log_type][log.new_status].text}`}
                                                            >
                                                                <div
                                                                    className={`size-2 rounded-full ${oldAndNewStatusMap[log.log_type][log.new_status].dot}`}
                                                                ></div>
                                                                <span className="text-xs font-medium tracking-wide">
                                                                    {oldAndNewStatusMap[log.log_type][log.new_status].label}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </td>
                                            <td className="p-4">{dayjs(log.created_at).format("DD/MM/YYYY HH:mm")}</td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={() => setLogDetailsModal(log)}
                                                        className="cursor-pointer p-1 rounded-[3px] bg-[#F3F4F6] border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]"
                                                    >
                                                        <IoIosInformationCircleOutline className='text-gray-500' size={23} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {logsList.length > 0 && (
                                <div className="flex justify-between items-center mt-4">
                                    <div className="text-gray-600 space-x-1 text-sm">
                                        <span>แสดง</span>{" "}
                                        <span>{(currentPage - 1) * itemsPerPage + 1}</span>
                                        <span>ถึง</span>{" "}
                                        <span>
                                            {Math.min(currentPage * itemsPerPage, totalItems)}
                                        </span>
                                        <span>จาก</span> <span>{totalItems}</span>{" "}
                                        <span>รายการ</span>
                                    </div>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {logDetailsModal && <LogDetailsModal log={logDetailsModal} onClose={() => setLogDetailsModal(null)} />}
        </div>
    )
}
