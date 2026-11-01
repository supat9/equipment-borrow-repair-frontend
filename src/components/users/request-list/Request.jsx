'use client';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AiFillInfoCircle } from "react-icons/ai";
import dayjs from 'dayjs';
import Spinner from '@/components/users/loading/Spinner.jsx';
import { FaLayerGroup } from "react-icons/fa6";
import { RxCross2 } from 'react-icons/rx';
import Swal from 'sweetalert2';
import { GoClock } from "react-icons/go";


/* 1. รออนุมัติ */
export function MyInstallRequest() {
    const [waitingRequests, setWaitingRequests] = useState([]);
    const [cancelledRequestsModal, setCancelledRequestsModal] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchWaitingRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/request/waiting');
            setWaitingRequests(response.data);
        } catch (error) {
            console.error("Error fetching waiting requests:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchWaitingRequests();
    }, [fetchWaitingRequests]);

    return (
        <div id="MyInstallRequest">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่รออนุมัติ</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันเวลานัดหมาย</p>
                </div>
            </div>
            <div>
                {loading ? <div className='h-[180px] flex justify-center items-center'>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <Spinner />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                    </div>
                </div> : waitingRequests.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                    <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                </div> : <>
                    {waitingRequests.map(req => (
                        <div key={req.id} className='border-l-7 border-l-[#FACC15] border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6'>
                            {/* Desktop Layout */}
                            <div className='hidden sm:block'>
                                <div className='mb-3 pb-3 flex justify-between items-start border-b border-[#E0E0E0]'>
                                    <div className='space-y-2'>
                                        <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                        <div className='flex text-gray-400 text-xs sm:text-sm'>
                                            {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                            <div className='flex items-center gap-x-2'>
                                                <GoClock size={20} />
                                                <p className=''>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-x-2 bg-[#FEF9C3] w-fit rounded-md px-4 py-1 '>
                                        <div className='size-[7px] rounded-[50%] bg-[#EAB308]'></div>
                                        <span className='cursor-default text-[#B45309] text-[13px]'>{req.status_name && 'รอดำเนินการ'}</span>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <div className=' space-y-2'>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                    </div>
                                    <div className='flex flex-col justify-end'>
                                        <button onClick={() => setCancelledRequestsModal(req)}
                                        className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#d9534f] text-white transition-all duration-200 hover:bg-[#DC2626] hover:scale-105 shadow-md'>
                                        <RxCross2 size={18} />
                                    </button>
                                    </div>
                                </div>
                            </div>
                            {/* Mobile Layout */}
                            <div className='sm:hidden'>
                                <div className='mb-3 pb-4 flex flex-col space-y-2 items-start border-b border-[#E0E0E0]'>
                                    <div className='space-y-2'>
                                        <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                        <div className='flex text-gray-400 text-xs sm:text-sm'>
                                            {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                            <div className='flex items-center gap-x-2'>
                                                <GoClock className='size-4' />
                                                <p className='text-xs sm:text-base'>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-x-2 bg-[#FEF9C3] w-fit rounded-full px-2 py-1 '>
                                        <div className='size-[7px] rounded-[50%] bg-[#EAB308]'></div>
                                        <span className='cursor-default text-[#B45309] text-xs sm:text-sm'>{req.status_name && 'รอดำเนินการ'}</span>
                                    </div>
                                </div>
                                <div className='flex justify-between gap-2'>
                                    <div className=' space-y-2'>
                                        <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                        <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                        <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                    </div>
                                    <div className='flex flex-col justify-end'>
                                        <button onClick={() => setCancelledRequestsModal(req)}
                                            className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-full bg-[#d9534f] text-white transition-all duration-200 hover:bg-[#DC2626] hover:scale-105 shadow-md'>
                                            <RxCross2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}</>}
            </div>
            {cancelledRequestsModal && (
                <CancelledRequestsModal request={cancelledRequestsModal} refresh={fetchWaitingRequests} onClose={() => setCancelledRequestsModal(null)} />
            )}
        </div >
    )
}

export function CancelledRequestsModal({ request, refresh, onClose }) {
    const showSubmitAlert = () => {
        return Swal.fire({
            title: 'ยืนยันการยกเลิก?',
            text: 'การดำเนินการนี้ไม่สามารถย้อนกลับได้',
            icon: 'warning',
            confirmButtonText: 'ยืนยัน',
            confirmButtonColor: '#d9534f',
            showCancelButton: true,
            cancelButtonColor: '#6B7280',
            cancelButtonText: 'ปิด',
            customClass: {
                container: 'z-[10000]'
            }
        });
    };
    const showSuccessAlert = () => {
        return Swal.fire({
            title: 'สำเร็จ!',
            text: 'ยกเลิกรายการแจ้งติดตั้งเรียบร้อยแล้ว',
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
    const showAlertByStatus = async (status, message) => {
        let icon = "error";
        let color = "#d33"; // default: error red
        let text = message || "เกิดข้อผิดพลาด";
        if (status === 400) {
            icon = "warning";
            color = "#FFC107"; // yellow
            text = message || "กรุณากรอกข้อมูลให้ครบถ้วน";
        } else if (status === 500) {
            icon = "error";
            color = "#d33"; // red
            text = message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์";
        }

        await Swal.fire({
            title: "ไม่สามารถยกเลิกได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [comment, setComment] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const handleSubmit = async (e) => {
        setSubmitLoading(true);
        try {
            e.preventDefault();
            // if (!comment) return await showWarningAlert();
            const id = request.id;
            if (id && comment) {
                const confirmed = await showSubmitAlert();
                if (!confirmed.isConfirmed) return;
            }
            const response = await axios.post('/api/users/request/cancelled', { id, comment: comment.trim() });
            const result = response.data;
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result.message || 'ยกเลิกรายการแจ้งติดตั้งเรียบร้อยแล้ว',
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
            console.error("Cancelled request error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="user-cancelled-requests-modal">
            <div className="px-4 lg:px-0 fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[300px] max-w-[600px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>ข้อมูลการยกเลิกคำขอ</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <div className='text-[#4E5155] border-b border-[#E0E0E0] pb-4 mb-4'>
                            <h2 className='flex gap-2 text-sm sm:text-base'>รหัสคำขอ : <span className='font-semibold text-red-400 tracking-[1px]'>{request.request_code}</span></h2>
                        </div>
                        <form onSubmit={handleSubmit} action="">
                            <div className='flex flex-col gap-y-3 mb-6'>
                                <label className='text-gray-600 text-sm md:text-base' htmlFor="comment">เหตุผลที่ยกเลิก</label>
                                <div className='flex items-center gap-x-2'>
                                    <textarea onChange={(e) => setComment(e.target.value)} value={comment} id='comment' className='text-sm md:text-base text-gray-600 w-full border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-[#1BC688]' type="text" placeholder='ไม่ต้องการติดตั้งโปรแกรมแล้ว' />
                                </div>
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button type='button' onClick={onClose} className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 text-[15px] bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ยกเลิก</button>
                                <button type='submit' className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 bg-[#d9534f] text-white duration-200 hover:bg-[#DC2626] '>ยืนยัน</button>
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

/* 2. อนุมัติแล้ว */
export function MyInstallApproved() {
    const [confirmedRequests, setConfirmedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchConfirmedRequests = async () => {
            try {
                const response = await axios.get('/api/users/request/confirmed');
                setConfirmedRequests(response.data);
            } catch (error) {
                console.error("Error fetching confirmed requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfirmedRequests();
    }, []);
    return (
        <div id="MyInstallApproved">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่อนุมัติแล้ว</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> กรุณาติดต่อเจ้าหน้าที่หากต้องการข้อมูลเพิ่มเติม</p>
                </div>
            </div>
            <div>
                {loading ? <div className='h-[180px] flex justify-center items-center'>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <Spinner />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                    </div>
                </div> : confirmedRequests.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                    <p className='text-[14px] text-[#9CA3AF]'>ขณะนี้ยังไม่มีรายการที่ได้รับการอนุมัติ</p>
                </div> : <>
                    {confirmedRequests.map(req => (
                        <div key={req.id} className='border-l-7 border-l-[#34D399] border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6'>
                            {/* Desktop Layout */}
                            <div className='hidden sm:block'>
                                <div className='mb-3 pb-3 flex justify-between items-start border-b border-[#E0E0E0]'>
                                    <div className='space-y-2'>
                                        <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                        <div className='flex text-gray-400 text-xs sm:text-sm'>
                                            {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                            <div className='flex items-center gap-x-2'>
                                                <GoClock size={20} />
                                                <p className=''>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-x-2 bg-[#D1FAE5] w-fit rounded-md px-4 py-1 '>
                                        <div className='size-[7px] rounded-[50%] bg-[#10B981]'></div>
                                        <span className='cursor-default text-[#059669] text-[13px]'>{req.status_name && 'อนุมัติ'}</span>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='space-y-2'>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>หมายเหตุ :</span> {req.comment || 'ไม่ได้ระบุไว้'}</p>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย :</span> {req.updated_by_name}</p>
                                    </div>
                                    <div className='flex flex-col justify-end'>
                                        {/* <button className='flex gap-x-2 items-center cursor-pointer rounded-[5px] text-[14px] px-3 py-2 bg-[#d9534f] text-white duration-200 hover:bg-[#DC2626] '>
                                        <span>ยกเลิก</span>
                                    </button> */}
                                    </div>
                                </div>
                            </div>
                            {/* Mobile Layout */}
                            <div className='sm:hidden'>
                                <div className='mb-3 pb-4 flex flex-col space-y-2 items-start border-b border-[#E0E0E0]'>
                                    <div className='space-y-2'>
                                        <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                        <div className='flex text-gray-400 text-xs sm:text-sm'>
                                            {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                            <div className='flex items-center gap-x-2'>
                                                <GoClock className='size-4' />
                                                <p className='text-xs sm:text-base'>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-x-2 bg-[#D1FAE5] w-fit rounded-full px-2 py-1 '>
                                        <div className='size-[7px] rounded-[50%] bg-[#10B981]'></div>
                                        <span className='cursor-default text-[#059669] text-xs sm:text-sm'>{req.status_name && 'อนุมัติ'}</span>
                                    </div>
                                </div>
                                <div className='flex justify-between gap-2'>
                                    <div className='space-y-2'>
                                        <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                        <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                        <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                        <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>หมายเหตุ :</span> {req.comment || 'ไม่ได้ระบุไว้'}</p>
                                        <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย :</span> {req.updated_by_name}</p>
                                    </div>
                                    <div className='flex flex-col justify-end'>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}</>}
            </div>
        </div>
    )
}

/* 3. ไม่อนุมัติ */
export function MyInstallRejected() {
    const [rejectedRequests, setRejectedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchRejectedRequests = async () => {
            try {
                const response = await axios.get('/api/users/request/rejected');
                setRejectedRequests(response.data);
            } catch (error) {
                console.error("Error fetching rejected requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRejectedRequests();
    }, []);
    return (
        <div id="MyInstallRejected">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่ไม่อนุมัติ</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> กรุณาติดต่อเจ้าหน้าที่หากต้องการข้อมูลเพิ่มเติม</p>
                </div>
            </div>
            <div>
                {loading ? <div className='h-[180px] flex justify-center items-center'>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <Spinner />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                    </div>
                </div> : rejectedRequests.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                    <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                </div> : <>{rejectedRequests.map(req => (
                    <div key={req.id} className='border-l-7 border-l-[#F87171] border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6'>
                        {/* Desktop Layout */}
                        <div className='hidden sm:block'>
                            <div className='mb-3 pb-3 flex justify-between items-start border-b border-[#E0E0E0]'>
                                <div className='space-y-2'>
                                    <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                    <div className='flex text-gray-400 text-xs sm:text-sm'>
                                        {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                        <div className='flex items-center gap-x-2'>
                                            <GoClock size={20} />
                                            <p className=''>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-x-2 bg-[#FEE2E2] w-fit rounded-md px-4 py-1 '>
                                    <div className='size-[7px] rounded-[50%] bg-[#EF4444]'></div>
                                    <span className='cursor-default text-[#DC2626] text-[13px]'>{req.status_name && 'ไม่อนุมัติ'}</span>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div className='space-y-2'>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติโดย :</span> {req.updated_by_name}</p>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ไม่อนุมัติ :</span> {req.comment || 'ไม่ได้ระบุไว้'}</p>
                                </div>
                                <div className='flex flex-col justify-end'>
                                    {/* <button className='flex gap-x-2 items-center cursor-pointer rounded-[5px] text-[14px] px-3 py-2 bg-[#d9534f] text-white duration-200 hover:bg-[#DC2626] '>
                                        <span>ยกเลิก</span>
                                    </button> */}
                                </div>
                            </div>
                        </div>
                        {/* Mobile Layout */}
                        <div className='sm:hidden'>
                            <div className='mb-3 pb-4 flex flex-col space-y-2 items-start border-b border-[#E0E0E0]'>
                                <div className='space-y-2'>
                                    <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                    <div className='flex text-gray-400 text-xs sm:text-sm'>
                                        {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                        <div className='flex items-center gap-x-2'>
                                            <GoClock className='size-4' />
                                            <p className='text-xs sm:text-base'>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-x-2 bg-[#FEE2E2] w-fit rounded-full px-2 py-1 '>
                                    <div className='size-[7px] rounded-[50%] bg-[#EF4444]'></div>
                                    <span className='cursor-default text-[#DC2626] text-xs sm:text-sm'>{req.status_name && 'ไม่อนุมัติ'}</span>
                                </div>
                            </div>
                            <div className='flex justify-between gap-2'>
                                <div className='space-y-2'>
                                    <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                    <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                    <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                    <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติโดย :</span> {req.updated_by_name}</p>
                                    <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ไม่อนุมัติ :</span> {req.comment || 'ไม่ได้ระบุไว้'}</p>
                                </div>
                                <div className='flex flex-col justify-end'>

                                </div>
                            </div>
                        </div>
                    </div>
                ))}</>}
            </div>
        </div>
    )
}

/* 4. ยกเลิก */
export function MyInstallCancelled() {
    const [cancelledRequests, setCancelledRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCancelledRequests = async () => {
            try {
                const response = await axios.get('/api/users/request/cancelled');
                setCancelledRequests(response.data);
            } catch (error) {
                console.error("Error fetching cancelled requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCancelledRequests();
    }, []);
    return (
        <div id="MyInstallCancelled">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่ยกเลิก</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> กรุณาติดต่อเจ้าหน้าที่หากต้องการข้อมูลเพิ่มเติม</p>
                </div>
            </div>
            <div>
                {loading ? <div className='h-[180px] flex justify-center items-center'>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <Spinner />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                    </div>
                </div> : cancelledRequests.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                    <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                </div> : <>      {cancelledRequests.map(req => (
                    <div key={req.id} className='border-l-7 border-l-[#D1D5DB] border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6'>
                        {/* Desktop Layout */}
                        <div className='hidden sm:block'>
                            <div className='mb-3 pb-3 flex justify-between items-start border-b border-[#E0E0E0]'>
                                <div className='space-y-2'>
                                    <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                    <div className='flex text-gray-400 text-xs sm:text-sm'>
                                        {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                        <div className='flex items-center gap-x-2'>
                                            <GoClock size={20} />
                                            <p className=''>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-x-2 bg-[#F3F4F6] w-fit rounded-md px-4 py-1 '>
                                    <div className='size-[7px] rounded-[50%] bg-[#9CA3AF]'></div>
                                    <span className='cursor-default text-[#6B7280] text-[13px]'>{req.status_name && 'ยกเลิก'}</span>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div className='space-y-2'>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ยกเลิก :</span> {req.comment || 'ไม่ได้ระบุไว้'}</p>
                                </div>
                                <div className='flex flex-col justify-end'>
                                    {/* <button className='flex gap-x-2 items-center cursor-pointer rounded-[5px] text-[14px] px-3 py-2 bg-[#d9534f] text-white duration-200 hover:bg-[#DC2626] '>
                                        <span>ยกเลิก</span>
                                    </button> */}
                                </div>
                            </div>
                        </div>
                        {/* Mobile Layout */}
                        <div className='sm:hidden'>
                            <div className='mb-3 pb-4 flex flex-col space-y-2 items-start border-b border-[#E0E0E0]'>
                                <div className='space-y-2'>
                                    <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                    <div className='flex text-gray-400 text-xs sm:text-sm'>
                                        {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                        <div className='flex items-center gap-x-2'>
                                            <GoClock className='size-4' />
                                            <p className='text-xs sm:text-base'>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-x-2 bg-[#F3F4F6] w-fit rounded-full px-2 py-1'>
                                    <div className='size-[7px] rounded-[50%] bg-[#9CA3AF]'></div>
                                    <span className='cursor-default text-[#6B7280] text-xs sm:text-sm'>{req.status_name && 'ยกเลิก'}</span>
                                </div>
                            </div>
                            <div className='flex justify-between gap-2'>
                                <div className='space-y-2'>
                                    <p className='line-clamp-1 text-sm sm:text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                    <p className='line-clamp-3 text-sm sm:text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                    <p className='line-clamp-3 text-sm sm:text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                    <p className='line-clamp-3 text-sm sm:text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ยกเลิก :</span> {req.comment || 'ไม่ได้ระบุไว้'}</p>
                                </div>
                                <div className='flex flex-col justify-end'>

                                </div>
                            </div>
                        </div>
                    </div>
                ))}</>}
            </div>
        </div>
    )
}

/* 5. เสร็จสิ้น */
export function MyInstallCompleted() {
    const [completedRequest, setCompletedRequest] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCompletedRequests = async () => {
            try {
                const response = await axios.get('/api/users/request/completed');
                setCompletedRequest(response.data);
            } catch (error) {
                console.error("Error fetching completed requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompletedRequests();
    }, []);
    return (
        <div id="MyInstallCompleted">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่ติดตั้งเรียบร้อย</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> กรุณาติดต่อเจ้าหน้าที่หากต้องการข้อมูลเพิ่มเติม</p>
                </div>
            </div>
            <div>
                {loading ? <div className='h-[180px] flex justify-center items-center'>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <Spinner />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                    </div>
                </div> : completedRequest.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                    <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                </div> : <> {completedRequest.map(req => (
                    <div key={req.id} className='border-l-7 border-l-[#22C55E] border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6'>
                        {/* Desktop Layout */}
                        <div className='hidden sm:block'>
                            <div className='mb-3 pb-3 flex justify-between items-start border-b border-[#E0E0E0]'>
                                <div className='space-y-2'>
                                    <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                    <div className='flex text-gray-400 text-xs sm:text-sm'>
                                        {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                        <div className='flex items-center gap-x-2'>
                                            <GoClock size={20} />
                                            <p className=''>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-x-2 bg-[#DCFCE7] w-fit rounded-md px-4 py-1'>
                                    <div className='size-[7px] rounded-[50%] bg-[#16A34A]'></div>
                                    <span className='cursor-default text-[#15803D] text-[13px]'>{req.status_name && 'เสร็จสิ้น'}</span>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div className='text-[#4E5155] space-y-2'>
                                    <div className='space-y-2'>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                        <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย :</span> {req.updated_by_name}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-end'>
                                    {/* <button className='flex gap-x-2 items-center cursor-pointer rounded-[5px] text-[14px] px-3 py-2 bg-[#d9534f] text-white duration-200 hover:bg-[#DC2626] '>
                                        <span>ยกเลิก</span>
                                    </button> */}
                                </div>
                            </div>
                        </div>
                        {/* Mobile Layout */}
                        <div className='sm:hidden'>
                            <div className='mb-3 pb-4 flex flex-col space-y-2 items-start border-b border-[#E0E0E0]'>
                                <div className='space-y-2'>
                                    <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                    <div className='flex text-gray-400 text-xs sm:text-sm'>
                                        {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                        <div className='flex items-center gap-x-2'>
                                            <GoClock className='size-4' />
                                            <p className='text-xs sm:text-base'>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-x-2 bg-[#DCFCE7] w-fit rounded-md px-4 py-1'>
                                    <div className='size-[7px] rounded-[50%] bg-[#16A34A]'></div>
                                    <span className='cursor-default text-[#15803D] text-xs sm:text-sm'>{req.status_name && 'เสร็จสิ้น'}</span>
                                </div>
                            </div>
                            <div className='flex justify-between gap-2'>
                                <div className='space-y-2'>
                                    <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                    <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                    <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                    <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย :</span> {req.updated_by_name}</p>
                                </div>
                                <div className='flex flex-col justify-end'>

                                </div>
                            </div>
                        </div>
                    </div>
                ))}</>}
            </div>
        </div>
    )
}

/* 6. รายการทั้งหมด */
export function MyInstallHistory() {
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelledRequestsModal, setCancelledRequestsModal] = useState(null);
    const fetchAllRequest = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/request');
            setAllRequests(response.data);
        } catch (error) {
            console.error("Error fetching all requests:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchAllRequest();
    }, [fetchAllRequest]);
    const statusColor = {
        'waiting': {
            bg: 'bg-[#FEF9C3]',
            border: '#FACC15',
            dot: 'bg-[#EAB308]',
            text: 'text-[#B45309]',
            label: 'รอดำเนินการ'
        },
        'confirmed': {
            bg: 'bg-[#D1FAE5]',
            border: '#34D399',
            dot: 'bg-[#10B981]',
            text: 'text-[#059669]',
            label: 'อนุมัติ'
        },
        'completed': {
            bg: 'bg-[#DCFCE7]',
            border: '#22C55E',
            dot: 'bg-[#16A34A]',
            text: 'text-[#15803D]',
            label: 'เสร็จสิ้น'
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
        <div id="MyInstallHistory">
            <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการทั้งหมด</h2>
                <div className='flex items-center gap-x-2 text-[#868686]'>
                    <AiFillInfoCircle color='#d7dbdd' size={20} />
                    <p className='text-xs sm:text-sm'> กรุณาติดต่อเจ้าหน้าที่หากต้องการข้อมูลเพิ่มเติม</p>
                </div>
            </div>
            <div>
                {loading ? <div className='h-[180px] flex justify-center items-center'>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <Spinner />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                    </div>
                </div> : allRequests.length === 0 ? <div className='py-15 text-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการ</p>
                    <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มคำขอใหม่</p>
                </div> : <>{allRequests.map(req => (
                    <div key={req.id} style={{ borderLeftColor: statusColor[req.status_name].border }} className='border-l-7 border-l-[#22C55E] border-t border-r border-b border-[#E0E0E0] rounded-r-[5px] shadow-sm p-6 mb-6'>
                        {/* Desktop Layout */}
                        <div className='hidden sm:block'>
                            <div className='mb-3 pb-3 flex justify-between items-start border-b border-[#E0E0E0]'>
                                <div className='space-y-2'>
                                    <h2 className='line-clamp-1 text-sm sm:text-md lg:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                    <div className='flex text-gray-400 text-xs sm:text-sm'>
                                        {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                        <div className='flex items-center gap-x-2'>
                                            <GoClock size={20} />
                                            <p className=''>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                    </div>
                                </div>
                                {statusColor[req.status_name] && (
                                    <div className={`flex items-center gap-x-2 w-[115px] rounded-md px-4 py-1 ${statusColor[req.status_name].bg} `}>
                                        {/* เส้นขอบ Status border border-[${statusColor[req.status_name].border}] */}
                                        <div className={`size-[7px] rounded-full ${statusColor[req.status_name].dot}`}></div>
                                        <span className={`cursor-default ${statusColor[req.status_name].text} text-[13px]`}>
                                            {statusColor[req.status_name].label}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className='flex justify-between'>
                                <div className='space-y-2'>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                    <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                    {req.status_name === 'cancelled' && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ยกเลิก :</span> {req.comment}</p>}
                                    {req.status_name === 'confirmed' && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>หมายเหตุ :</span> {req.comment || 'ไม่ได้ระบุไว้'}</p>}
                                    {(req.status_name === 'confirmed' || req.status_name === 'completed') && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย :</span> {req.updated_by_name}</p>}
                                    {req.status_name === 'rejected' && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติโดย :</span> {req.updated_by_name}</p>}
                                    {req.status_name === 'rejected' && <p className='line-clamp-1 text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ไม่อนุมัติ :</span> {req.comment}</p>}
                                </div>
                                <div className='flex flex-col justify-end'>
                                    {req.status_name === 'waiting' && <button onClick={() => setCancelledRequestsModal(req)}
                                        className='cursor-pointer flex items-center justify-center size-9 rounded-md bg-[#d9534f] text-white transition-all duration-200 hover:bg-[#DC2626] hover:scale-105 shadow-md'>
                                        <RxCross2 size={18} />
                                    </button>}
                                </div>
                            </div>
                        </div>
                        {/* Mobile Layout */}
                        <div className='sm:hidden'>
                            <div className='mb-3 pb-4 flex flex-col space-y-2 items-start border-b border-[#E0E0E0]'>
                                <div className='space-y-2'>
                                    <h2 className='text-sm line-clamp-1 sm:text-md md:text-lg font-semibold tracking-[1px] text-gray-600'>{req.request_code}</h2>
                                    <div className='flex text-gray-400 text-xs sm:text-sm'>
                                        {/* <p className='pr-2 mr-2 border-r border-[#E0E0E0]'>รหัสคำขอติดตั้ง : {req.id}</p> */}
                                        <div className='flex items-center gap-x-2'>
                                            <GoClock className='size-4' />
                                            <p className='text-xs sm:text-base'>ส่งคำขอเมื่อ  {dayjs(req.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                        </div>
                                    </div>
                                </div>
                                {statusColor[req.status_name] && (
                                    <div className={`flex items-center gap-x-2 w-fit rounded-full px-2 py-1 ${statusColor[req.status_name].bg} `}>
                                        {/* เส้นขอบ Status border border-[${statusColor[req.status_name].border}] */}
                                        <div className={`size-[7px] rounded-full ${statusColor[req.status_name].dot}`}></div>
                                        <span className={`cursor-default ${statusColor[req.status_name].text} text-[13px]`}>
                                            {statusColor[req.status_name].label}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className='flex justify-between gap-2'>
                                <div className='space-y-2'>
                                    <p className='line-clamp-1 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>วันที่นัดหมาย :</span> {dayjs(req.appointment_date).format('DD/MM/YYYY HH:mm')}</p>
                                    <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>คอมพิวเตอร์ :</span> {req.computer}</p>
                                    <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>โปรแกรมที่ติดตั้ง :</span> {req.description}</p>
                                    {req.status_name === 'cancelled' && <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ยกเลิก :</span> {req.comment}</p>}
                                    {req.status_name === 'confirmed' && <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>หมายเหตุ :</span> {req.comment || 'ไม่ได้ระบุไว้'}</p>}
                                    {(req.status_name === 'confirmed' || req.status_name === 'completed') && <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>อนุมัติโดย :</span> {req.updated_by_name}</p>}
                                    {req.status_name === 'rejected' && <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>ไม่อนุมัติโดย :</span> {req.updated_by_name}</p>}
                                    {req.status_name === 'rejected' && <p className='line-clamp-3 text-xs sm:text-base text-gray-800'><span className='text-gray-500'>เหตุผลที่ไม่อนุมัติ :</span> {req.comment}</p>}
                                </div>
                                <div className='flex flex-col justify-end'>
                                    {req.status_name === 'waiting' && <button onClick={() => setCancelledRequestsModal(req)}
                                        className='cursor-pointer flex items-center justify-center size-8 rounded-sm md:rounded-full bg-[#d9534f] text-white transition-all duration-200 hover:bg-[#DC2626] hover:scale-105 shadow-md'>
                                        <RxCross2 size={18} />
                                    </button>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}</>}
            </div>
            {cancelledRequestsModal && (
                <CancelledRequestsModal request={cancelledRequestsModal} refresh={fetchAllRequest} onClose={() => setCancelledRequestsModal(null)} />
            )}
        </div>
    )
}