'use client';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { FaSort } from "react-icons/fa";
import { mockRequest } from '@/mock/mockRequest';
import { MdAssignment } from "react-icons/md";
import axios from 'axios';
import Swal from 'sweetalert2';
import Spinner from '@/components/users/loading/Spinner';
import dayjs from 'dayjs';
import { RxCross2 } from 'react-icons/rx';
import { FiUser } from "react-icons/fi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { TbDeviceDesktop } from "react-icons/tb";
import { PiDevicesFill, PiNewspaper, PiToolbox } from "react-icons/pi";
import { BsBoxSeam, BsChatSquareTextFill } from 'react-icons/bs';
import { LuUserRound } from "react-icons/lu";
import { DataLoading, SubmitLoading } from '@/components/users/loading/LoadingOverlay';
import { FaLayerGroup } from 'react-icons/fa';
import Select from 'react-select';
import Pagination from '@/components/staff/pagination/Pagination';
import { useNotifications } from '@/context/staff/StaffContext';
import { IoRefresh } from 'react-icons/io5';

export function RequestDetailModal({ request, onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const statusColor = {
        'repair': {
            bg: 'bg-yellow-50 border border-yellow-200',
            border: 'border-yellow-200',
            dot: 'bg-yellow-500',
            text: 'text-yellow-700',
            label: 'ซ่อมแซม'
        },
        'maintenance': {
            bg: 'bg-blue-50 border border-blue-200',
            border: 'border-blue-200',
            dot: 'bg-blue-500',
            text: 'text-blue-700',
            label: 'บำรุงรักษา'
        },
        'inspection': {
            bg: 'bg-purple-50 border border-purple-200',
            border: 'border-purple-200',
            dot: 'bg-purple-500',
            text: 'text-purple-700',
            label: 'ตรวจสอบ'
        },
        'replacement': {
            bg: 'bg-green-50 border border-green-200',
            border: 'border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'เปลี่ยนใหม่'
        }, 'completed': {
            bg: 'bg-emerald-50 border border-emerald-200',
            border: 'border-emerald-200',
            dot: 'bg-emerald-500',
            text: 'text-emerald-700',
            label: 'เสร็จสิ้น'
        }
    };
    // const maintenanceOptions = [
    //     { value: 'repair', label: 'repair' },
    //     { value: 'maintenance', label: 'maintenance' },
    //     { value: 'inspection', label: 'inspection' },
    //     { value: 'replacement', label: 'replacement' },
    //     { value: 'completed', label: 'completed' }
    // ];
    const [maintenanceOptions, setMaintenanceOptions] = useState([]);
    const [selectedMaintenanceOption, setSelectedMaintenanceOption] = useState(null);

    const fetchMaintenanceTypes = async () => {
        try {
            const response = await axios.get('/api/staff/maintenance-request/status/maintenance-type');
            const maintenanceNameTH = {
                repair: "ซ่อมแซม",
                maintenance: "บำรุงรักษา",
                inspection: "ตรวจสอบ",
                replacement: "เปลี่ยนใหม่",
                completed: "เสร็จสิ้น"
            }
            const options = response.data.map((status) => ({
                value: status.maintenance_type,
                label: maintenanceNameTH[status.maintenance_type] || status.maintenance_type
            }));
            const foundMaintenance = options.find(opt => opt.value === request?.maintenance_type);
            setMaintenanceOptions(options);
            setSelectedMaintenanceOption(foundMaintenance || null);
        } catch (error) {
            console.error('Error fetching maintenance types:', error);
        }
    }
    const [usageOptions, setUsageOptions] = useState([]);
    const [selectedUsageOption, setSelectedUsageOption] = useState(null);
    /* check point ขาด maintenance */
    const fetchUsageStatus = async () => {
        try {
            const response = await axios.get('/api/staff/maintenance-request/status/usage-status');
            const usageNameTH = {
                available: "ว่าง",
                borrowed: "กำลังยืม",
                repair: "ซ่อมแซม",
                retired: "นำออก",
                active: "ใช้งานอยู่",
                cancelled: "ยกเลิก",
                selled: "ขายแล้ว"
            }
            const options = response.data.map((status) => ({
                value: status.usage_name,
                label: usageNameTH[status.usage_name] || status.usage_name
            }));
            // const foundUsage = options.find(opt => opt.value === request?.usage_name);
            setUsageOptions(options);
            // setSelectedUsageOption(foundUsage || null);
        } catch (error) {
            console.error('Error fetching usage status:', error);
        }
    };
    useEffect(() => {
        fetchUsageStatus();
        fetchMaintenanceTypes();
    }, []);
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
            title: "ไม่สามารถดำเนินการได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const [submitLoading, setSubmitLoading] = useState(false);
    const { fetchMaintenanceRequests } = useNotifications();
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (selectedMaintenanceOption && selectedUsageOption) {
                const confirmed = await Swal.fire({
                    title: 'ยืนยันการดำเนินการ?',
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
            const id = request.id;
            setSubmitLoading(true);
            const response = await axios.put(`/api/staff/maintenance-request/${encodeURIComponent(id)}`,
                {
                    maintenance_type: selectedMaintenanceOption ? selectedMaintenanceOption.value : null,
                    usage_status: selectedUsageOption ? selectedUsageOption.value : null
                });
            const result = response.data;
            setSubmitLoading(false);
            fetchMaintenanceRequests(); // รีเฟรชจำนวนคำขอซ่อมบำรุงที่รอดำเนินการ
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || 'ดำเนินการเรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1BC688',
                customClass: {
                    container: 'z-[10000]'
                }
            });
            refresh();
            onClose();
        } catch (error) {
            console.error('Error maintenance update form:', error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }// เพิ่มฟังก์ชันตัด string
    // const truncate = (str, max = 10) => {
    //     if (!str && str === 0) return '';
    //     const s = String(str);
    //     return s.length > max ? `${s.slice(0, max)}...` : s;
    // }
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState(null);
    const openPreview = (src) => {
        setPreviewSrc(src);
        setPreviewOpen(true);
    }
    const closePreview = () => {
        setPreviewSrc(null);
        setPreviewOpen(false);
    }
    const fmt = (time) => dayjs(time).format('DD/MM/YYYY HH:mm');
    const urgencyLevelNameTH = {
        'low': 'ต่ำ',
        'medium': 'ปานกลาง',
        'high': 'สูง',
        'critical': 'เสียหาย'
    }
    const maintenanceTypeNameTH = {
        'repair': 'ซ่อมแซม',
        'maintenance': 'บำรุงรักษา',
        'inspection': 'ตรวจสอบ',
        'replacement': 'เปลี่ยนใหม่',
        'completed': 'เสร็จสิ้น'
    }

    return (
        <div id="request-maintenance-detail-modal">
            <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[400px] max-w-[800px] w-full bg-white rounded-[5px] py-6 shadow-xl relative ">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-6'>
                        <div className='flex items-center gap-x-4'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>รายละเอียดคำขอติดตั้งโปรแกรม</h2>
                            {statusColor[request.maintenance_type] && (
                                <div className={`flex items-center gap-x-2 w-fit rounded-[5px] px-3 py-1 ${statusColor[request.maintenance_type].bg}`}>
                                    {/* border  border-[${statusColor[request.status].border}] */}
                                    <div className={`size-[7px] rounded-full ${statusColor[request.maintenance_type].dot}`}></div>
                                    <span className={`cursor-default ${statusColor[request.maintenance_type].text} text-[13px]`}>
                                        {statusColor[request.maintenance_type].label}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6 max-h-[70vh] overflow-y-auto'>
                        <div className="space-y-2">
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <PiNewspaper size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลการแจ้งซ่อม</h2>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">รหัสการแจ้งซ่อม</label>
                                        <p className='text-slate-700 text-base'>{request?.maintenance_request_code || 'ไม่มีรหัสการแจ้งซ่อม'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">วันที่แจ้ง</label>
                                        <p className='text-slate-700 text-base'>{request?.request_date ? fmt(request?.request_date) : 'ยังไม่ระบุวันที่แจ้ง'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">รายละเอียดปัญหา</label>
                                        <p className='text-slate-700 text-base'>{request?.issue_description || 'ยังไม่ระบุรายละเอียดปัญหา'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ระดับความเร่งด่วน</label>
                                        <p className='text-slate-700 text-base'>{request?.urgency_level ? urgencyLevelNameTH[request?.urgency_level] : 'ยังไม่ระบุระดับความเร่งด่วน'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ประเภทการซ่อมบำรุง</label>
                                        <p className='text-slate-700 text-base'>{request?.maintenance_type ? maintenanceTypeNameTH[request?.maintenance_type] : 'ยังไม่ระบุประเภทการซ่อมบำรุง'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">รูปภาพ</label>
                                        <p onClick={() => openPreview(request?.image_path)} className={`${request?.image_path ? 'text-blue-500 cursor-pointer' : 'text-slate-700'}`}>{request?.image_path ? 'ดูรูปภาพ' : 'ไม่ได้ระบุรูปภาพ'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <BsBoxSeam size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลอุปกรณ์</h2>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ชื่อครุภัณฑ์</label>
                                        <p className='text-slate-700 text-base'>{request?.equipment_name || 'ยังไม่ระบุชื่อครุภัณฑ์'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">รหัสครุภัณฑ์</label>
                                        <p className='text-slate-700 text-base'>{request?.equipment_code || 'ยังไม่ระบุรหัสครุภัณฑ์'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">หมวดหมู่</label>
                                        <p className='text-slate-700 text-base'>{request?.category_name || 'ยังไม่ระบุหมวดหมู่'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                        <FiUser size={20} className='text-green-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลผู้แจ้ง</h2>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ชื่อ-นามสกุล</label>
                                        <p className='text-slate-700 text-base'>{request?.creator_name || 'ยังไม่ระบุชื่อ-นามสกุล'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=''>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                    <div className='flex items-center gap-x-4 mb-6'>
                                        <div className='size-10 border  border-green-400 rounded-full flex items-center justify-center'>
                                            <PiNewspaper size={20} className='text-green-600' />
                                        </div>
                                        <div>
                                            <h2 className='text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ดำเนินการคำขอ</h2>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='flex flex-col gap-2'>
                                            <label className=' text-gray-600'>ประเภทการซ่อม</label>
                                            <Select className='w-full'
                                                value={selectedMaintenanceOption}
                                                options={maintenanceOptions}
                                                onChange={setSelectedMaintenanceOption}
                                                placeholder="เลือกประเภทการซ่อม"
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                menuPlacement="auto"
                                                menuShouldBlockScroll={true}
                                                menuShouldScrollIntoView={false}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
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
                                                        zIndex: 999, // รวม zIndex ไว้ใน control เดียว
                                                    }),
                                                    placeholder: (base) => ({
                                                        ...base,
                                                        color: '#868686',
                                                    }),
                                                }}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <label className=' text-gray-600'>สถานะอุปกรณ์</label>
                                            <Select className='w-full'
                                                value={selectedUsageOption}
                                                options={usageOptions}
                                                onChange={setSelectedUsageOption}
                                                placeholder="เลือกสถานะอุปกรณ์"
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                menuPlacement="auto"
                                                menuShouldBlockScroll={true}
                                                menuShouldScrollIntoView={false}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
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
                                                        zIndex: 999, // รวม zIndex ไว้ใน control เดียว
                                                    }),
                                                    placeholder: (base) => ({
                                                        ...base,
                                                        color: '#868686',
                                                    }),
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-end gap-x-4 text-[15px]'>
                                    <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                                    <button type='submit' className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>
                                        เปลี่ยนสถานะ
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {previewOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-[rgba(0,0,0,0.4)]" onClick={closePreview}>
                    <div className="relative max-w-[60vw] max-h-[80vh]">
                        <button onClick={closePreview} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB] absolute top-5 right-5'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                        <img src={previewSrc} alt="preview" className="max-w-full max-h-[80vh] rounded" />
                    </div>
                </div>
            )}
            {submitLoading && <SubmitLoading />}
        </div>
    )
}

/* 1. รายการซ่อมแซม */
export function RequestRepair() {
    const [requestRepairModal, setRequestRepairModal] = useState(null);
    const [repairRequests, setRepairRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [searchCode, setSearchCode] = useState('');
    const [maintenance_request_code, setMaintenanceRequestCode] = useState('');
    const [urgencyLevel, setUrgencyLevel] = useState([]);
    const [selectedUrgencyLevel, setSelectedUrgencyLevel] = useState(null);

    const [loading, setLoading] = useState(true);
    const fetchRepairRequests = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/maintenance-request/repair', {
                params: {
                    page,
                    limit: itemsPerPage,
                    maintenance_request_code: maintenance_request_code.trim(),
                    urgency_level: selectedUrgencyLevel ? selectedUrgencyLevel.value : '',
                }
            });
            setRepairRequests(response.data.data || []);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.total || 0);
            setItemsPerPage(response.data.pagination?.limit || 10);
        } catch (error) {
            console.error("Error fetching repair requests:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchRepairRequests(currentPage);
    }, [currentPage, maintenance_request_code, selectedUrgencyLevel]);
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedUrgencyLevel]);

    const fetchUrgencyLevels = async () => {
        try {
            const response = await axios.get('/api/users/maintenance-request/status/urgency-levels');
            const urgencyLevelNameTH = {
                low: "ต่ำ",
                medium: "ปานกลาง",
                high: "สูง",
                critical: "เร่งด่วน"
            };
            const options = response.data.map((status) => ({
                value: status.level,
                label: urgencyLevelNameTH[status.level] || status.level
            }));
            setUrgencyLevel(options);
        } catch (error) {
            console.error('Error fetching urgency levels:', error);
        }
    }
    useEffect(() => {
        fetchUrgencyLevels();
    }, []);
    useEffect(() => {
        const handler = setTimeout(() => {
            setMaintenanceRequestCode(searchCode);
            setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
            // setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
        }, 500); // 500ms หลังหยุดพิมพ์
        return () => clearTimeout(handler);
    }, [searchCode]);

    const handleClear = () => {
        setSearchCode('');
        setMaintenanceRequestCode('');
        setSelectedUrgencyLevel(null);
        setCurrentPage(1);
    }
    const urgencyLevelNameTH = {
        'low': 'ต่ำ',
        'medium': 'ปานกลาง',
        'high': 'สูง',
        'critical': 'เร่งด่วน'
    }
    return (
        <div id="request-repair-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการซ่อมแซม</h2>
            </div>
            <form className="mb-6 flex justify-between items-center" action="">
                <div className="flex items-center gap-x-4">
                    <div className="flex items-center w-[250px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none">
                        <PiToolbox size={25} className='text-gray-400' />
                        <input
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            className="w-full text-[#4E5155] duration-300 focus:outline-none"
                            type="text"
                            placeholder="ค้นหาด้วยรหัส"
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
                        options={urgencyLevel}
                        value={selectedUrgencyLevel}
                        onChange={setSelectedUrgencyLevel}
                        placeholder="ประเภทความเร่งด่วน"
                    />

                </div>
                <div className="flex items-stretch gap-x-4">
                    <button
                        onClick={handleClear}
                        type="button"
                        className="flex items-center justify-center gap-x-2 h-[40px] text-[14px] px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-[5px] font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                    >
                        <span><IoRefresh size={20} className='text-gray-500' /></span>
                    </button>

                </div>
            </form>
            <div>
                {loading ? <DataLoading /> : repairRequests.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการแจ้งซ่อมครุภัณฑ์ในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้แจ้งซ่อม</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสแจ้งซ่อม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รายละเอียด
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ความเร่งด่วน
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่แจ้ง
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repairRequests.map((req) =>
                                    <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{req.maintenance_request_code}</td>
                                        <td className='p-4'>{req.issue_description}</td>
                                        <td className='p-4'>{req.urgency_level ? urgencyLevelNameTH[req.urgency_level] : ''}</td>
                                        <td className='p-4'>{dayjs(req.request_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-yellow-50 border border-yellow-200 text-yellow-700'>
                                                <div className='w-2 h-2 rounded-full bg-yellow-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{req.maintenance_type && 'ซ่อมแซม'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setRequestRepairModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {repairRequests.length > 0 && (
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
            {requestRepairModal && <RequestDetailModal request={requestRepairModal} onClose={() => setRequestRepairModal(null)} refresh={fetchRepairRequests} />}
        </div>
    )
}

/* 2. รายการบำรุงรักษา */
export function RequestMaintenance() {
    const [requestMaintenanceModal, setRequestMaintenanceModal] = useState(null);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [searchCode, setSearchCode] = useState('');
    const [maintenance_request_code, setMaintenanceRequestCode] = useState('');
    const [urgencyLevel, setUrgencyLevel] = useState([]);
    const [selectedUrgencyLevel, setSelectedUrgencyLevel] = useState(null);

    const [loading, setLoading] = useState(true);
    const fetchMaintenanceRequests = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/maintenance-request/maintenance', {
                params: {
                    page,
                    limit: itemsPerPage,
                    maintenance_request_code: maintenance_request_code.trim(),
                    urgency_level: selectedUrgencyLevel ? selectedUrgencyLevel.value : '',
                }
            });
            setMaintenanceRequests(response.data.data || []);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.total || 0);
            setItemsPerPage(response.data.pagination?.limit || 10);
        } catch (error) {
            console.error("Error fetching maintenance requests:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchMaintenanceRequests(currentPage);
    }, [currentPage, maintenance_request_code, selectedUrgencyLevel]);
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedUrgencyLevel]);

    const fetchUrgencyLevels = async () => {
        try {
            const response = await axios.get('/api/users/maintenance-request/status/urgency-levels');
            const urgencyLevelNameTH = {
                low: "ต่ำ",
                medium: "ปานกลาง",
                high: "สูง",
                critical: "เร่งด่วน"
            };
            const options = response.data.map((status) => ({
                value: status.level,
                label: urgencyLevelNameTH[status.level] || status.level
            }));
            setUrgencyLevel(options);
        } catch (error) {
            console.error('Error fetching urgency levels:', error);
        }
    }
    useEffect(() => {
        fetchUrgencyLevels();
    }, []);
    useEffect(() => {
        const handler = setTimeout(() => {
            setMaintenanceRequestCode(searchCode);
            setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
            // setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
        }, 500); // 500ms หลังหยุดพิมพ์
        return () => clearTimeout(handler);
    }, [searchCode]);

    const handleClear = () => {
        setSearchCode('');
        setMaintenanceRequestCode('');
        setSelectedUrgencyLevel(null);
        setCurrentPage(1);
    }
    const urgencyLevelNameTH = {
        'low': 'ต่ำ',
        'medium': 'ปานกลาง',
        'high': 'สูง',
        'critical': 'เร่งด่วน'
    }
    return (
        <div id="request-maintenance-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการบำรุงรักษา</h2>
            </div>
            <form className="mb-6 flex justify-between items-center" action="">
                <div className="flex items-center gap-x-4">
                    <div className="flex items-center w-[250px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none">
                        <PiToolbox size={25} className='text-gray-400' />
                        <input
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            className="w-full text-[#4E5155] duration-300 focus:outline-none"
                            type="text"
                            placeholder="ค้นหาด้วยรหัส"
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
                        options={urgencyLevel}
                        value={selectedUrgencyLevel}
                        onChange={setSelectedUrgencyLevel}
                        placeholder="ประเภทความเร่งด่วน"
                    />

                </div>
                <div className="flex items-stretch gap-x-4">
                    <button
                        onClick={handleClear}
                        type="button"
                        className="flex items-center justify-center gap-x-2 h-[40px] text-[14px] px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-[5px] font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                    >
                        <span><IoRefresh size={20} className='text-gray-500' /></span>
                    </button>

                </div>
            </form>
            <div>
                {loading ? <DataLoading /> : maintenanceRequests.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการแจ้งซ่อมครุภัณฑ์ในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้แจ้งซ่อม</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสแจ้งซ่อม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รายละเอียด
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ความเร่งด่วน
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่แจ้ง
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maintenanceRequests.map((req) =>
                                    <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{req.maintenance_request_code}</td>
                                        <td className='p-4'>{req.issue_description}</td>
                                        <td className='p-4'>{req.urgency_level ? urgencyLevelNameTH[req.urgency_level] : ''}</td>
                                        <td className='p-4'>{dayjs(req.request_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-blue-50 border border-blue-200 text-blue-700'>
                                                <div className='w-2 h-2 rounded-full bg-blue-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{req.maintenance_type && 'บำรุงรักษา'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setRequestMaintenanceModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {maintenanceRequests.length > 0 && (
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
            {requestMaintenanceModal && <RequestDetailModal request={requestMaintenanceModal} onClose={() => setRequestMaintenanceModal(null)} refresh={fetchMaintenanceRequests} />}
        </div>
    )
}

/* 3. รายการตรวจสอบ */
export function RequestInspection() {
    const [requestInspectionModal, setRequestInspectionModal] = useState(null);
    const [inspectionRequests, setInspectionRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [searchCode, setSearchCode] = useState('');
    const [maintenance_request_code, setMaintenanceRequestCode] = useState('');
    const [urgencyLevel, setUrgencyLevel] = useState([]);
    const [selectedUrgencyLevel, setSelectedUrgencyLevel] = useState(null);

    const [loading, setLoading] = useState(true);
    const fetchInspectionRequests = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/maintenance-request/inspection', {
                params: {
                    page,
                    limit: itemsPerPage,
                    maintenance_request_code: maintenance_request_code.trim(),
                    urgency_level: selectedUrgencyLevel ? selectedUrgencyLevel.value : ''
                }
            });
            setInspectionRequests(response.data.data || []);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.total || 0);
            setItemsPerPage(response.data.pagination?.limit || 10);
        } catch (error) {
            console.error("Error fetching maintenance requests:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchInspectionRequests(currentPage);
    }, [currentPage, maintenance_request_code, selectedUrgencyLevel]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedUrgencyLevel]);

    const fetchUrgencyLevels = async () => {
        try {
            const response = await axios.get('/api/users/maintenance-request/status/urgency-levels');
            const urgencyLevelNameTH = {
                low: "ต่ำ",
                medium: "ปานกลาง",
                high: "สูง",
                critical: "เร่งด่วน"
            };
            const options = response.data.map((status) => ({
                value: status.level,
                label: urgencyLevelNameTH[status.level] || status.level
            }));
            setUrgencyLevel(options);
        } catch (error) {
            console.error('Error fetching urgency levels:', error);
        }
    }
    useEffect(() => {
        fetchUrgencyLevels();
    }, []);
    useEffect(() => {
        const handler = setTimeout(() => {
            setMaintenanceRequestCode(searchCode);
            setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
            // setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
        }, 500); // 500ms หลังหยุดพิมพ์
        return () => clearTimeout(handler);
    }, [searchCode]);

    const handleClear = () => {
        setSearchCode('');
        setMaintenanceRequestCode('');
        setSelectedUrgencyLevel(null);
        setCurrentPage(1);
    }
    const urgencyLevelNameTH = {
        'low': 'ต่ำ',
        'medium': 'ปานกลาง',
        'high': 'สูง',
        'critical': 'เร่งด่วน'
    }

    return (
        <div id="request-inspection-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการตรวจสอบ</h2>
            </div>

            <form className="mb-6 flex justify-between items-center" action="">
                <div className="flex items-center gap-x-4">
                    <div className="flex items-center w-[250px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none">
                        <PiToolbox size={25} className='text-gray-400' />
                        <input
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            className="w-full text-[#4E5155] duration-300 focus:outline-none"
                            type="text"
                            placeholder="ค้นหาด้วยรหัส"
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
                        options={urgencyLevel}
                        value={selectedUrgencyLevel}
                        onChange={setSelectedUrgencyLevel}
                        placeholder="ประเภทความเร่งด่วน"
                    />

                </div>
                <div className="flex items-stretch gap-x-4">
                    <button
                        onClick={handleClear}
                        type="button"
                        className="flex items-center justify-center gap-x-2 h-[40px] text-[14px] px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-[5px] font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                    >
                        <span><IoRefresh size={20} className='text-gray-500' /></span>
                    </button>

                </div>
            </form>

            <div>
                {loading ? <DataLoading /> : inspectionRequests.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการแจ้งซ่อมครุภัณฑ์ในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้แจ้งซ่อม</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสแจ้งซ่อม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รายละเอียด
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ความเร่งด่วน
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่แจ้ง
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inspectionRequests.map((req) =>
                                    <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{req.maintenance_request_code}</td>
                                        <td className='p-4'>{req.issue_description}</td>
                                        <td className='p-4'>{req.urgency_level ? urgencyLevelNameTH[req.urgency_level] : ''}</td>
                                        <td className='p-4'>{dayjs(req.request_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-purple-50 border border-purple-200 text-purple-700'>
                                                <div className='w-2 h-2 rounded-full bg-purple-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{req.maintenance_type && 'ตรวจสอบ'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setRequestInspectionModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {inspectionRequests.length > 0 && (
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
            {requestInspectionModal && <RequestDetailModal request={requestInspectionModal} onClose={() => setRequestInspectionModal(null)} refresh={fetchInspectionRequests} />}
        </div>
    )
}

/* 4. รายการเปลี่ยนทดแทน */
export function RequestReplacement() {
    const [requestReplacementModal, setRequestReplacementModal] = useState(null);
    const [replacementRequests, setReplacementRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [searchCode, setSearchCode] = useState('');
    const [maintenance_request_code, setMaintenanceRequestCode] = useState('');
    const [urgencyLevel, setUrgencyLevel] = useState([]);
    const [selectedUrgencyLevel, setSelectedUrgencyLevel] = useState(null);

    const [loading, setLoading] = useState(true);
    const fetchReplacementRequests = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/maintenance-request/replacement',
                {
                    params: {
                        page, limit: itemsPerPage,
                        maintenance_request_code: maintenance_request_code.trim(),
                        urgency_level: selectedUrgencyLevel ? selectedUrgencyLevel.value : ''
                    }
                }
            );
            setReplacementRequests(response.data.data || []);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.total || 0);
            setItemsPerPage(response.data.pagination?.limit || 10);
        } catch (error) {
            console.error("Error fetching maintenance requests:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchReplacementRequests(currentPage);
    }, [currentPage, maintenance_request_code, selectedUrgencyLevel]);
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedUrgencyLevel]);

    const fetchUrgencyLevels = async () => {
        try {
            const response = await axios.get('/api/users/maintenance-request/status/urgency-levels');
            const urgencyLevelNameTH = {
                low: "ต่ำ",
                medium: "ปานกลาง",
                high: "สูง",
                critical: "เร่งด่วน"
            };
            const options = response.data.map((status) => ({
                value: status.level,
                label: urgencyLevelNameTH[status.level] || status.level
            }));
            setUrgencyLevel(options);
        } catch (error) {
            console.error('Error fetching urgency levels:', error);
        }
    }
    useEffect(() => {
        fetchUrgencyLevels();
    }, []);
    useEffect(() => {
        const handler = setTimeout(() => {
            setMaintenanceRequestCode(searchCode);
            setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
            // setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
        }, 500); // 500ms หลังหยุดพิมพ์
        return () => clearTimeout(handler);
    }, [searchCode]);

    const handleClear = () => {
        setSearchCode('');
        setSelectedUrgencyLevel(null);
        setMaintenanceRequestCode('');
        setCurrentPage(1);
    }
    const urgencyLevelNameTH = {
        'low': 'ต่ำ',
        'medium': 'ปานกลาง',
        'high': 'สูง',
        'critical': 'เร่งด่วน'
    }
    return (
        <div id="request-replacement-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการเปลี่ยนใหม่</h2>
            </div>

            <form className="mb-6 flex justify-between items-center" action="">
                <div className="flex items-center gap-x-4">
                    <div className="flex items-center w-[250px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none">
                        <PiToolbox size={25} className='text-gray-400' />
                        <input
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            className="w-full text-[#4E5155] duration-300 focus:outline-none"
                            type="text"
                            placeholder="ค้นหาด้วยรหัส"
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
                        options={urgencyLevel}
                        value={selectedUrgencyLevel}
                        onChange={setSelectedUrgencyLevel}
                        placeholder="ประเภทความเร่งด่วน"
                    />

                </div>
                <div className="flex items-stretch gap-x-4">
                    <button
                        onClick={handleClear}
                        type="button"
                        className="flex items-center justify-center gap-x-2 h-[40px] text-[14px] px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-[5px] font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                    >
                        <span><IoRefresh size={20} className='text-gray-500' /></span>
                    </button>

                </div>
            </form>
            <div>
                {loading ? <DataLoading /> : replacementRequests.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการแจ้งซ่อมครุภัณฑ์ในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้แจ้งซ่อม</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสแจ้งซ่อม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รายละเอียด
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ความเร่งด่วน
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่แจ้ง
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {replacementRequests.map((req) =>
                                    <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{req.maintenance_request_code}</td>
                                        <td className='p-4'>{req.issue_description}</td>
                                        <td className='p-4'>{req.urgency_level ? urgencyLevelNameTH[req.urgency_level] : ''}</td>
                                        <td className='p-4'>{dayjs(req.request_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-green-50 border border-green-200 text-green-700'>
                                                <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{req.maintenance_type && 'เปลี่ยนใหม่'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setRequestReplacementModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {replacementRequests.length > 0 && (
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
            {requestReplacementModal && <RequestDetailModal request={requestReplacementModal} onClose={() => setRequestReplacementModal(null)} refresh={fetchReplacementRequests} />}
        </div>
    )
}

/* รายการทั้งหมด */
export function RequestAll() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [requestAllModal, setRequestAllModal] = useState(null);
    const [requestAll, setRequestAll] = useState([]);

    const [searchCode, setSearchCode] = useState('');
    const [maintenance_request_code, setMaintenanceRequestCode] = useState('');
    const [urgencyLevel, setUrgencyLevel] = useState([]);
    const [selectedUrgencyLevel, setSelectedUrgencyLevel] = useState(null);

    const [loading, setLoading] = useState(true);
    const fetchAllRequest = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/maintenance-request', {
                params: {
                    page,
                    limit: itemsPerPage,
                    maintenance_request_code: maintenance_request_code.trim(),
                    urgency_level: selectedUrgencyLevel ? selectedUrgencyLevel.value : ''
                }
            });
            setRequestAll(response.data.data);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.total || 0);
            setItemsPerPage(response.data.pagination?.limit || 10);
        } catch (error) {
            console.error("Error fetching all requests:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAllRequest(currentPage);
    }, [currentPage, maintenance_request_code, selectedUrgencyLevel]);
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedUrgencyLevel]);

    const fetchUrgencyLevels = async () => {
        try {
            const response = await axios.get('/api/users/maintenance-request/status/urgency-levels');
            const urgencyLevelNameTH = {
                low: "ต่ำ",
                medium: "ปานกลาง",
                high: "สูง",
                critical: "เร่งด่วน"
            };
            const options = response.data.map((status) => ({
                value: status.level,
                label: urgencyLevelNameTH[status.level] || status.level
            }));
            setUrgencyLevel(options);
        } catch (error) {
            console.error('Error fetching urgency levels:', error);
        }
    }
    useEffect(() => {
        fetchUrgencyLevels();
    }, []);
    useEffect(() => {
        const handler = setTimeout(() => {
            setMaintenanceRequestCode(searchCode);
            setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
            // setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
        }, 500); // 500ms หลังหยุดพิมพ์
        return () => clearTimeout(handler);
    }, [searchCode]);

    const handleClear = () => {
        setSearchCode('');
        setSelectedUrgencyLevel(null);
        setMaintenanceRequestCode('');
        setCurrentPage(1);
    }
    const statusColor = {
        'repair': {
            bg: 'bg-yellow-50 border border-yellow-200',
            border: 'border-yellow-200',
            dot: 'bg-yellow-500',
            text: 'text-yellow-700',
            label: 'ซ่อมแซม'
        },
        'maintenance': {
            bg: 'bg-blue-50 border border-blue-200',
            border: 'border-blue-200',
            dot: 'bg-blue-500',
            text: 'text-blue-700',
            label: 'บำรุงรักษา'
        },
        'inspection': {
            bg: 'bg-purple-50 border border-purple-200',
            border: 'border-purple-200',
            dot: 'bg-purple-500',
            text: 'text-purple-700',
            label: 'ตรวจสอบ'
        },
        'replacement': {
            bg: 'bg-green-50 border border-green-200',
            border: 'border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'เปลี่ยนใหม่'
        },
        'completed': {
            bg: 'bg-emerald-50 border border-emerald-200',
            border: 'border-emerald-200',
            dot: 'bg-emerald-500',
            text: 'text-emerald-700',
            label: 'เสร็จสิ้น'
        }
    };
    const urgencyLevelNameTH = {
        'low': 'ต่ำ',
        'medium': 'ปานกลาง',
        'high': 'สูง',
        'critical': 'เร่งด่วน'
    }
    return (
        <div id="request-all-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการทั้งหมด</h2>
            </div>
            <form className="mb-6 flex justify-between items-center" action="">
                <div className="flex items-center gap-x-4">
                    <div className="flex items-center w-[250px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none">
                        <PiToolbox size={25} className='text-gray-400' />
                        <input
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            className="w-full text-[#4E5155] duration-300 focus:outline-none"
                            type="text"
                            placeholder="ค้นหาด้วยรหัส"
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
                        options={urgencyLevel}
                        value={selectedUrgencyLevel}
                        onChange={setSelectedUrgencyLevel}
                        placeholder="ประเภทความเร่งด่วน"
                    />

                </div>
                <div className="flex items-stretch gap-x-4">
                    <button
                        onClick={handleClear}
                        type="button"
                        className="flex items-center justify-center gap-x-2 h-[40px] text-[14px] px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-[5px] font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                    >
                        <span><IoRefresh size={20} className='text-gray-500' /></span>
                    </button>

                </div>
            </form>
            <div>
                <div>
                    {loading ? <DataLoading /> : requestAll.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                        <div className='mb-3'>
                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                        </div>
                        <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการแจ้งซ่อมครุภัณฑ์ในขณะนี้</p>
                        <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้แจ้งซ่อม</p>
                    </div> :
                        <div>
                            <table className='w-full tracking-[.5px] text-left border-collapse'>
                                <thead className='bg-slate-50 border border-gray-300'>
                                    <tr className='text-sm text-gray-700'>
                                        <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                            รหัสแจ้งซ่อม
                                        </span></th>
                                        {/* <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                    ผู้แจ้ง
                                </span></th> */}
                                        <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                            รายละเอียด
                                        </span></th>
                                        <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                            ความเร่งด่วน
                                        </span></th>
                                        <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                            วันที่แจ้ง
                                        </span></th>
                                        <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                        <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requestAll.map((req) =>
                                        <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                            <td className='p-4'>{req.maintenance_request_code}</td>
                                            {/* <td className='p-4'>{req.first_name} {req.last_name}</td> */}
                                            <td className='p-4'>{req.issue_description}</td>
                                            <td className='p-4'>{req.urgency_level ? urgencyLevelNameTH[req.urgency_level] : ''}</td>
                                            <td className='p-4'>{dayjs(req.request_date).format('DD/MM/YYYY')}</td>
                                            <td className='p-4'>
                                                {statusColor[req.maintenance_type] && (
                                                    <div className={`flex items-center gap-x-2 w-[120px] rounded-lg px-3 py-1 ${statusColor[req.maintenance_type].bg} `}>
                                                        {/* border  ${statusColor[req.status].border} */}
                                                        <div className={`size-[7px] rounded-full ${statusColor[req.maintenance_type].dot}`}></div>
                                                        <span className={`cursor-default ${statusColor[req.maintenance_type].text} text-[13px]`}>
                                                            {statusColor[req.maintenance_type].label}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className='p-4'>
                                                <div className=''>
                                                    <button onClick={() => setRequestAllModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {requestAll.length > 0 && (
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
            </div>
            {requestAllModal && <RequestDetailModal request={requestAllModal} onClose={() => setRequestAllModal(null)} refresh={fetchAllRequest} />}
        </div>
    )
}

/* 5. เสร็จสิ้น */
export function RequestCompleted() {
    const [requestCompletedModal, setRequestCompletedModal] = useState(null);
    const [completedRequests, setCompletedRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [searchCode, setSearchCode] = useState('');
    const [maintenance_request_code, setMaintenanceRequestCode] = useState('');
    const [urgencyLevel, setUrgencyLevel] = useState([]);
    const [selectedUrgencyLevel, setSelectedUrgencyLevel] = useState(null);

    const [loading, setLoading] = useState(true);
    const fetchCompletedRequests = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/maintenance-request/completed',
                {
                    params: {
                        page, limit: itemsPerPage,
                        maintenance_request_code: maintenance_request_code.trim(),
                        urgency_level: selectedUrgencyLevel ? selectedUrgencyLevel.value : ''
                    }
                }
            );
            setCompletedRequests(response.data.data || []);
            // setCurrentPage(response.data.pagination?.currentPage || 1);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.total || 0);
            setItemsPerPage(response.data.pagination?.limit || 10);

        } catch (error) {
            console.error("Error fetching completed requests:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchCompletedRequests(currentPage);
    }, [currentPage, maintenance_request_code, selectedUrgencyLevel]);
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedUrgencyLevel]);

    const fetchUrgencyLevels = async () => {
        try {
            const response = await axios.get('/api/users/maintenance-request/status/urgency-levels');
            const urgencyLevelNameTH = {
                low: "ต่ำ",
                medium: "ปานกลาง",
                high: "สูง",
                critical: "เร่งด่วน"
            };
            const options = response.data.map((status) => ({
                value: status.level,
                label: urgencyLevelNameTH[status.level] || status.level
            }));
            setUrgencyLevel(options);
        } catch (error) {
            console.error('Error fetching urgency levels:', error);
        }
    }
    useEffect(() => {
        fetchUrgencyLevels();
    }, []);
    useEffect(() => {
        const handler = setTimeout(() => {
            setMaintenanceRequestCode(searchCode);
            setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
            // setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
        }, 500); // 500ms หลังหยุดพิมพ์
        return () => clearTimeout(handler);
    }, [searchCode]);

    const handleClear = () => {
        setSearchCode('');
        setSelectedUrgencyLevel(null);
        setMaintenanceRequestCode('');
        setCurrentPage(1);
    }
    const urgencyLevelNameTH = {
        'low': 'ต่ำ',
        'medium': 'ปานกลาง',
        'high': 'สูง',
        'critical': 'เร่งด่วน'
    }

    return (
        <div id="request-replacement-components">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการซ่อมเสร็จสิ้น</h2>
            </div>
            <form className="mb-6 flex justify-between items-center" action="">
                <div className="flex items-center gap-x-4">
                    <div className="flex items-center w-[250px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none">
                        <PiToolbox size={25} className='text-gray-400' />
                        <input
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            className="w-full text-[#4E5155] duration-300 focus:outline-none"
                            type="text"
                            placeholder="ค้นหาด้วยรหัส"
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
                        options={urgencyLevel}
                        value={selectedUrgencyLevel}
                        onChange={setSelectedUrgencyLevel}
                        placeholder="ประเภทความเร่งด่วน"
                    />

                </div>
                <div className="flex items-stretch gap-x-4">
                    <button
                        onClick={handleClear}
                        type="button"
                        className="flex items-center justify-center gap-x-2 h-[40px] text-[14px] px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-[5px] font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                    >
                        <span><IoRefresh size={20} className='text-gray-500' /></span>
                    </button>

                </div>
            </form>
            <div>
                {loading ? <DataLoading /> : completedRequests.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีรายการแจ้งซ่อมครุภัณฑ์ในขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณารอผู้ใช้แจ้งซ่อม</p>
                </div> :
                    <div>
                        <table className='w-full tracking-[.5px] text-left border-collapse'>
                            <thead className='bg-slate-50 border border-gray-300'>
                                <tr className='text-sm text-gray-700'>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รหัสแจ้งซ่อม
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        รายละเอียด
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        ความเร่งด่วน
                                    </span></th>
                                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                        วันที่แจ้ง
                                    </span></th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>สถานะ</th>
                                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedRequests.map((req) =>
                                    <tr key={req.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                        <td className='p-4'>{req.maintenance_request_code}</td>
                                        <td className='p-4'>{req.issue_description}</td>
                                        <td className='p-4'>{req.urgency_level ? urgencyLevelNameTH[req.urgency_level] : ''}</td>
                                        <td className='p-4'>{dayjs(req.request_date).format('DD/MM/YYYY')}</td>
                                        <td className='p-4'>
                                            <div className='inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700'>
                                                <div className='w-2 h-2 rounded-full bg-emerald-500'></div>
                                                <span className='text-xs font-medium tracking-wide'>{req.maintenance_type && 'เสร็จสิ้น'}</span>
                                            </div>
                                        </td>
                                        <td className='p-4'>
                                            <div className=''>
                                                <button onClick={() => setRequestCompletedModal(req)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] text-[14px]'><PiNewspaper size={20} /> <span>ตรวจสอบ</span></button>
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
            {requestCompletedModal && <RequestDetailModal request={requestCompletedModal} onClose={() => setRequestCompletedModal(null)} refresh={fetchCompletedRequests} />}
        </div>
    )
}