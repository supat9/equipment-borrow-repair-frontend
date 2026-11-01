'use client';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { FaSort } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import axios from 'axios';
import Spinner from '@/components/users/loading/Spinner';
import dayjs from 'dayjs';
import { RxCross2 } from 'react-icons/rx';
import { FiUser } from "react-icons/fi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import Swal from 'sweetalert2';
import { DataLoading, SubmitLoading } from '@/components/users/loading/LoadingOverlay';
import { FaLayerGroup } from 'react-icons/fa';
import { BsChatSquareTextFill } from 'react-icons/bs';
import Pagination from '@/components/staff/pagination/Pagination';
import { useNotifications } from '@/context/staff/StaffContext';
import { LuUserRound } from 'react-icons/lu';
import { PiNewspaper } from 'react-icons/pi';

export function RequestDetailModal({ request, onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const statusColor = {
        'waiting': {
            bg: 'bg-yellow-50 border border-yellow-200',
            dot: 'bg-yellow-500',
            text: 'text-yellow-700',
            label: 'รอดำเนินการ'
        },
        'confirmed': {
            bg: 'bg-green-50 border border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'อนุมัติ'
        },
        'cancelled': {
            bg: 'bg-gray-50 border border-gray-200',
            dot: 'bg-gray-500',
            text: 'text-gray-700',
            label: 'ยกเลิก'
        },
        'rejected': {
            bg: 'bg-red-50 border border-red-200',
            dot: 'bg-red-500',
            text: 'text-red-700',
            label: 'ไม่อนุมัติ'
        },
        'completed': {
            bg: 'bg-green-50 border border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'เสร็จสิ้น'
        }
    };
    const [actionType, setActionType] = useState(null);
    const [comment, setComment] = useState('');

    const showWarningAlert = () => {
        return Swal.fire({
            title: 'ไม่สามารถดำเนินการได้',
            text: `กรุณากรอกเหตุผลที่ไม่อนุมัติ`,
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
        let color = "#d33";
        let text = message || "เกิดข้อผิดพลาด";
        if (status === 400) {
            icon = "warning";
            color = "#FFC107"; // yellow
            text = message || "กรุณากรอกข้อมูลให้ครบถ้วน";
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
    const { fetchInstallRequests } = useNotifications();
    const handleSubmit = async (requestStatuses) => {
        try {
            if (requestStatuses === 'rejected' && !comment) {
                return await showWarningAlert();
            }
            const actionTextMap = {
                confirmed: 'อนุมัติ',
                rejected: 'ไม่อนุมัติ',
                completed: 'ดำเนินการ'
            };
            const confirmed = await Swal.fire({
                title: `ยืนยันที่จะ${actionTextMap[requestStatuses]}คำขอ?`,
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
            const id = request.id;
            const response = await axios.put(`/api/staff/request/${encodeURIComponent(id)}`,
                { requestStatuses, comment });
            const result = response.data;
            setSubmitLoading(false);
            fetchInstallRequests(); // รีเฟรชจำนวนคำขอติดตั้งที่รอดำเนินการ
            await Swal.fire({
                title: 'สำเร็จ!',
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
            console.error('Error staff submitting request:', error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    const [completedLoading, setCompletedLoading] = useState(false);
    const handleComplete = async (requestStatuses) => {
        try {
            const confirmed = await Swal.fire({
                title: `ยืนยันที่จะดำเนินการคำขอ?`,
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
            setCompletedLoading(true);
            const id = request.id;
            // const oldComment = request.comment;
            const response = await axios.put(`/api/staff/request/${encodeURIComponent(id)}`,
                { requestStatuses, comment: null });
            const result = response.data;
            setCompletedLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
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
            console.error('Error staff update to completed request:', error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setCompletedLoading(false);
        }
    }
    const statusActions = {
        'waiting': () => (
            <form action="">
                <div className='bg-white border border-gray-300 p-6 mb-5 rounded-[5px] shadow-sm  transition-all duration-300 backdrop-blur-sm'>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                            <PiNewspaper size={20} className='text-green-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลการดำเนินการ</h2>
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-4'>
                        <label className='text-gray-600' htmlFor="">หมายเหตุ ( ระบุหากไม่อนุมัติ )</label>
                        <textarea
                            className='text-gray-500 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                    <button type='button' onClick={() => handleSubmit('rejected')} className='cursor-pointer rounded-[5px] px-4 py-2 bg-[#d9534f] text-white duration-200 hover:bg-[#DC2626]'>
                        ไม่อนุมัติ
                    </button>
                    <button type='button' onClick={() => handleSubmit('confirmed')} className='cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>
                        อนุมัติ
                    </button>
                </div>
            </form>
        ),
        'confirmed': () => (
            <form>
                <div className='flex justify-end gap-x-4 text-[15px]'>
                    {/* <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-4 py-2 bg-[#6B7280] text-white duration-200 hover:bg-[#4B5563]'>
                        ปิด
                    </button> */}
                    <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                    <button type='button' onClick={() => handleComplete('completed')} className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>
                        ติดตั้งเสร็จสิ้น
                    </button>
                </div>
            </form>
        ),
        'rejected': () => (
            <div className='flex justify-end'>
                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
            </div>
        ),
        'cancelled': () => (
            <div className='flex justify-end'>
                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
            </div>
        ),
        'completed': () => (
            <div className='flex justify-end'>
                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
            </div>
        ),
        'default': () => (
            <div className='flex justify-end'>
                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
            </div>
        )
    };

    // 2. แสดงผลตามสถานะ
    const renderStatusContent = () => {
        const renderer = statusActions[request.status_name] || statusActions['default'];
        return renderer();
    };
    const fmt = (time) => dayjs(time).format('DD/MM/YYYY HH:mm');
    return (
        <div id="request-detail-modal">
            <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[400px] max-w-[800px] w-full bg-white rounded-[5px] py-6 shadow-xl relative ">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-6'>
                        <div className='flex items-center gap-x-4'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>รายละเอียดคำขอติดตั้งโปรแกรม</h2>
                            {statusColor[request.status_name] && (
                                <div className={`inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${statusColor[request.status_name].bg} ${statusColor[request.status_name].text}`}>
                                    <div className={`w-2 h-2 rounded-full ${statusColor[request.status_name].dot}`}></div>
                                    <span className="text-xs font-medium tracking-wide">
                                        {statusColor[request.status_name].label}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6 max-h-[70vh] overflow-y-auto'>
                        <div className="space-y-4">
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px]   transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <PiNewspaper size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลคำขอ</h2>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">รหัสคำขอ</label>
                                        <p className='text-slate-700 text-base'>{request?.request_code || 'ไม่มีรหัสคำขอ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">รายละเอียดโปรแกรม</label>
                                        <p className='text-slate-700 text-base'>{request?.description || 'ไม่ระบุรายละเอียดโปรแกรม'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">คอมพิวเตอร์</label>
                                        <p className='text-slate-700 text-base'>{request?.computer || 'ยังไม่ระบุคอมพิวเตอร์'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">วันที่แจ้ง</label>
                                        <p className='text-slate-700 text-base'>{request?.created_at ? fmt(request?.created_at) : 'ยังไม่ระบุวันแจ้ง'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">วันที่นัดหมาย</label>
                                        <p className='text-slate-700 text-base'>{request?.appointment_date ? fmt(request?.appointment_date) : 'ยังไม่ระบุวันที่นัดหมาย'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">{request?.status_name === 'rejected' ? 'เหตุผลที่ไม่อนุมัติ' : request.status_name === 'cancelled' ? 'เหตุผลที่ยกเลิก' : 'หมายเหตุ'}</label>
                                        <p className='text-slate-700 text-base'>{request?.comment || 'ยังไม่ระบุหมายเหตุ'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px]   transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <FiUser size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลผู้ใช้</h2>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ชื่อจริง</label>
                                        <p className='text-slate-700 text-base'>{request?.first_name || 'ยังไม่ระบุชื่อจริง'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">นามสกุล</label>
                                        <p className='text-slate-700 text-base'>{request?.last_name || 'ยังไม่ระบุนามสกุล'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">รหัสนิสิต</label>
                                        <p className='text-slate-700 text-base'>{request?.student_id || 'ยังไม่ระบุรหัสนิสิต'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">เบอร์โทรศัพท์</label>
                                        <p className='text-slate-700 text-base'>{request?.phone || 'ยังไม่ระบุเบอร์โทรศัพท์'}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className=''>
                            {renderStatusContent()}
                        </div>
                    </div>
                </div>
            </div>
            {submitLoading && <SubmitLoading />}
            {completedLoading && <SubmitLoading />}
        </div>
    )
}

/* 1. รายการที่รอนุมัติ */
export function RequestInstallation() {
    const [requestInstallationModal, setRequestInstallationModal] = useState(null);
    const [waitingRequests, setWaitingRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const fetchWaitingRequests = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/request/waiting',
                { params: { page, limit: itemsPerPage } }
            );
            setWaitingRequests(response.data.data || []);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("Error fetching waiting requests:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchWaitingRequests(currentPage);
    }, [currentPage]);
    return (
        <div id="request-installation-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่รออนุมัติ</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : waitingRequests.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอติดตั้งโปรแกรมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสแจ้งติดตั้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        โปรแกรม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่นัดหมาย
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {waitingRequests.map((req) =>
                                    <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{req.request_code}</td>
                                        <td className='p-4'>{req.first_name} {req.last_name}</td>
                                        <td className='p-4'>{req.description}</td>
                                        <td className='p-4'>{dayjs(req.created_at).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(req.appointment_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-yellow-50 border border-yellow-200 text-yellow-700'>
                                                <div className='w-2 h-2 rounded-full bg-yellow-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{req.status_name && 'รอดำเนินการ'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setRequestInstallationModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {waitingRequests.length > 0 && (
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
            {requestInstallationModal && <RequestDetailModal refresh={fetchWaitingRequests} request={requestInstallationModal} onClose={() => setRequestInstallationModal(null)} />}
        </div>
    )
}

/* 2. รายการที่อนุมัติ */
export function RequestInstallationComfirmed() {
    const [requestInstallationComfirmedModal, setRequestInstallationComfirmedModal] = useState(null);
    const [confirmedRequests, setConfirmedRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const fetchConfirmedRequests = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/request/confirmed',
                { params: { page, limit: itemsPerPage } }
            );
            setConfirmedRequests(response.data.data);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("Error fetching confirmed requests:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchConfirmedRequests(currentPage);
    }, [currentPage]);
    return (
        <div id="request-installation-comfirmed-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่อนุมัติแล้ว</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : confirmedRequests.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอติดตั้งโปรแกรมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสแจ้งติดตั้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        โปรแกรม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่นัดหมาย
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {confirmedRequests.map((req) =>
                                    <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{req.request_code}</td>
                                        <td className='p-4'>{req.first_name} {req.last_name}</td>
                                        <td className='p-4'>{req.description}</td>
                                        <td className='p-4'>{dayjs(req.created_at).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(req.appointment_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-green-50 border border-green-200 text-green-700'>
                                                <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{req.status_name && 'อนุมัติ'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setRequestInstallationComfirmedModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {confirmedRequests.length > 0 && (
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
            {requestInstallationComfirmedModal && <RequestDetailModal refresh={fetchConfirmedRequests} request={requestInstallationComfirmedModal} onClose={() => setRequestInstallationComfirmedModal(null)} />}
        </div>
    )
}

/* 3. รายการที่กำลังดำเนินการ */
// export function RequestInstallationInProgress() {
//     const requestInstallationInProgressFilter = mockInstallation.filter(req => req.status === "กำลังดำเนินการ");
//     const [requestInstallationInProgressModal, setRequestInstallationInProgressModal] = useState(null);
//     return (
//         <div id="request-installation-in-progress-components">
//             <div className='flex justify-between items-center mb-6'>
//                 <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่กำลังดำเนินการ</h2>
//             </div>
//             <div>
//                 <table className='w-full tracking-[.5px] text-left border-collapse'>
//                     <thead className='bg-slate-50 border border-gray-300'>
//                         <tr className='text-sm text-gray-700'>
//                             <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
//                                 รหัสแจ้งติดตั้ง 
//                             </span></th>
//                             <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
//                                 ผู้แจ้ง
//                             </span></th>
//                             <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
//                                 โปรแกรม 
//                             </span></th>
//                             <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
//                                 วันที่แจ้ง 
//                             </span></th>
//                             <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
//                                 วันที่นัดหมาย 
//                             </span></th>
//                             <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
//                             <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {requestInstallationInProgressFilter.map((req) =>
//                             <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
//                                 <td className='p-4'>{req.installation_code}</td>
//                                 <td className='p-4'>{req.first_name} {req.last_name}</td>
//                                 <td className='p-4'>{req.program_name}</td>
//                                 <td className='p-4'>{req.created_at}</td>
//                                 <td className='p-4'>{req.appointment_date}</td>
//                                 <td className='p-4'>
//                                     <div className='flex items-center gap-x-2 bg-[#DBEAFE] w-fit rounded-[5px] px-3 py-1'>
//                                         <div className='size-[7px] rounded-[50%] bg-[#3B82F6]'></div>
//                                         <span className='cursor-default text-[#1D4ED8] text-[13px]'>{req.status}</span>
//                                     </div>
//                                 </td>
//                                 <td className='p-4'>
//                                     <div className=''>
//                                         <button onClick={() => setRequestInstallationInProgressModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     )
// }

/* 4. รายการที่ยกเลิก */
export function RequestInstallationCancelled() {
    const [requestInstallationCancelledModal, setRequestInstallationCancelledModal] = useState(null);
    const [cancelledRequests, setCancelledRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const fetchCancelledRequests = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/request/cancelled',
                { params: { page, limit: itemsPerPage } }
            );
            setCancelledRequests(response.data.data);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("Error fetching cancelled requests:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchCancelledRequests(currentPage);
    }, [currentPage]);
    return (
        <div id="request-installation-cancelled-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่ยกเลิก</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : cancelledRequests.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอติดตั้งโปรแกรมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสแจ้งติดตั้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        โปรแกรม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่นัดหมาย
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cancelledRequests.map((req) =>
                                    <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{req.request_code}</td>
                                        <td className='p-4'>{req.first_name} {req.last_name}</td>
                                        <td className='p-4'>{req.description}</td>
                                        <td className='p-4'>{dayjs(req.created_at).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(req.appointment_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-50 border border-gray-200 text-gray-700'>
                                                <div className='w-2 h-2 rounded-full bg-gray-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{req.status_name && 'ยกเลิก'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setRequestInstallationCancelledModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {cancelledRequests.length > 0 && (
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
            {requestInstallationCancelledModal && <RequestDetailModal refresh={fetchCancelledRequests} request={requestInstallationCancelledModal} onClose={() => setRequestInstallationCancelledModal(null)} />}

        </div>
    )
}

/* 5. รายการที่ไม่อนุมัติ */
export function RequestInstallationRejected() {
    const [requestInstallationRejectedModal, setRequestInstallationRejectedModal] = useState(null);
    const [rejectedRequests, setRejectedRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const fetchRejectedRequests = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/request/rejected',
                { params: { page, limit: itemsPerPage } }
            );
            setRejectedRequests(response.data.data);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("Error fetching rejected requests:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchRejectedRequests(currentPage);
    }, [currentPage]);
    return (
        <div id="request-installation-rejected-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่ไม่อนุมัติ</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : rejectedRequests.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอติดตั้งโปรแกรมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสแจ้งติดตั้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        โปรแกรม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่นัดหมาย
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rejectedRequests.map((req) =>
                                    <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{req.request_code}</td>
                                        <td className='p-4'>{req.first_name} {req.last_name}</td>
                                        <td className='p-4'>{req.description}</td>
                                        <td className='p-4'>{dayjs(req.created_at).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(req.appointment_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-red-50 border border-red-200 text-red-700'>
                                                <div className='w-2 h-2 rounded-full bg-red-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{req.status_name && 'ไม่อนุมัติ'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setRequestInstallationRejectedModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {rejectedRequests.length > 0 && (
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
            {requestInstallationRejectedModal && <RequestDetailModal refresh={fetchRejectedRequests} request={requestInstallationRejectedModal} onClose={() => setRequestInstallationRejectedModal(null)} />}
        </div>
    )
}

/* 6. รายการที่เสร็จสิ้น */
export function RequestInstallationCompleted() {
    const [requestInstallationCompletedModal, setRequestInstallationCompletedModal] = useState(null);
    const [completedRequests, setCompletedRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const fetchCompletedRequests = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/request/completed',
                { params: { page, limit: itemsPerPage } }
            );
            setCompletedRequests(response.data.data);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("Error fetching completed requests:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchCompletedRequests(currentPage);
    }, [currentPage]);
    return (
        <div id="request-installation-completed-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการที่เสร็จสิ้น</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : completedRequests.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอติดตั้งโปรแกรมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสแจ้งติดตั้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        โปรแกรม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่นัดหมาย
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedRequests.map((req) =>
                                    <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{req.request_code}</td>
                                        <td className='p-4'>{req.first_name} {req.last_name}</td>
                                        <td className='p-4'>{req.description}</td>
                                        <td className='p-4'>{dayjs(req.created_at).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(req.appointment_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-green-50 border border-green-200 text-green-700'>
                                                <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{req.status_name && 'เสร็จสิ้น'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setRequestInstallationCompletedModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {completedRequests.length > 0 && (
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
            {requestInstallationCompletedModal && <RequestDetailModal refresh={fetchCompletedRequests} request={requestInstallationCompletedModal} onClose={() => setRequestInstallationCompletedModal(null)} />}

        </div>
    )
}

/* 7. รายการทั้งหมด */
export function RequestInstallationAll() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [requestInstallationAllModal, setRequestInstallationAllModal] = useState(null);
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchAllRequest = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/request', {
                params: {
                    page,
                    limit: itemsPerPage
                }
            });
            setAllRequests(response.data.data);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
        } catch (error) {
            console.error("Error fetching all requests:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAllRequest(currentPage);
    }, [currentPage]);
    const statusColor = {
        'waiting': {
            bg: 'bg-yellow-50 border border-yellow-200',
            dot: 'bg-yellow-500',
            text: 'text-yellow-700',
            label: 'รอดำเนินการ'
        },
        'confirmed': {
            bg: 'bg-green-50 border border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'อนุมัติ'
        },
        // 'กำลังดำเนินการ': {
        //     bg: 'bg-[#DBEAFE]',
        //     border: '#60A5FA',
        //     dot: 'bg-[#3B82F6]',
        //     text: 'text-[#1D4ED8]',
        //     label: 'กำลังดำเนินการ'
        // },
        'cancelled': {
            bg: 'bg-gray-50 border border-gray-200',
            dot: 'bg-gray-500',
            text: 'text-gray-700',
            label: 'ยกเลิก'
        },
        'rejected': {
            bg: 'bg-red-50 border border-red-200',
            dot: 'bg-red-500',
            text: 'text-red-700',
            label: 'ไม่อนุมัติ'
        },
        'completed': {
            bg: 'bg-green-50 border border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'เสร็จสิ้น'
        }
    };
    return (
        <div id="request-installation-all-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการทั้งหมด</h2>
            </div>
            <div>
                {loading ? <DataLoading /> : allRequests.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีคำขอติดตั้งโปรแกรมในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้ส่งคำขอ</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสแจ้งติดตั้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ผู้แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        โปรแกรม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่แจ้ง
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่นัดหมาย
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allRequests.map((req) =>
                                    <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{req.request_code}</td>
                                        <td className='p-4'>{req.first_name} {req.last_name}</td>
                                        <td className='p-4'>{req.description}</td>
                                        <td className='p-4'>{dayjs(req.created_at).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>{dayjs(req.appointment_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            {statusColor[req.status_name] && (
                                                <div className={`inline-flex w-[110px] items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${statusColor[req.status_name].bg} ${statusColor[req.status_name].text}`}>
                                                    <div className={`w-2 h-2 rounded-full ${statusColor[req.status_name].dot}`}></div>
                                                    <span className="text-xs font-medium tracking-wide">
                                                        {statusColor[req.status_name].label}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setRequestInstallationAllModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {allRequests.length > 0 && (
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
            {requestInstallationAllModal && <RequestDetailModal refresh={fetchAllRequest} request={requestInstallationAllModal} onClose={() => setRequestInstallationAllModal(null)} />}

        </div>
    )
}