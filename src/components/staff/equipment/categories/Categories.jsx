'use client';
import React from 'react';
import { mockCategories } from '@/mock/mockEquipment';
import { useState, useEffect, useCallback } from 'react';
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import Swal from 'sweetalert2';
import { DataLoading, SubmitLoading } from '@/components/users/loading/LoadingOverlay';
import ActiveSwitch from '@/components/inputs/ActiveSwitch';
import { FaLayerGroup } from 'react-icons/fa';
import Pagination from '@/components/staff/pagination/Pagination';

export function Categories() {
    const [addCategoryModal, setAddCategoryModal] = useState(false);
    const [editCategoryModal, setEditCategoryModal] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/equipment-category');
            setCategoriesList(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);
    const showAlertByStatus = async (status, message) => {
        let icon = "error";
        let color = "#d33";
        let text = message || "เกิดข้อผิดพลาด";

        if (status === 404) {
            icon = "info";
            color = "#2196F3"; // blue
            text = message || "ไม่พบข้อมูลที่ต้องการ";
        } else if (status === 500) {
            icon = "error";
            color = "#d33"; // red
            text = message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
        }
        await Swal.fire({
            title: "ไม่สามารถลบหมวดหมู่ได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
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
    const [submitLoading, setSubmitLoading] = useState(false);
    const handleDelete = async (category) => {
        try {
            const confirmed = await Swal.fire({
                title: 'ยืนยันการลบหมวดหมู่',
                text: `คุณต้องการลบหมวดหมู่ ${category.categoryName} หรือไม่?`,
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
            const response = await axios.delete(`/api/staff/equipment-category/${encodeURIComponent(category.id)}`);
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || 'ลบหมวดหมู่สำเร็จ',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1BC688',
                customClass: {
                    container: 'z-[10000]'
                }
            });
            await fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="categories">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการหมวดหมู่</h2>
                <button onClick={() => setAddCategoryModal(true)} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><HiOutlinePlusSmall size={23} /> <span>เพิ่มหมวดหมู่</span></button>
            </div>
            <div>
                {loading ? <DataLoading /> : categoriesList.length === 0 ? <div className='h-[180px] flex flex-col justify-center items-center tracking-[.5px]'>
                    <div className='mb-3'>
                        <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                    </div>
                    <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีหมวดหมู่ครุภัณฑ์ในระบบขณะนี้</p>
                    <p className='text-[14px] text-[#9CA3AF]'>กรุณาเพิ่มหมวดหมู่ใหม่</p>
                </div> : <table className='w-full tracking-[.5px] text-left border-collapse'>
                    <thead className='bg-slate-50 border border-gray-300'>
                        <tr className='text-sm text-gray-700'>
                            <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                รหัสหมวดหมู่ 
                            </span></th>
                            <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                ชื่อหมวดหมู่ 
                            </span></th>
                            <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                รายละเอียด
                            </span></th>
                            <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                สถานะ 
                            </span></th>
                            <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการหมวดหมู่</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoriesList.map((category) => (
                            <tr key={category.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                <td className='p-4'>{category.categoryCode}</td>
                                <td className='p-4'>{category.categoryName}</td>
                                <td className={`p-4`}>{category.description || '-'}</td>
                                <td className='p-4'>
                                    {statusColor[category.is_active] && (
                                        <div className={`inline-flex w-[100px] items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${statusColor[category.is_active].bg} ${statusColor[category.is_active].text}`}>
                                            <div className={`size-2 rounded-full ${statusColor[category.is_active].dot}`}></div>
                                            <span className="text-xs font-medium tracking-wide">
                                                {statusColor[category.is_active].label}
                                            </span>
                                        </div>
                                    )}</td>
                                <td className='p-4'>
                                    <div className='flex items-center gap-x-4'>
                                        <button onClick={() => setEditCategoryModal(category)} className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                            <CiEdit size={20} />
                                        </button>
                                        <button onClick={() => handleDelete(category)} className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                            <PiTrashLight size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
            </div>
            {addCategoryModal && (
                <AddCategoryModal refresh={fetchCategories} onClose={() => setAddCategoryModal(false)} />
            )}
            {editCategoryModal && (
                <EditCategoryModal category={editCategoryModal} refresh={fetchCategories} onClose={() => setEditCategoryModal(false)} />
            )}
            {submitLoading && <SubmitLoading />}
        </div>
    )
}

export function AddCategoryModal({ onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [categoryName, setCategoryName] = useState('');
    // const [categoryCode, setCategoryCode] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(1);
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
            text = message || "ไม่พบข้อมูลที่ต้องการในระบบ";
        } else if (status === 409) {
            icon = "error";
            color = "#d33"; // deep orange
            text = message || "เกิดข้อขัดแย้งกับข้อมูลที่มีอยู่ในระบบ";
        } else if (status === 500) {
            icon = "error";
            color = "#d33"; // red
            text = message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
        }

        await Swal.fire({
            title: "ไม่สามารถเพิ่มหมวดหมู่ได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const [submitLoading, setSubmitLoading] = useState(false);
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (categoryName && isActive !== null) {
                const confirmed = await Swal.fire({
                    title: 'ยืนยันการเพิ่มหมวดหมู่',
                    text: `การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
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
            const response = await axios.post('/api/staff/equipment-category',
                { categoryName, description, isActive });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || 'เพิ่มหมวดหมู่สำเร็จ',
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
            console.error('Error adding category:', error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="add-categoryEquipment-modal">
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[500px] max-w-[600px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>เพิ่มหมวดหมู่ครุภัณฑ์</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <form onSubmit={handleSubmit} action="">
                            <div className='grid grid-cols-1 gap-4 mb-4'>
                                {/* <div className='flex flex-col gap-y-2'>
                                    <label className='text-gray-600' htmlFor="categoryCode">รหัสหมวดหมู่</label>
                                    <input
                                        className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
                                        placeholder='อุปกรณ์ IT'
                                        type="text"
                                        id="categoryCode"
                                        name="categoryCode"
                                        onChange={(e) => setCategoryCode(e.target.value)}
                                        value={categoryCode}
                                    />
                                </div> */}
                                <div className='flex flex-col gap-y-2'>
                                    <label className='text-gray-600' htmlFor="categoryName">ชื่อหมวดหมู่</label>
                                    <input
                                        className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
                                        placeholder='อุปกรณ์ IT'
                                        type="text"
                                        id="categoryName"
                                        name="categoryName"
                                        autoFocus
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        value={categoryName}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-y-2 mb-6'>
                                <label className='text-gray-600' htmlFor="categoryDesc">รายละเอียด</label>
                                <textarea
                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
                                    placeholder='คอมพิวเตอร์และอุปกรณ์ต่อพ่วง'
                                    id="categoryDesc"
                                    name="categoryDesc"
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                ></textarea>
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

export function EditCategoryModal({ category, onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [categoryName, setCategoryName] = useState(category.categoryName);
    const [categoryCode, setCategoryCode] = useState(category.categoryCode);
    const [description, setDescription] = useState(category.description);
    const [isActive, setIsActive] = useState(category.is_active);
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
            text = message || "ไม่พบข้อมูลที่ต้องการในระบบ";
        } else if (status === 409) {
            icon = "error";
            color = "#d33"; // deep orange
            text = message || "เกิดข้อขัดแย้งกับข้อมูลที่มีอยู่ในระบบ";
        } else if (status === 500) {
            icon = "error";
            color = "#d33"; // red
            text = message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
        }

        await Swal.fire({
            title: "ไม่สามารถแก้ไขหมวดหมู่ได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const [submitLoading, setSubmitLoading] = useState(false);
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (categoryCode && categoryName && isActive !== null) {
                const confirmed = await Swal.fire({
                    title: 'ยืนยันการแก้ไขหมวดหมู่',
                    text: `การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
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
            const response = await axios.put(`/api/staff/equipment-category/${encodeURIComponent(category.id)}`,
                { categoryCode, categoryName, description, isActive });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || 'เพิ่มหมวดหมู่สำเร็จ',
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
            console.error('Error adding category:', error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="edit-categoryEquipment-modal">
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[500px] max-w-[600px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>เพิ่มหมวดหมู่ครุภัณฑ์</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <form onSubmit={handleSubmit} action="">
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                <div className='flex flex-col gap-y-2'>
                                    <label className='text-gray-600' htmlFor="categoryCode">รหัสหมวดหมู่</label>
                                    <input
                                        className='text-[#4E5155] border border-gray-300 bg-gray-100 rounded-[5px] px-3 py-2 duration-300 '
                                        placeholder='อุปกรณ์ IT'
                                        type="text"
                                        id="categoryCode"
                                        name="categoryCode"
                                        onChange={(e) => setCategoryCode(e.target.value)}
                                        value={categoryCode}
                                        readOnly
                                    />
                                </div>
                                <div className='flex flex-col gap-y-2'>
                                    <label className='text-gray-600' htmlFor="categoryName">ชื่อหมวดหมู่</label>
                                    <input
                                        className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
                                        placeholder='อุปกรณ์ IT'
                                        type="text"
                                        id="categoryName"
                                        name="categoryName"
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        value={categoryName}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-y-2 mb-6'>
                                <label className='text-gray-600' htmlFor="categoryDesc">รายละเอียด</label>
                                <textarea
                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
                                    placeholder='คอมพิวเตอร์และอุปกรณ์ต่อพ่วง'
                                    id="categoryDesc"
                                    name="categoryDesc"
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                ></textarea>
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
