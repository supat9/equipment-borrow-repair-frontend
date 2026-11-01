'use client';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import Swal from 'sweetalert2';
import ActiveSwitch from '@/components/inputs/ActiveSwitch';
import { SubmitLoading, DataLoading } from '@/components/users/loading/LoadingOverlay';

export function Building() {
    const [addBuildingModal, setAddBuildingModal] = useState(false);
    const [editBuildingModal, setEditBuildingModal] = useState(null);
    const [buildingList, setBuildingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const statusColor = {
        1: {
            bg: 'bg-green-50 border border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'ใช้งาน'
        },
        0: {
            bg: 'bg-red-50 border border-red-200',
            dot: 'bg-red-500',
            text: 'text-red-700',
            label: 'ไม่ได้ใช้งาน'
        }
    };
    const fetchBuildings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/building');
            setBuildingList(response.data);
        } catch (error) {
            console.error("Fetch building list error:", error);
        } finally {
            setLoading(false);
        }
    }, [])
    useEffect(() => {
        fetchBuildings();
    }, [fetchBuildings]);
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
            title: "ไม่สามารถลบอาคารได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const handleDelete = async (building) => {
        try {
            const confirmed = await Swal.fire({
                title: 'ยืนยันการลบ',
                text: `คุณต้องการลบ "${building.building_name}" หรือไม่?`,
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
            const id = building?.id;
            const response = await axios.delete(`/api/staff/building/${encodeURIComponent(id)}`);
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || `ลบอาคาร "${building.building_name}" สำเร็จ`,
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1BC688',
                customClass: {
                    container: 'z-[10000]'
                }
            });
            fetchBuildings();
        } catch (error) {
            console.error("Delete building error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="building">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการอาคาร</h2>
                <button onClick={() => setAddBuildingModal(true)} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><HiOutlinePlusSmall size={23} /> <span>เพิ่มอาคาร</span></button>
            </div>
            <div>
                {loading ? <DataLoading /> : <table className='w-full tracking-[.5px] text-left border-collapse'>
                    <thead className='bg-slate-50 border border-gray-300'>
                        <tr className='text-sm text-gray-700'>
                            <th className='font-light text-[#606060] px-4 py-3 rounded-l-[3px]'>รหัส</th>
                            <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                ชื่ออาคาร
                            </span></th>
                            <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                รายละเอียด
                            </span></th>
                            <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                สถานะ
                            </span></th>
                            <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการสถานที่</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buildingList.map((building) => (
                            <tr key={building.building_code} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                <td className='p-4'>{building.building_code}</td>
                                <td className='p-4'>{building.building_name}</td>
                                <td className='p-4'>{building.description || '-'}</td>
                                <td className='p-4'>
                                    {statusColor[building.is_active] && (
                                        <div className={`inline-flex items-center w-[100px] gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${statusColor[building.is_active].bg} ${statusColor[building.is_active].text}`}>
                                            <div className={`size-2 rounded-full ${statusColor[building.is_active].dot}`}></div>
                                            <span className="text-xs font-medium tracking-wide">
                                                {statusColor[building.is_active].label}
                                            </span>
                                        </div>
                                    )}</td>
                                <td className='p-4'>
                                    <div className='flex items-center gap-x-4'>
                                        <button onClick={() => setEditBuildingModal(building)} className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                            <CiEdit className="text-gray-600" size={20} />
                                        </button>
                                        <button onClick={() => handleDelete(building)} className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                            <PiTrashLight className="text-gray-600" size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
            </div>
            {addBuildingModal && <AddBuildingModal onClose={() => setAddBuildingModal(false)} refresh={fetchBuildings} />}
            {editBuildingModal && <EditBuildingModal building={editBuildingModal} onClose={() => setEditBuildingModal(null)} refresh={fetchBuildings} />}
            {submitLoading && <SubmitLoading />}
        </div>
    )
}

export function AddBuildingModal({ onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [buildingCode, setBuildingCode] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(1);
    const [submitLoading, setSubmitLoading] = useState(false);
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
            title: "ไม่สามารถเพิ่มอาคารได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (buildingCode && buildingName) {
                const confirmed = await Swal.fire({
                    title: 'ยืนยันการการเพิ่ม?',
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
            const response = await axios.post('/api/staff/building', {
                buildingCode,
                buildingName,
                description,
                isActive
            });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || 'เพิ่มอาคารเรียบร้อยแล้ว',
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
            console.error("Add building error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="add-building-model">
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[400px] max-w-[650px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>เพิ่มอาคาร</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <form onSubmit={handleSubmit}>
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                <div className='flex flex-col gap-y-2'>
                                    <label className='text-gray-600' htmlFor="buildingCode">รหัสอาคาร</label>
                                    <input autoFocus value={buildingCode} onChange={(e) => setBuildingCode(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='Q05' type="text" id="buildingCode" name="buildingCode" />
                                </div>
                                <div className='flex flex-col gap-y-2'>
                                    <label className='text-gray-600' htmlFor="buildingName">ชื่ออาคาร</label>
                                    <input value={buildingName} onChange={(e) => setBuildingName(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='อาคาร SC-11' type="text" id="buildingName" name="buildingName" />
                                </div>
                            </div>
                            <div className='flex flex-col gap-y-2 mb-6'>
                                <label className='text-gray-600' htmlFor="desc">รายละเอียด</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='ตึกสาขาเทคโนโลยีสารสนเทศ' id="desc" name="desc" ></textarea>
                            </div>
                            <div className='flex items-center justify-end gap-x-4 mb-6'>
                                <label className='text-gray-600' htmlFor="">สถานะการใช้งาน</label>
                                <ActiveSwitch checked={isActive} onChange={setIsActive} />
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                                <button type='submit' className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] '>
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {submitLoading && <SubmitLoading />}
        </div>
    )
}

export function EditBuildingModal({ building, onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [buildingCode, setBuildingCode] = useState(building?.building_code || '');
    const [buildingName, setBuildingName] = useState(building?.building_name || '');
    const [description, setDescription] = useState(building?.description || '');
    const [isActive, setIsActive] = useState(building?.is_active);
    const [submitLoading, setSubmitLoading] = useState(false);
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
            title: "ไม่สามารถแก้ไขอาคารได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (buildingCode && buildingName && isActive !== null) {
                const confirmed = await Swal.fire({
                    title: 'ยืนยันการแก้ไข?',
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
                if (!confirmed.isConfirmed) {
                    return;
                }
            }
            setSubmitLoading(true);
            const id = building.id;
            const response = await axios.put(`/api/staff/building/${encodeURIComponent(id)}`, {
                buildingCode,
                buildingName,
                description,
                isActive
            });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || 'แก้ไขอาคารเรียบร้อยแล้ว',
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
            console.error("Add building error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="update-building-model">
            <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[400px] max-w-[600px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>แก้ไขข้อมูลอาคาร</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <form onSubmit={handleSubmit}>
                            <div className='grid grid-cols-2 gap-x-4 mb-6'>
                                <div className='flex flex-col gap-y-2'>
                                    <label className='text-gray-600' htmlFor="buildingCode">รหัสอาคาร</label>
                                    <input value={buildingCode} onChange={(e) => setBuildingCode(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='Q05' type="text" id="buildingCode" name="buildingCode" />
                                </div>
                                <div className='flex flex-col gap-y-2'>
                                    <label className='text-gray-600' htmlFor="buildingName">ชื่ออาคาร</label>
                                    <input value={buildingName} onChange={(e) => setBuildingName(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='อาคาร SC-11' type="text" id="buildingName" name="buildingName" />
                                </div>
                            </div>
                            <div className='flex flex-col gap-y-2 mb-6'>
                                <label className='text-gray-600' htmlFor="desc">รายละเอียด</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='ตึกสาขาเทคโนโลยีสารสนเทศ' id="desc" name="desc" ></textarea>
                            </div>
                            <div className='flex items-center justify-end gap-x-4 mb-6'>
                                <label className='text-gray-600' htmlFor="">สถานะการใช้งาน</label>
                                <ActiveSwitch checked={isActive} onChange={setIsActive} />
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                                <button type='submit' className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] tracking-[1px]'>
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {submitLoading && <SubmitLoading />}
        </div>
    )
}


