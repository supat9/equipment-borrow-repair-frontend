'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { AiOutlineScan } from "react-icons/ai";
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendar3 } from "react-icons/bs";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import DateTimePicker from '@/components/inputs/DateTimePicker';
import Spinner from '@/components/users/loading/Spinner';
import { DateTime } from 'luxon';

export function InstallModal({ onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const showSubmitAlert = () => {
        return Swal.fire({
            title: 'ยืนยันคำขอแจ้งติดตั้ง?',
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
            text: 'ส่งคำขอนัดหมายเรียบร้อยแล้ว',
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
            text: 'ไม่สามารถส่งคำขอได้ กรุณาลองใหม่อีกครั้ง',
            icon: 'error',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#d33'
        });
    };
    const showWarningAlert = () => {
        return Swal.fire({
            title: 'ไม่สามารถส่งคำขอติดตั้งได้',
            text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            icon: 'warning',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#FFC107',
            customClass: {
                container: 'z-[10000]',
            }
        });
    }
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(null);
    const [computer, setComputer] = useState('');
    const [description, setDescription] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    // จำกัด 10:00–16:00
    const minTime = new Date();
    minTime.setHours(10, 0, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(16, 0, 0, 0);
    const showAlertByStatus = async (status, message) => {
        let icon = "error";
        let color = "#d33"; // default: error red
        let text = message || "เกิดข้อผิดพลาด";
        if (status === 400) {
            icon = "warning";
            color = "#FFC107"; // yellow
            text = message || "กรุณากรอกข้อมูลให้ครบถ้วน";
        } else if (status === 404) {
            icon = "info";
            color = "#2196F3"; // blue
            text = message || "ไม่พบข้อมูลที่คุณค้นหา";
        } else if (status === 500) {
            icon = "error";
            color = "#d33"; // red
            text = message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์";
        }

        await Swal.fire({
            title: "ไม่สามารถส่งคำขอได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const handleSubmit = async (e) => {
        setSubmitLoading(true);
        try {
            e.preventDefault();
            // if (!computer || !description || !selectedDate) return await showWarningAlert();
            // const appointmentDate = selectedDate ? selectedDate.toISOString() : null;
            const appointmentDate = selectedDate ? DateTime.fromJSDate(selectedDate).setZone('Asia/Bangkok').toISO() : null;
            if (computer && description && selectedDate) {
                const comfirmed = await showSubmitAlert();
                if (!comfirmed.isConfirmed) return;
            }
            const response = await axios.post('/api/users/request', { computer: computer.trim(), description: description.trim(), appointmentDate });
            const result = response.data;
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result.message || 'ส่งคำขอนัดหมายเรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1BC688',
                customClass: {
                    container: 'z-[10000]'
                }
            });
            onClose();
            router.push('/users/request-list');
        } catch (error) {
            console.error("Install request error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }

    }
    return (
        <div id="install-modal">
            <div className="px-4 sm:px-0 fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[300px] max-w-[600px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-base sm:text-lg font-bold text-[#4E5155]'>แบบฟอร์มขอนัดติดตั้งโปรแกรม</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <form onSubmit={handleSubmit} action="" className='tracking-[.5px]'>
                            {/* <div className='grid grid-cols-2 gap-x-4'>
                                <div className='flex flex-col gap-y-3 mb-6'>
                                    <label htmlFor="">ชื่อผู้ขอ</label>
                                    <div className='flex items-center gap-x-2'>
                                        <input readOnly className='text-[#4E5155] w-full border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-[#1BC688]' type="text" value={'สมเกียรติ ช่วยเกิด'} />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-y-3 mb-6'>
                                    <label htmlFor="">เบอร์ติดต่อ</label>
                                    <div className='flex items-center gap-x-2'>
                                        <input className='text-[#4E5155] w-full border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-[#1BC688]' type="text" placeholder='เบอร์โทรศัพท์' />
                                    </div>
                                </div>
                            </div> */}
                            <div className='flex flex-col gap-y-3 mb-6'>
                                <label className='text-gray-700 text-sm md:text-base' htmlFor="computer">รหัสคอมพิวเตอร์ / อุปกรณ์ (ถ้ามี)</label>
                                <div className='flex items-center gap-x-2'>
                                    <input
                                        onChange={(e) => setComputer(e.target.value)} value={computer} id='computer' autoFocus className='text-gray-700 w-full text-sm md:text-base border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-[#1BC688]' type="text" placeholder='เช่น COM - 0123' />
                                </div>
                            </div>
                            <div className='flex flex-col gap-y-3 mb-6'>
                                <label className='text-gray-700 text-sm md:text-base' htmlFor="description">โปรแกรมที่ต้องการติดตั้ง</label>
                                <div className='flex items-center gap-x-2'>
                                    <textarea
                                        onChange={(e) => setDescription(e.target.value)} value={description} id='description' className='text-gray-700 w-full text-sm md:text-base border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-[#1BC688]' type="text" placeholder='ระบุชื่อโปรแกรมและเวอร์ชันที่ต้องการ' />
                                </div>
                            </div>
                            <div className='flex flex-col gap-y-3 mb-6'>
                                <label className='text-gray-700 text-sm md:text-base' htmlFor="">วันและเวลาที่สะดวก</label>
                                <DateTimePicker
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    placeholderText='เลือกวันและเวลาที่สะดวก'
                                    minTime={minTime}
                                    maxTime={maxTime}
                                />
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button type='button' onClick={onClose} className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ยกเลิก</button>
                                <button type='submit' className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] '>ส่งคำขอนัดหมาย</button>
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