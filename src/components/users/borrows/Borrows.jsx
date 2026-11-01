'use client';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { mockMyBorrow } from '@/mock/mockBorrow';
import { AiFillInfoCircle } from "react-icons/ai";
import { AiOutlineScan } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { MdAssignment } from "react-icons/md";
import dayjs from 'dayjs';
import axios, { all } from 'axios';
import Swal from 'sweetalert2';
import Spinner from '@/components/users/loading/Spinner.jsx';
import { FaLayerGroup } from "react-icons/fa6";
import { PiDevicesFill, PiNewspaper } from 'react-icons/pi';
import { LiaExchangeAltSolid } from 'react-icons/lia';
import { BsBoxSeam } from 'react-icons/bs';


/* Modal รายละเอียดคำขอ */
export function BorrowDetailsModal({ borrow, onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const fmt = (time) => dayjs(time).format('DD/MM/YYYY HH:mm');
    const statusColor = {
        'pending_approval': {
            bg: 'bg-[#FEF9C3]',
            border: '#FACC15',
            dot: 'bg-[#EAB308]',
            text: 'text-[#B45309]',
            label: 'รอดำเนินการ'
        },
        'approved': {
            bg: 'bg-[#D1FAE5]',
            border: '#34D399',
            dot: 'bg-[#10B981]',
            text: 'text-[#059669]',
            label: 'อนุมัติ'
        },
        'active': {
            bg: 'bg-[#DBEAFE]',
            border: '#60A5FA',
            dot: 'bg-[#3B82F6]',
            text: 'text-[#1D4ED8]',
            label: 'กำลังยืม'
        },
        'overdue': {
            bg: 'bg-[#FEE2E2]',
            border: '#F87171',
            dot: 'bg-[#EF4444]',
            text: 'text-[#DC2626]',
            label: 'เกินกำหนด'
        },
        'returned': {
            bg: 'bg-[#DCFCE7]',
            border: '#22C55E',
            dot: 'bg-[#16A34A]',
            text: 'text-[#15803D]',
            label: 'คืนแล้ว'
        },
        'rejected': {
            bg: 'bg-[#FEE2E2]',
            border: '#F87171',
            dot: 'bg-[#EF4444]',
            text: 'text-[#DC2626]',
            label: 'ไม่อนุมัติ'
        },
        'cancelled': {
            bg: 'bg-[#F3F4F6]',
            border: '#D1D5DB',
            dot: 'bg-[#9CA3AF]',
            text: 'text-[#6B7280]',
            label: 'ยกเลิก'
        },
    };
    return (
        <div id="user-borrow-details-modal">
            <div className="px-4 lg:px-0 fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[300px] max-w-[900px] w-full bg-white rounded-[5px] pt-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-6'>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                            <h2 className='text-base md:text-lg font-bold text-gray-600'>รายละเอียดคำขอ</h2>
                            {statusColor[borrow?.status] && (
                                <div className={`flex items-center gap-x-2 w-fit rounded-md px-4 py-1 ${statusColor[borrow.status].bg}`}>
                                    {/* border  border-[${statusColor[request.status].border}] */}
                                    <div className={`size-[7px] rounded-full ${statusColor[borrow?.status].dot}`}></div>
                                    <span className={`cursor-default ${statusColor[borrow?.status].text} text-[13px]`}>
                                        {statusColor[borrow?.status].label}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6 max-h-[60vh] md:max-h-[70vh] overflow-y-auto'>
                        <div className='space-y-6'>
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <PiNewspaper size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-base md:text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลการยืม</h2>
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">รหัสคำขอ</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.borrow_code || 'ไม่มีรหัสคำขอ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">วัตถุประสงค์</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.purpose || 'ไม่ระบุวัตถุประสงค์'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">วันที่ยืม</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.borrow_date ? fmt(borrow?.borrow_date) : 'ยังไม่ระบุวันที่ยืม'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">วันกำหนดคืน</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.expected_return_date ? fmt(borrow?.expected_return_date) : 'ยังไม่ระบุวันกำหนดคืน'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">วันที่คืนจริง</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.actual_return_date ? fmt(borrow?.actual_return_date) : 'ยังไม่ได้คืนครุภัณฑ์'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">{borrow?.status === 'rejected' ? 'ไม่อนุมัติโดย' : 'ผู้อนุมัติ'}</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.approver_name ? borrow.approver_name : 'ยังไม่ได้อนุมัติ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">{borrow?.status === 'rejected' ? 'ไม่อนุมัติเมื่อ' : 'อนุมัติเมื่อ'}</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.approved_at ? fmt(borrow?.approved_at) : 'ยังไม่ได้อนุมัติ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">
                                            {borrow?.status === 'rejected' ? 'เหตุผลที่ไม่อนุมัติ' : borrow?.status === 'cancelled' ? 'เหตุผลที่ยกเลิก' : 'หมายเหตุการอนุมัติ'}
                                        </label>
                                        <p className='text-slate-700 text-sm md:text-base'>
                                            {['rejected', 'cancelled'].includes(borrow?.status)
                                                ? (borrow?.rejection_reason || 'ยังไม่ได้ระบุ')
                                                : (borrow?.note || 'ยังไม่ได้ระบุ')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <BsBoxSeam size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-base md:text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลอุปกรณ์</h2>

                                    </div>
                                </div>
                                {borrow?.borrowed_items.length > 0 && borrow?.borrowed_items.map(item => (
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4' key={item.item_id}>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">ชื่ออุปกรณ์</label>
                                            <p className='text-slate-700 text-sm md:text-base'>{item.equipment_name || 'ไม่มีชื่ออุปกรณ์'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">รหัสอุปกรณ์</label>
                                            <p className='text-slate-700 text-sm md:text-base'>{item.equipment_code || 'ไม่มีรหัสอุปกรณ์'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">แบรนด์</label>
                                            <p className='text-slate-700 text-sm md:text-base'>{item.brand || 'ไม่ระบุแบรนด์'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">รุ่น</label>
                                            <p className='text-slate-700 text-sm md:text-base'>{item.model || 'ไม่ระบุรุ่น'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">หมายเลขซีเรียล</label>
                                            <p className='text-slate-700 text-sm md:text-base'>{item.serial_number || 'ไม่มีหมายเลขซีเรียล'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">จำนวน</label>
                                            <p className='text-slate-700 text-sm md:text-base'>{item.quantity ? `${item.quantity} รายการ` : 'ไม่ระบุจำนวน'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">สภาพก่อนยืม</label>
                                            <p className='text-slate-700 text-sm md:text-base'>{item.condition_before || 'ไม่ระบุสภาพก่อนยืม'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">บันทึกเพิ่มเติม</label>
                                            <p className='text-slate-700 text-sm md:text-base'>{item.notes || 'ไม่มีบันทึกเพิ่มเติม'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <LiaExchangeAltSolid size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-base md:text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลการคืน</h2>

                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">สภาพการคืน</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.return_condition || 'ไม่ระบุสภาพการคืน'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">เหตุผลคืนล่าช้า</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.late_return_reason || 'ไม่มีเหตุผลคืนล่าช้า'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">ค่าปรับ</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.penalty_amount !== undefined && borrow?.penalty_amount !== null && borrow?.penalty_amount !== '' ? borrow?.penalty_amount : 'ไม่มีค่าปรับ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">สถานะการชำระค่าปรับ</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.penalty_paid !== undefined && borrow?.penalty_paid !== null && borrow?.penalty_paid !== '' ? borrow?.penalty_paid : 'ยังไม่ชำระค่าปรับ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">ผู้รับคืน</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.returned_to_admin ? borrow.returned_to_admin : 'ยังไม่ได้รับคืน'}</p>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <PiNewspaper size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-base md:text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลอื่นๆ</h2>

                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-xs sm:text-sm' htmlFor="">เหตุผลที่ไม่อนุมัติ / เหตุผลที่ยกเลิก</label>
                                        <p className='text-slate-700 text-sm md:text-base'>{borrow?.rejection_reason || 'ไม่มีเหตุผลที่ไม่อนุมัติ'}</p>
                                    </div>

                                </div>
                            </div> */}
                            <div className='mb-6 flex justify-end'>
                                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* Modal ยกเลิกคำขอ */
export function CancelledBorrowModal({ borrow, refresh, onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const showSubmitAlert = () => {
        return Swal.fire({
            title: 'ยืนยันการยกเลิก?',
            text: 'การดำเนินการนี้ไม่สามารถย้อนกลับได้',
            icon: 'warning',
            confirmButtonText: 'ยืนยัน',
            confirmButtonColor: '#d9534f',
            showCancelButton: true,
            cancelButtonColor: '#6B7280',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                container: 'z-[10000]'
            }
        });
    };
    const showSuccessAlert = () => {
        return Swal.fire({
            title: 'สำเร็จ!',
            text: 'ยกเลิกรายการคำขอครุภัณฑ์เรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#1BC688',
            customClass: {
                container: 'z-[10000]'
            }
        });
    };
    const showErrorAlert = () => {
        return Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: 'ไม่สามารถยกเลิกได้ กรุณาลองใหม่อีกครั้ง',
            icon: 'error',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#d33',
            customClass: {
                container: 'z-[10000]'
            }
        });
    };
    const showWarningAlert = () => {
        return Swal.fire({
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            text: 'กรุณากรอกเหตุผลที่ต้องการยกเลิก',
            icon: 'warning',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#FFC107',
            customClass: {
                container: 'z-[10000]',
            }
        });
    }
    const [cancelledReason, setCancelledReason] = useState('');
    const showAlertByStatus = async (status, message) => {
        let icon = "error";
        let color = "#d33";
        let text = message || "เกิดข้อผิดพลาด";

        if (status === 400) {
            icon = "warning";
            color = "#FFC107"; // yellow
            text = message || "กรุณากรอกข้อมูลให้ครบถ้วน";
        } else if (status === 404) {
            icon = "info";
            color = "#2196F3"; // blue
            text = message || "ไม่พบข้อมูลที่ต้องการ";
        } else if (status === 500) {
            icon = "error";
            color = "#d33"; // red
            text = message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
        }

        await Swal.fire({
            title: "ไม่สามารถส่งคำขอยืมได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const [submitLoading, setSubmitLoading] = useState(false);
    const handleSubmit = async (e) => {
        setSubmitLoading(true);
        try {
            e.preventDefault();
            const id = borrow.id;
            // if (!cancelledReason) return await showWarningAlert();
            if (cancelledReason) {
                const confirmed = await showSubmitAlert();
                if (!confirmed.isConfirmed) return;
            }
            const rejection_reason = cancelledReason.trim();
            const response = await axios.post('/api/users/borrow/cancelled', { id, rejection_reason });
            const result = response.data;
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result.message || 'ยกเลิกรายการคำขอครุภัณฑ์เรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1BC688',
                customClass: {
                    container: 'z-[10000]'
                }
            });
            onClose();
            refresh();
        } catch (error) {
            console.error("Cancelled borrow error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="user-cancelled-requests-modal">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[300px] max-w-[600px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-gray-600'>ข้อมูลการยกเลิกคำขอยืม</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <div className='text-gray-600 border-b border-[#E0E0E0] pb-4 mb-4'>
                            <h2 className='flex flex-col gap-2 sm:flex-row text-xs sm:text-base'>รหัสคำขอ  <span className='font-semibold text-red-400 tracking-[1px]'>{borrow.borrow_code}</span></h2>
                        </div>
                        <form onSubmit={handleSubmit} action="">
                            <div className='flex flex-col gap-y-3 mb-6'>
                                <label className='text-gray-600 text-sm md:text-base ' htmlFor="cancelled">เหตุผลที่ยกเลิก</label>
                                <div className='flex items-center gap-x-2'>
                                    <textarea onChange={(e) => setCancelledReason(e.target.value)} value={cancelledReason} id='cancelled' className='text-sm md:text-base text-gray-600 w-full border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-[#1BC688]' type="text" placeholder='ไม่ต้องการใช้อุปกรณ์แล้ว' />
                                </div>
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button type='button' onClick={onClose} className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 text-[15px] bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ยกเลิก</button>
                                <button type='submit' className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 bg-[#d9534f] text-[15px] text-white font-medium duration-200 hover:bg-[#DC2626] '>ยืนยัน</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {submitLoading && (
                <div className='fixed inset-0 z-50 bg-[rgba(0,0,0,0.1)] flex justify-center items-center'>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <Spinner />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                    </div>
                </div>
            )}
        </div>
    )
}

/* 1. รออนุมัติ */
export function MyBorrowsRequest() {
    const [pendingBorrowList, setPendingBorrowList] = useState([]);
    const [cancelledBorrowModal, setCancelledBorrowModal] = useState(null);
    const [borrowDetailsModal, setBorrowDetailsModal] = useState(null);

    const [loading, setLoading] = useState(true);
    const fetchPendingBorrows = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/borrow/pending');
            setPendingBorrowList(response.data);
        } catch (error) {
            console.error("Error fetching pending borrows:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchPendingBorrows()
    }, [fetchPendingBorrows]);
    return (
        <div id="MyBorrowsRequest">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่รออนุมัติ</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> สามารถยกเลิกคำขอได้หากเจ้าหน้าที่ยังไม่อนุมัติ</p>
                </div>
            </div>
            <div>
                <div>
                    {loading ? <div className='h-[180px] flex justify-center items-center'>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <Spinner />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                        </div>
                    </div> : pendingBorrowList.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                        <div className='mb-3'>
                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                        </div>
                        <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                        <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                    </div> : <>
                        {pendingBorrowList.map(borrow => (
                            <div key={borrow.id} className='border-l-7 border-l-[#FACC15] border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6'>
                                {/* Desktop Layout */}
                                <div className='hidden sm:flex justify-between'>
                                    <div>
                                        <div className='flex justify-between items-center mb-2'>
                                            <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                        </div>
                                        <div className='space-y-2'>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span> 1 รายการ</p> */}
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-between items-end'>
                                        <div className='bg-[#FEF9C3] flex items-center gap-x-2 w-fit rounded-md px-4 py-1'>
                                            <div className='size-[7px] rounded-[50%] bg-[#EAB308]'></div>
                                            <span className='cursor-default text-[#B45309] text-[13px]'>{borrow.status && 'รอดำเนินการ'}</span>
                                        </div>
                                        <div className='flex items-center gap-x-3'>
                                            <button
                                                onClick={() => setBorrowDetailsModal(borrow)}
                                                className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                title="ดูรายละเอียด"
                                            >
                                                <PiNewspaper size={20} />
                                            </button>
                                            <button
                                                onClick={() => setCancelledBorrowModal(borrow)}
                                                className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#d9534f] text-white transition-all duration-200 hover:bg-[#DC2626] hover:scale-105 shadow-md'
                                                title="ยกเลิก"
                                            >
                                                <RxCross2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Layout */}
                                <div className='sm:hidden'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                    </div>
                                    <div className='flex justify-between gap-2'>
                                        <div className='space-y-3'>
                                            <div className='flex items-center gap-x-2'>
                                                {/* <span className='text-xs sm:text-base text-gray-500'>สถานะ</span> */}
                                                <div className='bg-[#FEF9C3] flex items-center gap-x-2 w-fit rounded-2xl px-2 py-1'>
                                                    <div className='size-[7px] rounded-[50%] bg-[#EAB308]'></div>
                                                    <span className='line-clamp-1 cursor-default text-[#B45309] text-xs sm:text-sm'>{borrow.status && 'รอดำเนินการ'}</span>
                                                </div>
                                            </div>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='text-xs sm:text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span> 1 รายการ</p> */}
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                        </div>
                                        <div className='flex flex-col justify-end'>
                                            <div className='flex items-center gap-x-3'>
                                                <button
                                                    onClick={() => setBorrowDetailsModal(borrow)}
                                                    className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                    title="ดูรายละเอียด"
                                                >
                                                    <PiNewspaper size={20} />
                                                </button>
                                                <button
                                                    onClick={() => setCancelledBorrowModal(borrow)}
                                                    className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-md bg-[#d9534f] text-white transition-all duration-200 hover:bg-[#DC2626] hover:scale-105 shadow-md'
                                                    title="ยกเลิก"
                                                >
                                                    <RxCross2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}</>}
                </div>
            </div>
            {cancelledBorrowModal && (
                <CancelledBorrowModal
                    borrow={cancelledBorrowModal}
                    refresh={fetchPendingBorrows}
                    onClose={() => setCancelledBorrowModal(null)}
                />
            )}
            {borrowDetailsModal && (
                <BorrowDetailsModal borrow={borrowDetailsModal} onClose={() => setBorrowDetailsModal(null)} />
            )}
        </div>
    )
}

/* 2. อนุมัติแล้ว */
export function MyBorrowsApproved() {
    const [approvedBorrowList, setApprovedBorrowList] = useState([]);
    const [borrowDetailsModal, setBorrowDetailsModal] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchApprovedBorrows = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/borrow/approved');
            setApprovedBorrowList(response.data);
        } catch (error) {
            console.error("Error fetching approved borrows:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchApprovedBorrows()
    }, [fetchApprovedBorrows]);
    return (
        <div id="MyBorrowsApproved">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่อนุมัติแล้ว</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> กรุณาติดต่อรับครุภัณฑ์ภายใน 24 ชั่วโมง</p>
                </div>
            </div>
            <div>
                <div>
                    {loading ? <div className='h-[180px] flex justify-center items-center'>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <Spinner />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                        </div>
                    </div> : approvedBorrowList.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                        <div className='mb-3'>
                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                        </div>
                        <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                        <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                    </div> : <>
                        {approvedBorrowList.map(borrow => (
                            <div key={borrow.id} className='border-l-7 border-l-[#34D399] border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6' >
                                {/* Desktop Layout */}
                                <div className='hidden sm:flex justify-between'>
                                    <div>
                                        <div className='flex justify-between items-center mb-2'>
                                            <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                        </div>
                                        <div className='space-y-2'>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย : </span> {borrow.approver_name}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-between items-end'>
                                        <div className='bg-[#D1FAE5] flex items-center gap-x-2 w-fit rounded-md px-4 py-1'>
                                            <div className='size-[7px] rounded-[50%] bg-[#10B981]'></div>
                                            <span className='cursor-default text-[#059669] text-[13px]'>{borrow.status && 'อนุมัติ'}</span>
                                        </div>
                                        <div className='flex items-center gap-x-3'>
                                            <button
                                                onClick={() => setBorrowDetailsModal(borrow)}
                                                className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                title="ดูรายละเอียด"
                                            >
                                                <PiNewspaper size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Mobile Layout */}
                                <div className='sm:hidden'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='space-y-3'>
                                            <div className='flex items-center gap-x-2'>
                                                {/* <span className='text-xs sm:text-base text-gray-500'>สถานะ</span> */}
                                                <div className='bg-[#D1FAE5] flex items-center gap-x-2 w-fit rounded-2xl px-2 py-1'>
                                                    <div className='size-[7px] rounded-[50%] bg-[#10B981]'></div>
                                                    <span className='line-clamp-1 cursor-default text-[#059669] text-xs sm:text-sm'>{borrow.status && 'อนุมัติ'}</span>
                                                </div>
                                            </div>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย : </span> {borrow.approver_name}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                        <div className='flex flex-col justify-end'>
                                            <div className='flex items-center gap-x-3'>
                                                <button
                                                    onClick={() => setBorrowDetailsModal(borrow)}
                                                    className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                    title="ดูรายละเอียด"
                                                >
                                                    <PiNewspaper size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}</>}
                </div>
            </div>
            {
                borrowDetailsModal && (
                    <BorrowDetailsModal borrow={borrowDetailsModal} onClose={() => setBorrowDetailsModal(null)} />
                )
            }
        </div >
    )
}

/* 3. กำลังยืม */
export function MyBorrowsBorrowing() {
    const [borrowingList, setBorrowingList] = useState([]);
    const [borrowDetailsModal, setBorrowDetailsModal] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchBorrowingList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/borrow/active');
            setBorrowingList(response.data);
        } catch (error) {
            console.error("Error fetching borrowing list:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchBorrowingList()
    }, [fetchBorrowingList]);
    const statusColor = {
        'active': {
            bg: 'bg-[#DBEAFE]',
            border: '#60A5FA',
            dot: 'bg-[#3B82F6]',
            text: 'text-[#1D4ED8]',
            label: 'กำลังยืม'
        },
        'overdue': {
            bg: 'bg-[#FEE2E2]',
            border: '#F87171',
            dot: 'bg-[#EF4444]',
            text: 'text-[#DC2626]',
            label: 'เกินกำหนด'
        },
    }
    return (
        <div id="MyBorrowsBorrowing">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่กำลังยืม</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> หากยืมเกินกำหนด กรุณาติดต่อเจ้าหน้าที่</p>
                </div>
            </div>
            <div>
                <div>
                    {loading ? <div className='h-[180px] flex justify-center items-center'>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <Spinner />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                        </div>
                    </div> : borrowingList.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                        <div className='mb-3'>
                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                        </div>
                        <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                        <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                    </div> : <>
                        {borrowingList.map(borrow => (
                            <div key={borrow.id} style={{ borderLeftColor: statusColor[borrow.status].border }} className={`${borrow.status === "overdue" ? 'bg-red-50 border-red-200' : ''} border-l-7 border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6`}>
                                {/* Desktop Layout */}
                                <div className='hidden sm:flex justify-between'>
                                    <div>
                                        <div className='flex justify-between items-center mb-2'>
                                            <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                        </div>
                                        <div className='space-y-2'>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วันกำหนดคืน : </span> {dayjs(borrow.expected_return_date).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย : </span> {borrow.approver_name}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>{borrow.status === 'overdue' && <p className='text-red-500 flex items-center gap-x-2'><AiFillInfoCircle size={20} /> คำขอนี้เกินกำหนดคืน กรุณาติดต่อเจ้าหน้าที่โดยด่วน</p>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-between items-end'>
                                        {statusColor[borrow.status] && (
                                            <div className={`flex items-center gap-x-2 w-fit rounded-md px-4 py-1 ${statusColor[borrow.status].bg} `}>
                                                <div className={`size-[7px] rounded-full ${statusColor[borrow.status].dot}`}></div>
                                                <span className={`cursor-default ${statusColor[borrow.status].text} text-[13px]`}>
                                                    {statusColor[borrow.status].label}
                                                </span>
                                            </div>
                                        )}
                                        <div className='flex items-center gap-x-3'>
                                            <button
                                                onClick={() => setBorrowDetailsModal(borrow)}
                                                className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                title="ดูรายละเอียด"
                                            >
                                                <PiNewspaper size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Mobile Layout */}
                                <div className='sm:hidden'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='space-y-3'>
                                            {statusColor[borrow.status] && (
                                                <div className={`flex items-center gap-x-2 w-fit rounded-md px-2 py-1 ${statusColor[borrow.status].bg} `}>
                                                    <div className={`size-[7px] rounded-full ${statusColor[borrow.status].dot}`}></div>
                                                    <span className={`cursor-default ${statusColor[borrow.status].text} text-[13px]`}>
                                                        {statusColor[borrow.status].label}
                                                    </span>
                                                </div>
                                            )}
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วันกำหนดคืน : </span> {dayjs(borrow.expected_return_date).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย : </span> {borrow.approver_name}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>{borrow.status === 'overdue' && <p className='text-red-500 flex items-center gap-x-2'><AiFillInfoCircle size={20} /> คำขอนี้เกินกำหนดคืน กรุณาติดต่อเจ้าหน้าที่โดยด่วน</p>}
                                        </div>
                                        <div className='flex flex-col justify-end'>
                                            <div className='flex items-center gap-x-3'>
                                                <button
                                                    onClick={() => setBorrowDetailsModal(borrow)}
                                                    className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                    title="ดูรายละเอียด"
                                                >
                                                    <PiNewspaper size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}</>}
                </div>
            </div>
            {borrowDetailsModal && (
                <BorrowDetailsModal borrow={borrowDetailsModal} onClose={() => setBorrowDetailsModal(null)} />
            )}
        </div>
    )
}

/* 4. คืนแล้ว */
export function MyBorrowsReturned() {
    const [returnedBorrowList, setReturnedBorrowList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [borrowDetailsModal, setBorrowDetailsModal] = useState(null);
    const fetchReturnedBorrowList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/borrow/returned');
            setReturnedBorrowList(response.data);
        } catch (error) {
            console.error("Error fetching returned list:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchReturnedBorrowList()
    }, [fetchReturnedBorrowList]);
    return (
        <div id="MyBorrowsReturned">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่คืนแล้ว</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> กรุณาติดต่อเจ้าหน้าที่หากต้องการข้อมูลเพิ่มเติม</p>
                </div>
            </div>
            <div>
                <div>
                    {loading ? <div className='h-[180px] flex justify-center items-center'>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <Spinner />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                        </div>
                    </div> : returnedBorrowList.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                        <div className='mb-3'>
                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                        </div>
                        <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                        <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                    </div> : <>
                        {returnedBorrowList.map(borrow => (
                            <div key={borrow.id} className={`border-l-7 border-l-[#22C55E] border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6`}>
                                {/* Desktop Layout */}
                                <div className='hidden sm:flex justify-between'>
                                    <div>
                                        <div className='flex justify-between items-center mb-2'>
                                            <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                        </div>
                                        <div className='space-y-2'>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วันที่คืน : </span> {dayjs(borrow.actual_return_date).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย : </span> {borrow.approver_name}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>
                                            {/* {borrow.status === 'overdue' && <p className='text-red-500 flex items-center gap-x-2'><AiFillInfoCircle size={20} /> คำขอนี้เกินกำหนดคืน กรุณาติดต่อเจ้าหน้าที่โดยด่วน</p>} */}
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-between items-end'>
                                        <div className='flex items-center gap-x-2 bg-[#DCFCE7] w-fit rounded-md px-4 py-1 '>
                                            <div className='size-[7px] rounded-[50%] bg-[#16A34A]'></div>
                                            <span className='cursor-default text-[#15803D] text-[13px]'>{borrow.status && 'คืนแล้ว'}</span>
                                        </div>
                                        <div className='flex items-center gap-x-3'>
                                            <button
                                                onClick={() => setBorrowDetailsModal(borrow)}
                                                className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                title="ดูรายละเอียด"
                                            >
                                                <PiNewspaper size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Mobile Layout */}
                                <div className='sm:hidden'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='space-y-3'>
                                            <div className='flex items-center gap-x-2'>
                                                {/* <span className='text-xs sm:text-base text-gray-500'>สถานะ</span> */}
                                                <div className='flex items-center gap-x-2 bg-[#DCFCE7] w-fit rounded-md px-2 py-1 '>
                                                    <div className='size-[7px] rounded-[50%] bg-[#16A34A]'></div>
                                                    <span className='cursor-default text-[#15803D] text-[13px]'>{borrow.status && 'คืนแล้ว'}</span>
                                                </div>
                                            </div>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วันที่คืน : </span> {dayjs(borrow.actual_return_date).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย : </span> {borrow.approver_name}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                        <div className='flex flex-col justify-end'>
                                            <div className='flex items-center gap-x-3'>
                                                <button
                                                    onClick={() => setBorrowDetailsModal(borrow)}
                                                    className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                    title="ดูรายละเอียด"
                                                >
                                                    <PiNewspaper size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}</>}
                </div>
            </div>
            {borrowDetailsModal && (
                <BorrowDetailsModal borrow={borrowDetailsModal} onClose={() => setBorrowDetailsModal(null)} />
            )}
        </div>
    )
}

/* 5. ไม่อนุมัติ */
export function MyBorrowsRejected() {
    const [rejectedBorrowList, setRejectedBorrowList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [borrowDetailsModal, setBorrowDetailsModal] = useState(null);
    const fetchRejectedBorrowList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/borrow/rejected');
            setRejectedBorrowList(response.data);
        } catch (error) {
            console.error("Error fetching rejected list:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchRejectedBorrowList()
    }, [fetchRejectedBorrowList]);
    return (
        <div id="MyBorrowsRejected">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่ไม่อนุมัติ</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> กรุณาติดต่อเจ้าหน้าที่หากต้องการข้อมูลเพิ่มเติม</p>
                </div>
            </div>
            <div>
                <div>
                    {loading ? <div className='h-[180px] flex justify-center items-center'>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <Spinner />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                        </div>
                    </div> : rejectedBorrowList.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                        <div className='mb-3'>
                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                        </div>
                        <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                        <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                    </div> : <>
                        {rejectedBorrowList.map(borrow => (
                            <div key={borrow.id} className={`border-l-7 border-l-[#F87171] border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6`}>
                                {/* Desktop Layout */}
                                <div className='hidden sm:flex justify-between'>
                                    <div>
                                        <div className='flex justify-between items-center mb-2'>
                                            <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                        </div>
                                        <div className='space-y-2'>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติโดย : </span> {borrow.approver_name}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ไม่อนุมัติ : </span> {borrow.rejection_reason}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-between items-end'>
                                        <div className='flex items-center gap-x-2 bg-[#FEE2E2] w-fit rounded-md px-4 py-1'>
                                            <div className='size-[7px] rounded-[50%] bg-[#EF4444]'></div>
                                            <span className='cursor-default text-[#DC2626] text-[13px]'>{borrow.status && 'ไม่อนุมัติ'}</span>
                                        </div>
                                        <div className='flex items-center gap-x-3'>
                                            <button
                                                onClick={() => setBorrowDetailsModal(borrow)}
                                                className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                title="ดูรายละเอียด"
                                            >
                                                <PiNewspaper size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Mobile Layout */}
                                <div className='sm:hidden'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='space-y-3'>
                                            <div className='flex items-center gap-x-2'>
                                                <div className='flex items-center gap-x-2 bg-[#FEE2E2] w-fit rounded-md px-2 py-1'>
                                                    <div className='size-[7px] rounded-[50%] bg-[#EF4444]'></div>
                                                    <span className='cursor-default text-[#DC2626] text-[13px]'>{borrow.status && 'ไม่อนุมัติ'}</span>
                                                </div>
                                            </div>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติโดย : </span> {borrow.approver_name}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ไม่อนุมัติ : </span> {borrow.rejection_reason}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                        <div className='flex flex-col justify-end'>
                                            <div className='flex items-center gap-x-3'>
                                                <button
                                                    onClick={() => setBorrowDetailsModal(borrow)}
                                                    className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                    title="ดูรายละเอียด"
                                                >
                                                    <PiNewspaper size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}</>}
                </div>
            </div>
            {borrowDetailsModal && (
                <BorrowDetailsModal borrow={borrowDetailsModal} onClose={() => setBorrowDetailsModal(null)} />
            )}
        </div>
    )
}

/* 6. รายการทั้งหมด */
export function MyBorrowsHistory() {
    const [allBorrowsList, setAllBorrowsList] = useState([]);
    const [cancelledBorrowModal, setCancelledBorrowModal] = useState(null);
    const [borrowDetailsModal, setBorrowDetailsModal] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchAllBorrows = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axios.get('/api/users/borrow');
            setAllBorrowsList(response.data);
        } catch (error) {
            console.error("Error fetching all borrows:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchAllBorrows()
    }, [fetchAllBorrows]);
    const statusColor = {
        'pending_approval': {
            bg: 'bg-[#FEF9C3]',
            border: '#FACC15',
            dot: 'bg-[#EAB308]',
            text: 'text-[#B45309]',
            label: 'รอดำเนินการ'
        },
        'approved': {
            bg: 'bg-[#D1FAE5]',
            border: '#34D399',
            dot: 'bg-[#10B981]',
            text: 'text-[#059669]',
            label: 'อนุมัติ'
        },
        'active': {
            bg: 'bg-[#DBEAFE]',
            border: '#60A5FA',
            dot: 'bg-[#3B82F6]',
            text: 'text-[#1D4ED8]',
            label: 'กำลังยืม'
        },
        'overdue': {
            bg: 'bg-[#FEE2E2]',
            border: '#F87171',
            dot: 'bg-[#EF4444]',
            text: 'text-[#DC2626]',
            label: 'เกินกำหนด'
        },
        'returned': {
            bg: 'bg-[#DCFCE7]',
            border: '#22C55E',
            dot: 'bg-[#16A34A]',
            text: 'text-[#15803D]',
            label: 'คืนแล้ว'
        },
        'rejected': {
            bg: 'bg-[#FEE2E2]',
            border: '#F87171',
            dot: 'bg-[#EF4444]',
            text: 'text-[#DC2626]',
            label: 'ไม่อนุมัติ'
        },
        'cancelled': {
            bg: 'bg-[#F3F4F6]',
            border: '#D1D5DB',
            dot: 'bg-[#9CA3AF]',
            text: 'text-[#6B7280]',
            label: 'ยกเลิก'
        },
    };
    return (
        <div id="MyBorrowsHistory">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการทั้งหมด</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> กรุณาติดต่อเจ้าหน้าที่หากต้องการข้อมูลเพิ่มเติม</p>
                </div>
            </div>
            <div>
                <div>
                    {loading ? <div className='h-[180px] flex justify-center items-center'>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <Spinner />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                        </div>
                    </div> : allBorrowsList.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                        <div className='mb-3'>
                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                        </div>
                        <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                        <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                    </div> : <>
                        {allBorrowsList.map(borrow => (
                            <div key={borrow.id} style={{ borderLeftColor: statusColor[borrow.status].border }} className={`${borrow.status === "overdue" ? 'bg-red-50 border-red-200' : ''} border-l-7 border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6`}>
                                {/* Desktop Layout */}
                                <div className='hidden sm:flex justify-between'>
                                    <div>
                                        <div className='flex justify-between items-center mb-2'>
                                            <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                        </div>
                                        <div className='space-y-2'>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            {borrow.status === 'returned' && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วันที่คืน : </span> {dayjs(borrow.actual_return_date).format('DD/MM/YYYY HH:mm')}</p>}
                                            {['active', 'overdue'].includes(borrow.status) && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วันกำหนดคืน : </span> {dayjs(borrow.expected_return_date).format('DD/MM/YYYY HH:mm')}</p>}
                                            {borrow.approver_name && borrow.status !== 'rejected' && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย : </span> {borrow.approver_name}</p>}
                                            {['approved', 'active', 'overdue', 'returned'].includes(borrow.status) && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>}
                                            {borrow.status === 'rejected' && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติโดย : </span> {borrow.approver_name}</p>}
                                            {borrow.status === 'rejected' && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ไม่อนุมัติ : </span> {borrow.rejection_reason}</p>}
                                            {borrow.status === 'rejected' && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>}
                                            {borrow.status === 'overdue' && <p className='text-red-500 flex items-center gap-x-2'><AiFillInfoCircle size={20} /> คำขอนี้เกินกำหนดคืน กรุณาติดต่อเจ้าหน้าที่โดยด่วน</p>}
                                            {borrow.status === 'cancelled' && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ยกเลิก : </span> {borrow.rejection_reason}</p>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-between items-end'>
                                        {statusColor[borrow.status] && (
                                            <div className={`flex items-center gap-x-2 w-[115px] rounded-md px-4 py-1 ${statusColor[borrow.status].bg}`}>
                                                {/* เส้นขอบ Status border border-[${statusColor[borrow.status].border}] */}
                                                <div className={`size-[7px] rounded-full ${statusColor[borrow.status].dot}`}></div>
                                                <span className={`cursor-default ${statusColor[borrow.status].text} text-[13px]`}>
                                                    {statusColor[borrow.status].label}
                                                </span>
                                            </div>
                                        )}
                                        <div className='flex items-center gap-x-2 '>
                                            <button
                                                onClick={() => setBorrowDetailsModal(borrow)}
                                                className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                title="ดูรายละเอียด"
                                            >
                                                <PiNewspaper size={20} />
                                            </button>
                                            {borrow.status === 'pending_approval' && (
                                                <button
                                                    onClick={() => setCancelledBorrowModal(borrow)}
                                                    className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#d9534f] text-white transition-all duration-200 hover:bg-[#DC2626] hover:scale-105 shadow-md'
                                                    title="ยกเลิก"
                                                >
                                                    <RxCross2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Mobile Layout */}
                                <div className='sm:hidden'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='space-y-3'>
                                            <div className='flex items-center gap-x-2'>
                                                {statusColor[borrow.status] && (
                                                    <div className={`flex items-center gap-x-2 w-fit rounded-md px-2 py-1 ${statusColor[borrow.status].bg}`}>
                                                        {/* เส้นขอบ Status border border-[${statusColor[borrow.status].border}] */}
                                                        <div className={`size-[7px] rounded-full ${statusColor[borrow.status].dot}`}></div>
                                                        <span className={`cursor-default ${statusColor[borrow.status].text} text-[13px]`}>
                                                            {statusColor[borrow.status].label}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            {borrow.status === 'returned' && <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วันที่คืน : </span> {dayjs(borrow.actual_return_date).format('DD/MM/YYYY HH:mm')}</p>}
                                            {['active', 'overdue'].includes(borrow.status) && <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วันกำหนดคืน : </span> {dayjs(borrow.expected_return_date).format('DD/MM/YYYY HH:mm')}</p>}
                                            {borrow.approver_name && borrow.status !== 'rejected' && <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย : </span> {borrow.approver_name}</p>}
                                            {['approved', 'active', 'overdue', 'returned'].includes(borrow.status) && <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>}
                                            {borrow.status === 'rejected' && <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติโดย : </span> {borrow.approver_name}</p>}
                                            {borrow.status === 'rejected' && <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ไม่อนุมัติ : </span> {borrow.rejection_reason}</p>}
                                            {borrow.status === 'rejected' && <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>}
                                            {borrow.status === 'overdue' && <p className='line-clamp-1 text-xs sm:text-base text-red-500 flex items-center gap-x-2'><AiFillInfoCircle size={20} /> คำขอนี้เกินกำหนดคืน กรุณาติดต่อเจ้าหน้าที่โดยด่วน</p>}
                                            {borrow.status === 'cancelled' && <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ยกเลิก : </span> {borrow.rejection_reason}</p>}
                                        </div>
                                        <div className='flex flex-col justify-end'>
                                            <div className='flex items-center gap-x-3'>
                                                <button
                                                    onClick={() => setBorrowDetailsModal(borrow)}
                                                    className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                    title="ดูรายละเอียด"
                                                >
                                                    <PiNewspaper size={20} />
                                                </button>
                                                {borrow.status === 'pending_approval' && (
                                                    <button
                                                        onClick={() => setCancelledBorrowModal(borrow)}
                                                        className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-md bg-[#d9534f] text-white transition-all duration-200 hover:bg-[#DC2626] hover:scale-105 shadow-md'
                                                        title="ยกเลิก"
                                                    >
                                                        <RxCross2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}</>}
                </div>
            </div>
            {cancelledBorrowModal && (
                <CancelledBorrowModal
                    borrow={cancelledBorrowModal}
                    refresh={fetchAllBorrows}
                    onClose={() => setCancelledBorrowModal(null)}
                />
            )}
            {borrowDetailsModal && (
                <BorrowDetailsModal borrow={borrowDetailsModal} onClose={() => setBorrowDetailsModal(null)} />
            )}
        </div>
    )
}

/* 7. ยกเลิกคำขอ */
export function MyBorrowsCancelled() {
    const [cancelledBorrowList, setCancelledBorrowList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [borrowDetailsModal, setBorrowDetailsModal] = useState(null);
    const fetchCancelledBorrowList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/borrow/cancelled');
            setCancelledBorrowList(response.data);
        } catch (error) {
            console.error("Error fetching cancelled list:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchCancelledBorrowList()
    }, [fetchCancelledBorrowList]);
    return (
        <div id="MyBorrowsCancelled">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่ยกเลิก</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> กรุณาติดต่อเจ้าหน้าที่หากต้องการข้อมูลเพิ่มเติม</p>
                </div>
            </div>
            <div>
                <div>
                    {loading ? <div className='h-[180px] flex justify-center items-center'>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <Spinner />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                        </div>
                    </div> : cancelledBorrowList.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                        <div className='mb-3'>
                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                        </div>
                        <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                        <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                    </div> : <>
                        {cancelledBorrowList.map(borrow => (
                            <div key={borrow.id} className={`border-l-7 border-l-[#D1D5DB] border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6`}>
                                {/* Desktop Layout */}
                                <div className='hidden sm:flex justify-between'>
                                    <div>
                                        <div className='flex justify-between items-center mb-2'>
                                            <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                        </div>
                                        <div className='space-y-2'>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ยกเลิก : </span> {borrow.rejection_reason}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-between items-end'>
                                        <div className='flex items-center gap-x-2 bg-[#F3F4F6] w-fit rounded-md px-4 py-1'>
                                            <div className='size-[7px] rounded-[50%] bg-[#9CA3AF]'></div>
                                            <span className='cursor-default text-[#6B7280] text-[13px]'>{borrow.status && 'ยกเลิก'}</span>
                                        </div>
                                        <div className='flex items-center gap-x-3'>
                                            <button
                                                onClick={() => setBorrowDetailsModal(borrow)}
                                                className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                title="ดูรายละเอียด"
                                            >
                                                <PiNewspaper size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Mobile Layout */}
                                <div className='sm:hidden'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='space-y-3'>
                                            <div className='flex items-center gap-x-2'>
                                                {/* <span className='text-xs sm:text-base text-gray-500'>สถานะ</span> */}
                                                <div className='flex items-center gap-x-2 bg-[#F3F4F6] w-fit rounded-md px-2 py-1'>
                                                    <div className='size-[7px] rounded-[50%] bg-[#9CA3AF]'></div>
                                                    <span className='cursor-default text-[#6B7280] text-[13px]'>{borrow.status && 'ยกเลิก'}</span>
                                                </div>
                                            </div>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ยกเลิก : </span> {borrow.rejection_reason}</p>
                                        </div>
                                        <div className='flex flex-col justify-end'>
                                            <div className='flex items-center gap-x-3'>
                                                <button
                                                    onClick={() => setBorrowDetailsModal(borrow)}
                                                    className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                    title="ดูรายละเอียด"
                                                >
                                                    <PiNewspaper size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}</>}
                </div>
            </div>
            {borrowDetailsModal && (
                <BorrowDetailsModal borrow={borrowDetailsModal} onClose={() => setBorrowDetailsModal(null)} />
            )}
        </div>
    )
}

/* 8. เกินกำหนด */
export function MyBorrowsOverdue() {
    const [overdueBorrowList, setOverdueBorrowList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [borrowDetailsModal, setBorrowDetailsModal] = useState(null);
    const fetchOverdueBorrowList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/borrow/overdue');
            setOverdueBorrowList(response.data);
        } catch (error) {
            console.error("Error fetching overdue list:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchOverdueBorrowList()
    }, [fetchOverdueBorrowList]);
    return (
        <div id="MyBorrowsOverdue">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่เกินกำหนดคืน</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> หากยืมเกินกำหนด กรุณาติดต่อเจ้าหน้าที่</p>
                </div>
            </div>
            <div>
                <div>
                    {loading ? <div className='h-[180px] flex justify-center items-center'>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <Spinner />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                        </div>
                    </div> : overdueBorrowList.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                        <div className='mb-3'>
                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                        </div>
                        <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                        <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                    </div> : <>
                        {overdueBorrowList.map(borrow => (
                            <div key={borrow.id} className={`bg-red-50  border-l-7 border-l-[#F87171] border-t border-r border-b border-red-200 rounded-r-[5px] shadow-sm p-6 mb-6`}>
                                {/* Desktop Layout */}
                                <div className='hidden sm:flex justify-between'>
                                    <div>
                                        <div className='flex justify-between items-center mb-2'>
                                            <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                        </div>
                                        <div className='space-y-2'>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วันกำหนดคืน : </span> {dayjs(borrow.expected_return_date).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย : </span> {borrow.approver_name}</p>
                                            <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-red-500 flex items-center gap-x-2'><AiFillInfoCircle size={20} /> คำขอนี้เกินกำหนดคืน กรุณาติดต่อเจ้าหน้าที่โดยด่วน</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-between items-end'>
                                        <div className='flex items-center gap-x-2 bg-[#FEE2E2] w-fit rounded-md px-4 py-1'>
                                            <div className='size-[7px] rounded-[50%] bg-[#EF4444]'></div>
                                            <span className='cursor-default text-[#DC2626] text-[13px]'>{borrow.status && 'เกินกำหนด'}</span>
                                        </div>
                                        <div className='flex items-center gap-x-3'>
                                            <button
                                                onClick={() => setBorrowDetailsModal(borrow)}
                                                className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                title="ดูรายละเอียด"
                                            >
                                                <PiNewspaper size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Mobile Layout */}
                                <div className='sm:hidden'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{borrow.borrow_code}</h2>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='space-y-3'>
                                            <div className='flex items-center gap-x-2'>
                                                {/* <span className='text-xs sm:text-base text-gray-500'>สถานะ</span> */}
                                                <div className='flex items-center gap-x-2 bg-[#FEE2E2] w-fit rounded-md px-2 py-1'>
                                                    <div className='size-[7px] rounded-[50%] bg-[#EF4444]'></div>
                                                    <span className='cursor-default text-[#DC2626] text-[13px]'>{borrow.status && 'เกินกำหนด'}</span>
                                                </div>
                                            </div>
                                            <p className='line-clamp-1 text-xs sm:text-base  text-gray-800'><span className='text-gray-500'>ส่งคำขอเมื่อ : </span> {dayjs(borrow.borrowDate).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base  text-gray-800'><span className='text-gray-500'>ชื่อครุภัณฑ์ : </span> {borrow.borrowed_items[0].equipment_name}</p>
                                            {/* <p className='line-clamp-1 text-xs sm:text-base  text-gray-800'><span className='text-gray-500'>จำนวนครุภัณฑ์ที่ยืม : </span>1 รายการ</p> */}
                                            <p className='line-clamp-1 text-xs sm:text-base  text-gray-800'><span className='text-gray-500'>วัตถุประสงค์ : </span> {borrow.purpose}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base  text-gray-800'><span className='text-gray-500'>วันกำหนดคืน : </span> {dayjs(borrow.expected_return_date).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base  text-gray-800'><span className='text-gray-500'>อนุมัติโดย : </span> {borrow.approver_name}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base  text-gray-800'><span className='text-gray-500'>อนุมัติเมื่อ : </span> {dayjs(borrow.approved_at).format('DD/MM/YYYY HH:mm')}</p>
                                            <p className='line-clamp-1 text-xs sm:text-base text-red-500 flex items-center gap-x-2'><AiFillInfoCircle size={20} /> คำขอนี้เกินกำหนดคืน กรุณาติดต่อเจ้าหน้าที่โดยด่วน</p>
                                        </div>
                                        <div className='flex flex-col justify-end'>
                                            <div className='flex items-center gap-x-3'>
                                                <button
                                                    onClick={() => setBorrowDetailsModal(borrow)}
                                                    className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-md bg-[#28c3d7] text-white transition-all duration-200 hover:bg-[#1999b3] hover:scale-105 shadow-md'
                                                    title="ดูรายละเอียด"
                                                >
                                                    <PiNewspaper size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}</>}
                </div>
            </div>
            {borrowDetailsModal && (
                <BorrowDetailsModal borrow={borrowDetailsModal} onClose={() => setBorrowDetailsModal(null)} />
            )}
        </div>
    )
}
