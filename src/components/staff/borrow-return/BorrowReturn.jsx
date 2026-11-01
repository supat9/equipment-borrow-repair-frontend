'use client';
import { request } from 'http';
import React, { useCallback } from 'react';
import { useState, useEffect } from 'react';
import { mockBorrow } from '@/mock/mockBorrow';
import { FaSort } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdAssignment } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { BsBoxSeam, BsCalendar3 } from "react-icons/bs";
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { MdAssessment } from 'react-icons/md';
import Spinner from '@/components/users/loading/Spinner';
import { LuUserRound } from "react-icons/lu";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { PiDevicesFill, PiNewspaper } from "react-icons/pi";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DateTimePicker from '@/components/inputs/DateTimePicker';
import { DataLoading, SubmitLoading } from '@/components/users/loading/LoadingOverlay';
import { BsChatSquareTextFill } from "react-icons/bs";
import { FaLayerGroup } from "react-icons/fa";
import Pagination from '@/components/staff/pagination/Pagination';
import { useNotifications } from '@/context/staff/StaffContext';
import { BsBoxSeamFill } from "react-icons/bs";
import { FiUser } from 'react-icons/fi';
import { DateTime } from 'luxon';

export function BorrowRequestModal({ borrow, onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [borrowById, setBorrowById] = useState(null);
    const [borrowIdLoading, setBorrowIdLoading] = useState(false);
    const fetchBorrowById = async (id) => {
        try {
            setBorrowIdLoading(true);
            const response = await axios.get(`/api/staff/borrow/${encodeURIComponent(id)}`);
            setBorrowById(response.data);
            setBorrowIdLoading(false);
        } catch (error) {
            console.error("fetch borrow by id error:", error);
        } finally {
            setBorrowIdLoading(false);
        }
    }
    useEffect(() => {
        fetchBorrowById(borrow.id);
        fetchConditionStatus();
    }, []);
    const statusColor = {
        'pending_approval': {
            bg: 'bg-yellow-50 border border-yellow-200',
            dot: 'bg-yellow-500',
            text: 'text-yellow-700',
            label: 'รอดำเนินการ'
        },
        'cancelled': {
            bg: 'bg-gray-50 border border-gray-200',
            dot: 'bg-gray-500',
            text: 'text-gray-700',
            label: 'ยกเลิก'
        },
        'approved': {
            bg: 'bg-green-50 border border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'อนุมัติ'
        },
        'active': {
            bg: 'bg-blue-50 border border-blue-200',
            dot: 'bg-blue-500',
            text: 'text-blue-700',
            label: 'กำลังยืม'
        },
        'overdue': {
            bg: 'bg-red-50 border border-red-200',
            dot: 'bg-red-500',
            text: 'text-red-700',
            label: 'เกินกำหนด'
        },
        'rejected': {
            bg: 'bg-red-50 border border-red-200',
            dot: 'bg-red-500',
            text: 'text-red-700',
            label: 'ไม่อนุมัติ'
        },
        'returned': {
            bg: 'bg-green-50 border border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'คืนแล้ว'
        },
    };
    const [comment, setComment] = useState('');
    const [commentForActive, setCommentForActive] = useState('');
    const [penalty_amount, setPenalty_amount] = useState(0);
    const [penalty_paid, setPenalty_paid] = useState(0);
    const [conditionOptions, setConditionOptions] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState(null);
    const fetchConditionStatus = async () => {
        try {
            const response = await axios.get('/api/staff/equipment/status/condition-status');
            const result = response.data;
            const conditionNameTH = {
                excellent: "ดีมาก",
                good: "ดี",
                fair: "พอใช้",
                poor: "ชำรุด",
                broken: "เสียหาย"
            };
            const options = result.map((status) => ({
                value: status.condition_name,
                label: conditionNameTH[status.condition_name] || status.condition_name
            }));
            setConditionOptions(options);
        } catch (error) {
            console.error("Fetch condition status error:", error);
        }
    }
    const [actual_return_date, setActual_return_date] = useState(null);
    const showAlertByStatus = async (status, message) => {
        let icon = "error";
        let color = "#d33";
        let text = message || "เกิดข้อผิดพลาด";
        if (status === 400) {
            icon = "warning";
            color = "#FFC107"; // yellow
            text = message || "กรุณากรอกข้อมูลให้ครบถ้วน";
        } else if (status === 403) {
            icon = "error";
            color = "#e67e22"; // orange-red
            text = message || "คุณไม่มีสิทธิ์ดำเนินการนี้";
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
            title: "ไม่สามารถดำเนินการได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const [submitLoading, setSubmitLoading] = useState(false);
    const { fetchBorrowRequests } = useNotifications();
    const handleApprove = async (id) => {
        try {
            // if (!comment) {
            //     return Swal.fire({
            //         title: 'ไม่สามารถดำเนินการได้',
            //         text: `กรุณากรอกหมายเหตุการอนุมัติ`,
            //         icon: 'warning',
            //         confirmButtonText: 'ตกลง',
            //         confirmButtonColor: '#FFC107',
            //     });
            // }
            const confirmed = await Swal.fire({
                title: `ยืนยันที่จะอนุมัติคำขอยืมนี้?`,
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
            if (!confirmed.isConfirmed) return;
            setSubmitLoading(true);
            const response = await axios.put(`/api/staff/borrow/approved/${encodeURIComponent(id)}`,
                { note: comment });
            const result = response.data;
            setSubmitLoading(false);
            fetchBorrowRequests(); // รีเฟรชจำนวนคำขอยืมที่รอดำเนินการ
            await Swal.fire({
                title: 'ดำเนินการสำเร็จ!',
                text: result?.message || 'จัดการคำขอเรียบร้อยแล้ว',
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
            console.error("approve borrow request error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    const handleReject = async (id) => {
        try {
            if (comment) {
                const confirmed = await Swal.fire({
                    title: `ยืนยันที่จะไม่อนุมัติคำขอยืมนี้?`,
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
                if (!confirmed.isConfirmed) return;
            }
            setSubmitLoading(true);
            const response = await axios.put(`/api/staff/borrow/rejected/${encodeURIComponent(id)}`,
                { rejection_reason: comment });
            const result = response.data;
            setSubmitLoading(false);
            fetchBorrowRequests(); // รีเฟรชจำนวนคำขอยืมที่รอดำเนินการ
            await Swal.fire({
                title: 'ดำเนินการสำเร็จ!',
                text: result?.message || 'จัดการคำขอเรียบร้อยแล้ว',
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
            console.error("reject borrow request error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    const handleActive = async (id) => {
        try {
            // if (!commentForActive) {
            //     return Swal.fire({
            //         title: 'ไม่สามารถดำเนินการได้',
            //         text: `กรุณากรอกหมายเหตุ`,
            //         icon: 'warning',
            //         confirmButtonText: 'ตกลง',
            //         confirmButtonColor: '#FFC107',
            //     });
            // }
            const confirmed = await Swal.fire({
                title: `ยืนยันที่จะดำเนินการคำขอยืมนี้?`,
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
            if (!confirmed.isConfirmed) return;
            setSubmitLoading(true);
            const response = await axios.put(`/api/staff/borrow/active/${encodeURIComponent(id)}`,
                { rejection_reason: commentForActive });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'ดำเนินการสำเร็จ!',
                text: result?.message || 'จัดการคำขอเรียบร้อยแล้ว',
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
            console.error("active borrow request error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    const handleReturn = async (id) => {
        try {
            if (actual_return_date) {
                const confirmed = await Swal.fire({
                    title: `ยืนยันที่จะดำเนินการคำขอยืมนี้?`,
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
                if (!confirmed.isConfirmed) return;
            }
            const formattedReturnDate = actual_return_date
                ? DateTime.fromJSDate(actual_return_date).setZone('Asia/Bangkok').toISO()
                : null;
            setSubmitLoading(true);
            const response = await axios.put(`/api/staff/borrow/returned/${encodeURIComponent(id)}`,
                {
                    actual_return_date: formattedReturnDate,
                    return_condition: selectedCondition ? selectedCondition.value : null, // <--- ตรงนี้
                    penalty_amount,
                    penalty_paid
                });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'ดำเนินการสำเร็จ!',
                text: result?.message || 'จัดการคำขอเรียบร้อยแล้ว',
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
            console.error("return borrow request error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    const fmt = (time) => dayjs(time).format('DD/MM/YYYY HH:mm');
    // จำกัด 10:00–16:00
    const minTime = new Date();
    minTime.setHours(10, 0, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(16, 0, 0, 0);
    const statusActions = {
        'pending_approval': () => (
            <form className='mb-6' action="">
                <div className='bg-white border border-gray-300 shadow-sm p-6 mb-4 rounded-[5px]   transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <PiNewspaper size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลการดำเนินการ</h2>
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label className='text-gray-600' htmlFor="">หมายเหตุ ( ระบุหากไม่อนุมัติ )</label>
                        <textarea
                            className='text-gray-500 border border-gray-300 bg-white rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                            placeholder='ระบุหมายเหตุการอนุมัติ / ไม่อนุมัติ'
                            type="text"
                            id="comment"
                            name="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>
                <div className='flex justify-end gap-x-4 text-[15px]'>
                    <button type='button' onClick={() => handleReject(borrowById?.id)} className='cursor-pointer rounded-[5px] px-4 py-2 bg-[#d9534f] text-white duration-200 hover:bg-[#DC2626]'>
                        ไม่อนุมัติ
                    </button>
                    <button type='button' onClick={() => handleApprove(borrowById?.id)} className='cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>
                        อนุมัติ
                    </button>
                </div>
            </form>
        ),
        'approved': () => (
            <form className='mb-6' action="">
                {/* <div className='flex flex-col gap-y-2 mb-5'>
                    <textarea
                        className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 focus:outline-none'
                        placeholder='ระบุหมายเหตุ'
                        type="text"
                        id="commentForActive"
                        name="commentForActive"
                        value={commentForActive}
                        onChange={(e) => setCommentForActive(e.target.value)}
                    />
                </div> */}
                <div className='flex justify-end items-center gap-x-4 text-[15px]'>
                    <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                    <button type='button' onClick={() => handleActive(borrowById?.id)} className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>
                        รับครุภัณฑ์แล้ว
                    </button>
                </div>
            </form>
        ),
        'active': () => (
            <form className='mb-6' action="">
                <div className='bg-white border border-gray-300 shadow-sm p-6 mb-4 rounded-[5px]   transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <PiNewspaper size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลการดำเนินการ</h2>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-x-4 items-center'>
                        <div className='flex flex-col gap-y-2 mb-4'>
                            <label className='text-gray-600' htmlFor="">วันที่คืนจริง</label>
                            <DateTimePicker
                                value={actual_return_date}
                                onChange={setActual_return_date}
                                placeholderText="เลือกวันและเวลา"
                                minTime={minTime}
                                maxTime={maxTime}
                            />
                        </div>
                        <div className='flex flex-col gap-y-3 mb-6'>
                            <label className='text-gray-600' htmlFor="major">สภาพตอนคืน</label>
                            <div>
                                <Select
                                    options={conditionOptions}
                                    onChange={setSelectedCondition}
                                    value={selectedCondition}
                                    className='w-full'
                                    id="major"
                                    name="major"
                                    placeholder='สภาพตอนคืน'
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
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
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-y-2 mb-5'>
                            <label className='text-gray-600' htmlFor="">จำนวนค่าปรับ (ถ้ามี)</label>
                            <input
                                className='text-[#4E5155] border border-gray-300 bg-white rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                placeholder='จำนวนค่าปรับ (ถ้ามี)'
                                type="text"
                                id="penalty_amount"
                                name="penalty_amount"
                                value={penalty_amount}
                                onChange={(e) => setPenalty_amount(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col gap-y-2 mb-5'>
                            <label className='text-gray-600' htmlFor="">สถานะการชำระค่าปรับ (ถ้ามี)</label>
                            <input
                                className='text-[#4E5155] border border-gray-300 bg-white rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                placeholder='สถานะการชำระค่าปรับ (ถ้ามี)'
                                type="text"
                                id="penalty_paid"
                                name="penalty_paid"
                                value={penalty_paid}
                                onChange={(e) => setPenalty_paid(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex justify-end gap-x-4 text-[15px]'>
                    <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                    <button type='button' onClick={() => handleReturn(borrowById?.id)} className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>
                        คืนครุภัณฑ์แล้ว
                    </button>
                </div>
            </form>
        ),
        'overdue': () => (
            <form className='mb-6' action="">
                <div className='bg-white border border-gray-300 shadow-sm p-6 mb-4 rounded-[5px]   transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <PiNewspaper size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลการดำเนินการ</h2>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-x-4 items-center'>
                        <div className='flex flex-col gap-y-2 mb-4'>
                            <label className='text-gray-600' htmlFor="">วันที่คืนจริง</label>
                            <DateTimePicker
                                value={actual_return_date}
                                onChange={setActual_return_date}
                                placeholderText="เลือกวันและเวลา"
                                minTime={minTime}
                                maxTime={maxTime}
                            />
                        </div>
                        <div className='flex flex-col gap-y-3 mb-6'>
                            <label className='text-gray-600' htmlFor="major">สภาพตอนคืน</label>
                            <div>
                                <Select
                                    options={conditionOptions}
                                    onChange={setSelectedCondition}
                                    value={selectedCondition}
                                    className='w-full'
                                    id="major"
                                    name="major"
                                    placeholder='สภาพตอนคืน'
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
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
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-y-2 mb-5'>
                            <label className='text-gray-600' htmlFor="">จำนวนค่าปรับ (ถ้ามี)</label>
                            <input
                                className='text-[#4E5155] border border-gray-300 bg-white rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                placeholder='จำนวนค่าปรับ (ถ้ามี)'
                                type="text"
                                id="penalty_amount"
                                name="penalty_amount"
                                value={penalty_amount}
                                onChange={(e) => setPenalty_amount(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col gap-y-2 mb-5'>
                            <label className='text-gray-600' htmlFor="">สถานะการชำระค่าปรับ (ถ้ามี)</label>
                            <input
                                className='text-[#4E5155] border border-gray-300 bg-white rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                placeholder='สถานะการชำระค่าปรับ (ถ้ามี)'
                                type="text"
                                id="penalty_paid"
                                name="penalty_paid"
                                value={penalty_paid}
                                onChange={(e) => setPenalty_paid(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex justify-end gap-x-4 text-[15px]'>
                    <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                    <button type='button' onClick={() => handleReturn(borrowById?.id)} className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>
                        คืนครุภัณฑ์แล้ว
                    </button>
                </div>
            </form>
        ),
        'returned': () => (
            <div className='mb-6 flex justify-end'>
                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
            </div>
        ),
        'rejected': () => (
            <div className='mb-6 flex justify-end'>
                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
            </div>
        ),
        'cancelled': () => (
            <div className='mb-6 flex justify-end'>
                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
            </div>
        ),
        'default': () => (
            <div>
                {borrowIdLoading && <DataLoading style='fixed inset-0 z-50 bg-[rgba(0,0,0,0.1)]' />}
            </div>
        )
    }

    const renderStatusContent = () => {
        const renderer = statusActions[borrowById?.status_name] || statusActions['default'];
        return renderer();
    }
    const conditionNameTH = {
        excellent: "ดีมาก",
        good: "ดี",
        fair: "พอใช้",
        poor: "ชำรุด",
        broken: "เสีย"
    };

    return (
        <div id="borrow-request-modal">
            <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[600px] max-w-[800px] w-full bg-white rounded-[5px] pt-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-6'>
                        <div className='flex items-center gap-x-4'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>รายละเอียดคำขอยืมครุภัณฑ์</h2>
                            {statusColor[borrowById?.status_name] && (
                                <div className={`flex items-center gap-x-2 w-fit rounded-lg px-3 py-1 ${statusColor[borrowById?.status_name].bg}`}>
                                    {/* border  border-[${statusColor[request.status].border}] */}
                                    <div className={`size-[7px] rounded-full ${statusColor[borrowById?.status_name].dot}`}></div>
                                    <span className={`cursor-default ${statusColor[borrowById?.status_name].text} text-[13px]`}>
                                        {statusColor[borrowById?.status_name].label}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6 max-h-[70vh] overflow-y-auto'>
                        <div className='space-y-6'>
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
                                        <p className='text-slate-700 text-base'>{borrowById?.borrow_code || 'ไม่มีรหัสคำขอ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">วัตถุประสงค์</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.purpose || 'ไม่ระบุวัตถุประสงค์'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">วันที่ยืม</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.borrow_date ? fmt(borrowById?.borrow_date) : 'ยังไม่ระบุวันที่ยืม'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">วันกำหนดคืน</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.expected_return_date ? fmt(borrowById?.expected_return_date) : 'ยังไม่ระบุวันกำหนดคืน'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">วันที่คืนจริง</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.actual_return_date ? fmt(borrowById?.actual_return_date) : 'ยังไม่ได้คืนครุภัณฑ์'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <FiUser size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลผู้ยืม</h2>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ชื่อจริง</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.first_name || 'ยังไม่ได้ระบุ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">นามสกุล</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.last_name || 'ยังไม่ได้ระบุ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">รหัสนิสิต</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.student_id || 'ยังไม่ได้ระบุ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">เบอร์โทรศัพท์</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.phone || 'ยังไม่ได้ระบุ'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <LiaExchangeAltSolid size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลการอนุมัติ / การคืน</h2>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">{borrowById?.status_name === 'rejected' ? 'ไม่อนุมัติเมื่อ' : 'อนุมัติเมื่อ'}</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.approved_at ? fmt(borrowById?.approved_at) : 'ยังไม่ได้อนุมัติ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">{borrowById?.status_name === 'rejected' ? 'ไม่อนุมัติโดย' : 'ผู้อนุมัติ'}</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.approver_name || 'ยังไม่ได้อนุมัติ'}</p>
                                    </div>
                                    {['rejected', 'cancelled'].includes(borrowById?.status_name) ? (
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-sm' htmlFor="">เหตุผลที่ไม่อนุมัติ / ยกเลิก</label>
                                            <p className='text-slate-700 text-base'>{borrowById?.rejection_reason || 'ยังไม่ได้ระบุ'}</p>
                                        </div>
                                    ) : (
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-sm' htmlFor="">หมายเหตุการอนุมัติ</label>
                                            <p className='text-slate-700 text-base'>{borrowById?.note || 'ยังไม่ได้ระบุ'}</p>
                                        </div>
                                    )}

                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">สภาพตอนคืน</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.return_condition || 'ยังไม่ได้ระบุ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">จำนวนค่าปรับ</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.penalty_amount || 'ยังไม่ได้ระบุ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">สถานะการชำระค่าปรับ</label>
                                        <p className='text-slate-700 text-base'>{borrowById?.penalty_paid || 'ยังไม่ได้ระบุ'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <BsBoxSeam size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลครุภัณฑ์</h2>
                                    </div>
                                </div>
                                {borrowById?.borrowed_items.map((item, index) => (
                                    <div key={index} className='grid grid-cols-2 gap-4'>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-sm' htmlFor="">ชื่อครุภัณฑ์</label>
                                            <p className='text-slate-700 text-base'>{item.equipment_name || 'ยังไม่ได้ระบุ'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-sm' htmlFor="">รหัสครุภัณฑ์</label>
                                            <p className='text-slate-700 text-base'>{item.equipment_code || 'ยังไม่ได้อนุมัติ'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-sm' htmlFor="">จำนวนที่ยืม</label>
                                            <p className='text-slate-700 text-base'>{item.quantity || 'ยังไม่ได้ระบุ'} รายการ</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-sm' htmlFor="">ยี่ห้อ</label>
                                            <p className='text-slate-700 text-base'>{item.brand || 'ยังไม่ได้ระบุ'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-sm' htmlFor="">รุ่น</label>
                                            <p className='text-slate-700 text-base'>{item.model || 'ยังไม่ได้ระบุ'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-sm' htmlFor="">หมายเลขซีเรียล</label>
                                            <p className='text-slate-700 text-base'>{item.serial_number || 'ยังไม่ได้ระบุ'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-sm' htmlFor="">สภาพครุภัณฑ์</label>

                                            <p className='text-slate-700 text-base'>{conditionNameTH[item.condition_status] || 'ยังไม่ได้ระบุ'}</p>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label className='text-gray-500 text-sm' htmlFor="">ประเภทครุภัณฑ์</label>
                                            <p className='text-slate-700 text-base'>{item.category_name || 'ยังไม่ได้ระบุ'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className=''>
                            {borrowById?.status_name && (
                                <>
                                    {renderStatusContent()}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {submitLoading && <SubmitLoading />}
            {borrowIdLoading && <SubmitLoading />}
        </div>
    )
}

/* 1. รายการที่รออนุมัติ */
export function BorrowRequest() {
    const [borrowModal, setBorrowModal] = useState(null);
    const [borrowRequest, setBorrowRequest] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const fetchBorrowRequest = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/borrow/pending', {
                params: {
                    page,
                    limit: itemsPerPage
                }
            });
            setBorrowRequest(response.data.data || []);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("fetch borrow request error:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchBorrowRequest(currentPage);
    }, [currentPage]);
    return (
        <div id="borrow-request">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่รออนุมัติ</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : borrowRequest.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอยืมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสการยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันกำหนดคืน
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการรายการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowRequest.map((borrow =>
                                    <tr key={borrow.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{borrow.borrow_code}</td>
                                        <td className='p-4'>{borrow.first_name} {borrow.last_name}</td>
                                        <td className='p-4'>{dayjs(borrow.borrow_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(borrow.expected_return_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-yellow-50 border border-yellow-200 text-yellow-700'>
                                                <div className='w-2 h-2 rounded-full bg-yellow-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{borrow.status_name && 'รอดำเนินการ'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setBorrowModal(borrow)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {borrowRequest.length > 0 && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-gray-600 space-x-1 text-sm">
                                    <span>แสดง</span> <span>
                                        {((currentPage - 1) * itemsPerPage) + 1}
                                    </span>
                                    <span>ถึง</span> <span>{Math.min(currentPage * itemsPerPage, totalItems)}</span>
                                    <span>จาก</span> <span>{totalItems}</span> <span>รายการ</span>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                }

            </div>
            {
                borrowModal && (
                    <BorrowRequestModal refresh={fetchBorrowRequest} borrow={borrowModal} onClose={() => setBorrowModal(null)} />
                )
            }
        </div>
    )
}

/* 2. รายการที่กำลังยืม */
export function BorrowingRequest() {
    const [borrowingModal, setBorrowingModal] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const statusColor = {
        'active': {
            bg: 'bg-blue-50 border border-blue-200',
            dot: 'bg-blue-500',
            text: 'text-blue-700',
            label: 'กำลังยืม'
        }
    };
    const [borrowingRequest, setBorrowingRequest] = useState([]);
    const fetchBorrowingRequest = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/borrow/active',
                {
                    params: {
                        page,
                        limit: itemsPerPage
                    }
                }
            );
            setBorrowingRequest(response.data.data || []);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("fetch borrow active error:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchBorrowingRequest(currentPage);
    }, [currentPage]);
    return (
        <div id="borrowing-request">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่กำลังยืม</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : borrowingRequest.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอยืมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสการยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันกำหนดคืน
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการรายการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowingRequest.map((borrow =>
                                    <tr key={borrow.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{borrow.borrow_code}</td>
                                        <td className='p-4'>{borrow.first_name} {borrow.last_name}</td>
                                        <td className='p-4'>{dayjs(borrow.borrow_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(borrow.expected_return_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            {statusColor[borrow.status_name] && (
                                                <div className={`inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${statusColor[borrow.status_name].bg} ${statusColor[borrow.status_name].text}`}>
                                                    <div className={`w-2 h-2 rounded-full ${statusColor[borrow.status_name].dot}`}></div>
                                                    <span className="text-xs font-medium tracking-wide">
                                                        {statusColor[borrow.status_name].label}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setBorrowingModal(borrow)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {borrowingRequest.length > 0 && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-gray-600 space-x-1 text-sm">
                                    <span>แสดง</span> <span>
                                        {((currentPage - 1) * itemsPerPage) + 1}
                                    </span>
                                    <span>ถึง</span> <span>{Math.min(currentPage * itemsPerPage, totalItems)}</span>
                                    <span>จาก</span> <span>{totalItems}</span> <span>รายการ</span>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                }

            </div>
            {
                borrowingModal && (
                    <BorrowRequestModal refresh={fetchBorrowingRequest} borrow={borrowingModal} onClose={() => setBorrowingModal(null)} />
                )
            }
        </div>
    )
}

// export function BorrowingRequestModal({ borrow, onClose }) {
//     useEffect(() => {
//         document.body.style.overflow = 'hidden';
//         return () => { document.body.style.overflow = 'auto'; };
//     }, []);
//     const statusColor = {
//         'กำลังยืม': {
//             bg: 'bg-[#DBEAFE]',
//             border: 'border-[#60A5FA]',
//             dot: 'bg-[#3B82F6]',
//             text: 'text-[#1D4ED8]',
//             label: 'กำลังยืม'
//         },
//         'เกินกำหนด': {
//             bg: 'bg-[#FEE2E2]',
//             border: 'border-[#F87171]',
//             dot: 'bg-[#d9534f]',
//             text: 'text-[#DC2626]',
//             label: 'เกินกำหนด'
//         }
//     };
//     return (
//         <div id="borrowing-request-modal">
//             <div className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
//                 <div className="tracking-[.5px] min-w-[400px] max-w-[1200px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
//                     <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
//                         <div className='flex items-center gap-x-4'>
//                             <h2 className='text-[18px] font-bold text-[#4E5155]'>รายละเอียดการยืมครุภัณฑ์</h2>
//                             {statusColor[borrow.status] && (
//                                 <div className={`flex items-center gap-x-2 w-fit rounded-[5px] px-3 py-1 ${statusColor[borrow.status].bg}`}>
//                                     <div className={`size-[7px] rounded-full ${statusColor[borrow.status].dot}`}></div>
//                                     <span className={`cursor-default ${statusColor[borrow.status].text} text-[13px]`}>
//                                         {statusColor[borrow.status].label}
//                                     </span>
//                                 </div>
//                             )}
//                         </div>
//                         <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
//                             <RxCross2 size={20} color='#454545' />
//                         </button>
//                     </div>
//                     <div className='px-6'>
//                         <form action="">
//                             <div className='grid grid-cols-[2fr_1fr_1fr] gap-x-6'>
//                                 <div className='border-r border-[#E0E0E0] pr-6 text-[15px]'>
//                                     <div className='grid grid-cols-3 gap-x-4'>
//                                         <div className='flex flex-col gap-y-2 mb-4'>
//                                             <label htmlFor="borrowRequestId">รหัสการยืม</label>
//                                             <input
//                                                 className='text-[#4E5155] border border-gray-300 bg-[#f5f5f5] rounded-[5px] px-3 py-2 focus:outline-none'
//                                                 placeholder='รหัสการยืม'
//                                                 type="text"
//                                                 id="borrowRequestId"
//                                                 name="borrowRequestId"
//                                                 readOnly
//                                                 value={borrow.borrowId}
//                                             />
//                                         </div>
//                                         <div className='flex flex-col gap-y-2 mb-4'>
//                                             <label htmlFor="studentId">รหัสนิสิต</label>
//                                             <input
//                                                 className='text-[#4E5155] border border-gray-300 bg-[#f5f5f5] rounded-[5px] px-3 py-2 focus:outline-none'
//                                                 placeholder='รหัสนิสิต'
//                                                 type="text"
//                                                 id="studentId"
//                                                 name="studentId"
//                                                 readOnly
//                                                 value={borrow.studentId}
//                                             />
//                                         </div>
//                                         <div className='flex flex-col gap-y-2 mb-4'>
//                                             <label htmlFor="equipmentName">ชื่อผู้ยืม</label>
//                                             <input
//                                                 className='text-[#4E5155] border border-gray-300 bg-[#f5f5f5] rounded-[5px] px-3 py-2 focus:outline-none'
//                                                 placeholder='ชื่อผู้ยืม'
//                                                 type="text"
//                                                 id="borrowerName"
//                                                 name="borrowerName"
//                                                 readOnly
//                                                 value={`${borrow.firstName} ${borrow.lastName}`}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className='grid grid-cols-2 gap-x-4'>
//                                         <div className='flex flex-col gap-y-2 mb-4'>
//                                             <label htmlFor="borrowDate">วันที่ยืม</label>
//                                             <input
//                                                 className='text-[#4E5155] border border-gray-300 bg-[#f5f5f5] rounded-[5px] px-3 py-2 focus:outline-none'
//                                                 placeholder='วันที่ยืม'
//                                                 type="text"
//                                                 id="borrowDate"
//                                                 name="borrowDate"
//                                                 readOnly
//                                                 value={borrow.borrowDate}
//                                             />
//                                         </div>
//                                         <div className='flex flex-col gap-y-2 mb-4'>
//                                             <label htmlFor="returnDate">วันกำหนดคืน</label>
//                                             <input
//                                                 className='text-[#4E5155] border border-gray-300 bg-[#f5f5f5] rounded-[5px] px-3 py-2 focus:outline-none'
//                                                 placeholder='วันกำหนดคืน'
//                                                 type="text"
//                                                 id="returnDate"
//                                                 name="returnDate"
//                                                 readOnly
//                                                 value={borrow.returnDate}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div className='flex flex-col gap-y-2 mb-2'>
//                                             <label htmlFor="borrowDesc">วัตถุประสงค์การยืม</label>
//                                             <textarea
//                                                 className='text-[#4E5155] border border-gray-300 bg-[#f5f5f5] rounded-[5px] px-3 py-2 focus:outline-none'
//                                                 placeholder='ใช้ในการประชุม'
//                                                 type="text"
//                                                 id="borrowDesc"
//                                                 name="borrowDesc"
//                                                 readOnly
//                                                 value={borrow.purpose}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className='border-r border-[#E0E0E0] pr-6 text-[15px]'>
//                                     <div className='flex flex-col gap-y-2 mb-2'>
//                                         <label htmlFor="equipmentName">รายการครุภัณฑ์</label>
//                                         <div className='border border-[#E0E0E0] rounded-[5px] px-4 shadow-[0px_0px_10px_#00000014] h-[245px] overflow-y-auto'>
//                                             {borrow.items.map((item, index) => (
//                                                 <div key={index} className=' text-[#4E5155] flex justify-between items-center border-b border-[#E0E0E0] py-4 last:border-b-0'>
//                                                     <p>{item.name}</p>
//                                                     <p>x {item.quantity}</p>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className='flex flex-col justify-between text-[15px]'>
//                                     <div className='flex flex-col gap-y-2 mb-4'>
//                                         <label htmlFor="noted">สภาพตอนคืนครุภัณฑ์</label>
//                                         <Select
//                                             placeholder='กรุณาเลือก'
//                                             options={[
//                                                 { value: 'ดี', label: 'ดี' },
//                                                 { value: 'ชำรุดเล็กน้อย', label: 'ชำรุดเล็กน้อย' },
//                                                 { value: 'ชำรุดมาก', label: 'ชำรุดมาก' },
//                                             ]}
//                                         />
//                                     </div>
//                                     <div className='flex justify-end gap-x-4 text-[15px]'>
//                                         <button onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#e5e7e9] text-[#454545] duration-200 hover:bg-[#cacfd2]' >
//                                             ยกเลิก
//                                         </button>
//                                         <button className=' cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] '>
//                                             คืนครุภัณฑ์
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

/* 3. รายการที่คืนแล้ว */
export function BorrowReturn() {
    const [borrowReturnModal, setBorrowReturnModal] = useState(null);
    const [borrowReturn, setBorrowReturn] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [loading, setLoading] = useState(true);
    const fetchBorrowReturn = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/borrow/returned',
                { params: { page, limit: itemsPerPage } }
            );
            setBorrowReturn(response.data.data || []);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("fetch borrow returned error:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchBorrowReturn(currentPage);
    }, [currentPage]);
    return (
        <div id="borrow-return-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการคืนครุภัณฑ์แล้ว</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : borrowReturn.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอยืมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสการยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันกำหนดคืน
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการรายการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowReturn.map((borrow =>
                                    <tr key={borrow.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{borrow.borrow_code}</td>
                                        <td className='p-4'>{borrow.first_name} {borrow.last_name}</td>
                                        <td className='p-4'>{dayjs(borrow.borrow_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(borrow.expected_return_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-green-50 border border-green-200 text-green-700'>
                                                <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{borrow.status_name && 'คืนแล้ว'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setBorrowReturnModal(borrow)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {borrowReturn.length > 0 && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-gray-600 space-x-1 text-sm">
                                    <span>แสดง</span> <span>
                                        {((currentPage - 1) * itemsPerPage) + 1}
                                    </span>
                                    <span>ถึง</span> <span>{Math.min(currentPage * itemsPerPage, totalItems)}</span>
                                    <span>จาก</span> <span>{totalItems}</span> <span>รายการ</span>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                }

            </div>
            {/* {
                borrowModal && (
                    <BorrowRequestModal borrow={borrowModal} onClose={() => setBorrowModal(null)} />
                )
            } */}
            {
                borrowReturnModal && (
                    <BorrowRequestModal borrow={borrowReturnModal} onClose={() => setBorrowReturnModal(null)} />
                )
            }
        </div >
    )
}

/* เดี๋ยวทำ */
// export function BorrowReturnModal({ borrow, onClose }) {
// }

/* 4. รายการที่ไม่อนุมัติ */
export function BorrowReject() {
    const [borrowRejectModal, setBorrowRejectModal] = useState(null);
    const [borrowReject, setBorrowReject] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const fetchBorrowReject = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/borrow/rejected',
                { params: { page, limit: itemsPerPage } }
            );
            setBorrowReject(response.data.data || []);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("fetch borrow reject error:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchBorrowReject(currentPage);
    }, [currentPage]);
    return (
        <div id="borrow-reject-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่ไม่อนุมัติ</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : borrowReject.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอยืมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสการยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันกำหนดคืน
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการรายการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowReject.map((borrow =>
                                    <tr key={borrow.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{borrow.borrow_code}</td>
                                        <td className='p-4'>{borrow.first_name} {borrow.last_name}</td>
                                        <td className='p-4'>{dayjs(borrow.borrow_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(borrow.expected_return_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-red-50 border border-red-200 text-red-700'>
                                                <div className='w-2 h-2 rounded-full bg-red-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{borrow.status_name && 'ไม่อนุมัติ'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setBorrowRejectModal(borrow)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {borrowReject.length > 0 && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-gray-600 space-x-1 text-sm">
                                    <span>แสดง</span> <span>
                                        {((currentPage - 1) * itemsPerPage) + 1}
                                    </span>
                                    <span>ถึง</span> <span>{Math.min(currentPage * itemsPerPage, totalItems)}</span>
                                    <span>จาก</span> <span>{totalItems}</span> <span>รายการ</span>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                }

            </div>
            {/* {
                borrowCancelModal && (
                    <BorrowCancelModal borrow={borrowCancelModal} onClose={() => setBorrowCancelModal(null)} />
                )
            } */}
            {borrowRejectModal && (
                <BorrowRequestModal borrow={borrowRejectModal} onClose={() => setBorrowRejectModal(null)} />
            )}
        </div>
    )
}

/* 5. รายการทั้งหมด */
export function BorrowHistory() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [borrowHistoryModal, setBorrowHistoryModal] = useState(null);
    const [loading, setLoading] = useState(true);
    const statusColor = {
        'pending_approval': {
            bg: 'bg-yellow-50 border border-yellow-200',
            dot: 'bg-yellow-500',
            text: 'text-yellow-700',
            label: 'รอดำเนินการ'
        },
        'cancelled': {
            bg: 'bg-gray-50 border border-gray-200',
            dot: 'bg-gray-500',
            text: 'text-gray-700',
            label: 'ยกเลิก'
        },
        'approved': {
            bg: 'bg-green-50 border border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'อนุมัติ'
        },
        'active': {
            bg: 'bg-blue-50 border border-blue-200',
            dot: 'bg-blue-500',
            text: 'text-blue-700',
            label: 'กำลังยืม'
        },
        'overdue': {
            bg: 'bg-red-50 border border-red-200',
            dot: 'bg-red-500',
            text: 'text-red-700',
            label: 'เกินกำหนด'
        },
        'rejected': {
            bg: 'bg-red-50 border border-red-200',
            dot: 'bg-red-500',
            text: 'text-red-700',
            label: 'ไม่อนุมัติ'
        },
        'returned': {
            bg: 'bg-green-50 border border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'คืนแล้ว'
        },
    };
    const [borrowAllRequest, setBorrowAllRequest] = useState([]);
    const fetchBorrowAllRequest = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/borrow',
                { params: { page, limit: itemsPerPage } }
            );
            setBorrowAllRequest(response.data.data);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("fetch borrow all error:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchBorrowAllRequest(currentPage);
    }, [currentPage]);
    return (
        <div id="borrow-history-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>ประวัติรายการทั้งหมด</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : borrowAllRequest.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอยืมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสการยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันกำหนดคืน
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการรายการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowAllRequest.map((borrow =>
                                    <tr key={borrow.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{borrow.borrow_code}</td>
                                        <td className='p-4'>{borrow.first_name} {borrow.last_name}</td>
                                        <td className='p-4'>{dayjs(borrow.borrow_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(borrow.expected_return_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            {statusColor[borrow.status_name] && (
                                                <div className={`inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm w-[115px] font-medium transition-all duration-200 ${statusColor[borrow.status_name].bg} ${statusColor[borrow.status_name].text}`}>
                                                    <div className={`w-2 h-2 rounded-full ${statusColor[borrow.status_name].dot}`}></div>
                                                    <span className="text-xs font-medium tracking-wide">
                                                        {statusColor[borrow.status_name].label}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setBorrowHistoryModal(borrow)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {borrowAllRequest.length > 0 && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-gray-600 space-x-1 text-sm">
                                    <span>แสดง</span> <span>
                                        {((currentPage - 1) * itemsPerPage) + 1}
                                    </span>
                                    <span>ถึง</span> <span>{Math.min(currentPage * itemsPerPage, totalItems)}</span>
                                    <span>จาก</span> <span>{totalItems}</span> <span>รายการ</span>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>

                }

            </div>
            {/* {
                borrowHistoryModal && (
                    <BorrowHistoryModal borrow={borrowHistoryModal} onClose={() => setBorrowHistoryModal(null)} />
                )
            } */}
            {borrowHistoryModal && (
                <BorrowRequestModal refresh={fetchBorrowAllRequest} borrow={borrowHistoryModal} onClose={() => setBorrowHistoryModal(null)} />
            )}
        </div>
    )
}

/* 6. อนุมัติแล้ว */
export function BorrowApproved() {
    const [borrowApprovedModal, setBorrowApprovedModal] = useState(null);
    const [borrowApproved, setBorrowApproved] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const fetchBorrowApproved = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/borrow/approved', {
                params: { page, limit: itemsPerPage }
            });
            setBorrowApproved(response.data.data);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("fetch borrow approved error:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchBorrowApproved(currentPage);
    }, [currentPage]);

    return (
        <div id="borrow-approved-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่อนุมัติแล้ว</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : borrowApproved.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอยืมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสการยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันกำหนดคืน
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการรายการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowApproved.map((borrow =>
                                    <tr key={borrow.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{borrow.borrow_code}</td>
                                        <td className='p-4'>{borrow.first_name} {borrow.last_name}</td>
                                        <td className='p-4'>{dayjs(borrow.borrow_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(borrow.expected_return_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-green-50 border border-green-200 text-green-700'>
                                                <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{borrow.status_name && 'อนุมัติ'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setBorrowApprovedModal(borrow)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {borrowApproved.length > 0 && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-gray-600 space-x-1 text-sm">
                                    <span>แสดง</span> <span>
                                        {((currentPage - 1) * itemsPerPage) + 1}
                                    </span>
                                    <span>ถึง</span> <span>{Math.min(currentPage * itemsPerPage, totalItems)}</span>
                                    <span>จาก</span> <span>{totalItems}</span> <span>รายการ</span>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>


                }
            </div>
            {borrowApprovedModal && (
                <BorrowRequestModal refresh={fetchBorrowApproved} borrow={borrowApprovedModal} onClose={() => setBorrowApprovedModal(null)} />
            )}
        </div>
    )
}

/* 7. รายการเกินกำหนดคืน */
export function BorrowOverdue() {
    const [borrowOverdueModal, setBorrowOverdueModal] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const statusColor = {
        'overdue': {
            bg: 'bg-red-50 border border-red-200',
            dot: 'bg-red-500',
            text: 'text-red-700',
            label: 'เกินกำหนด'
        }
    };
    const [borrowOverdue, setBorrowOverdue] = useState([]);
    const fetchBorrowOverdue = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/borrow/overdue', {
                params: { page, limit: itemsPerPage }
            });
            setBorrowOverdue(response.data.data);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("fetch borrow overdue error:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBorrowOverdue(currentPage);
    }, [currentPage]);
    return (
        <div id="borrow-overdue-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการเกินกำหนดคืน</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : borrowOverdue.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอยืมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสการยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันกำหนดคืน
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการรายการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowOverdue.map((borrow =>
                                    <tr key={borrow.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{borrow.borrow_code}</td>
                                        <td className='p-4'>{borrow.first_name} {borrow.last_name}</td>
                                        <td className='p-4'>{dayjs(borrow.borrow_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(borrow.expected_return_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            {statusColor[borrow.status_name] && (
                                                <div className={`inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${statusColor[borrow.status_name].bg} ${statusColor[borrow.status_name].text}`}>
                                                    <div className={`w-2 h-2 rounded-full ${statusColor[borrow.status_name].dot}`}></div>
                                                    <span className="text-xs font-medium tracking-wide">
                                                        {statusColor[borrow.status_name].label}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setBorrowOverdueModal(borrow)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {borrowOverdue.length > 0 && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-gray-600 space-x-1 text-sm">
                                    <span>แสดง</span> <span>
                                        {((currentPage - 1) * itemsPerPage) + 1}
                                    </span>
                                    <span>ถึง</span> <span>{Math.min(currentPage * itemsPerPage, totalItems)}</span>
                                    <span>จาก</span> <span>{totalItems}</span> <span>รายการ</span>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                }

            </div>
            {borrowOverdueModal && (
                <BorrowRequestModal refresh={fetchBorrowOverdue} borrow={borrowOverdueModal} onClose={() => setBorrowOverdueModal(null)} />
            )}
        </div>
    )
}

/* 8. ยกเลิก */
export function BorrowCancelled() {
    const [borrowCancelledModal, setBorrowCancelledModal] = useState(null);
    const [borrowCancelled, setBorrowCancelled] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const fetchBorrowCancelled = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/borrow/cancelled', {
                params: {
                    page,
                    limit: itemsPerPage
                }
            });
            setBorrowCancelled(response.data.data);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("fetch borrow cancelled error:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchBorrowCancelled(currentPage);
    }, [currentPage]);
    return (
        <div id="borrow-cancelled-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่ยกเลิก</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : borrowCancelled.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอยืมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสการยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่ยืม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันกำหนดคืน
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการรายการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowCancelled.map((borrow =>
                                    <tr key={borrow.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{borrow.borrow_code}</td>
                                        <td className='p-4'>{borrow.first_name} {borrow.last_name}</td>
                                        <td className='p-4'>{dayjs(borrow.borrow_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(borrow.expected_return_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-50 border border-gray-200 text-gray-700'>
                                                <div className='w-2 h-2 rounded-full bg-gray-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{borrow.status_name && 'ยกเลิก'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setBorrowCancelledModal(borrow)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                        {borrowCancelled.length > 0 && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-gray-600 space-x-1 text-sm">
                                    <span>แสดง</span> <span>
                                        {((currentPage - 1) * itemsPerPage) + 1}
                                    </span>
                                    <span>ถึง</span> <span>{Math.min(currentPage * itemsPerPage, totalItems)}</span>
                                    <span>จาก</span> <span>{totalItems}</span> <span>รายการ</span>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                }
            </div>
            {borrowCancelledModal && (
                <BorrowRequestModal borrow={borrowCancelledModal} onClose={() => setBorrowCancelledModal(null)} />
            )}
        </div>
    )
}