'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { mockEquipment } from '@/mock/mockEquipment';
import { AiOutlineScan } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
// import { BsCalendar3 } from "react-icons/bs";
import axios from 'axios';
import { BiSolidCategory } from "react-icons/bi";
import { BsCheckCircle } from "react-icons/bs";
import { BsBoxSeam } from "react-icons/bs";
import { BsBox2 } from "react-icons/bs";
import Swal from 'sweetalert2';
import Select from 'react-select';
import { AiFillInfoCircle } from "react-icons/ai";
import { IoLocationOutline, IoSearchOutline } from "react-icons/io5";
import DateTimePicker from '@/components/inputs/DateTimePicker';
import { FaLayerGroup } from 'react-icons/fa';
import Spinner from '@/components/users/loading/Spinner.jsx';
import { PiHashStraightLight, PiScanLight } from 'react-icons/pi';
import { IoRefresh } from 'react-icons/io5';
import { DateTime } from 'luxon';

export function Equipment() {
    const [searchName, setSearchName] = useState('');
    const [searchCode, setSearchCode] = useState('');

    const [selectedEquipmentModal, setSelectedEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const statusMap = {
        'ถูกยืม': {
            bg: 'bg-[#FFE9D6]',
            border: 'border-[#FFB672]',
            dot: 'bg-[#FF9800]',
            text: 'text-[#E67E22]',
            label: 'ถูกยืม'
        },
        'ว่าง': {
            bg: 'bg-[#DCFCE7]',
            border: 'border-[#A5DBA5]',
            dot: 'bg-[#2ecc71]',
            text: 'text-[#166534]',
            label: 'ว่าง'
        },
        'ซ่อมบำรุง': {
            bg: 'bg-[#FEF9C3]', // เหลืองเข้มขึ้น
            border: 'border-[#FACC15]',
            dot: 'bg-[#EAB308]',
            text: 'text-[#B58105]',
            label: 'ซ่อมบำรุง'
        }
    };
    const [equipment_name, setEquipmentName] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/users/equipment/category');
            const options = response.data.map(category => ({
                value: category.category_name,
                label: category.category_name
            }));
            setCategories(options);
        } catch (error) {
            console.error("fetch category error:", error);
        }
    }
    const [overview, setOverview] = useState([]);
    const fetchOverview = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/equipment/overview',
                { params: { equipment_name: equipment_name.trim(), category_name: selectedCategory ? selectedCategory.value : '' } }
            );
            setOverview(response.data);
        } catch (error) {
            console.error("Error fetching overview:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setEquipmentName(searchName);
        }, 500); // 500ms หลังหยุดพิมพ์
        return () => clearTimeout(handler);
    }, [searchName]);

    useEffect(() => {
        fetchOverview();
    }, [equipment_name, selectedCategory]);
    // const handleSearch = async (e) => {
    //     setLoading(true);
    //     try {
    //         e.preventDefault();
    //         const response = await axios.get('/api/users/equipment/overview',
    //             { params: { equipment_name, category_name: selectedCategory ? selectedCategory.value : '' } }
    //         );
    //         setOverview(response.data);
    //     } catch (error) {
    //         console.error("Search equipment errors:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }
    const handleClear = async () => {
        try {
            setSearchName('');
            setSelectedCategory(null);
        } catch (error) {
            console.error("Clear search errors:", error);
        }
    }
    return (
        <div id="user-equipment-component">
            <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8'>
                <div className='flex justify-between items-center mb-8'>
                    <h2 className='text-[18px] font-bold text-[#4E5155]'>ค้นหาครุภัณฑ์ที่คุณต้องการ</h2>
                    <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                </div>
                <div className='border-b border-[#E0E0E0] pb-4 mb-6'>
                    <form className='flex justify-between items-end gap-4' >
                        <div className='flex flex-col md:flex-row md:items-center gap-4'>
                            <div className='flex flex-col gap-y-2'>
                                {/* <label htmlFor="">ค้นหาด้วยชื่อหรือรหัส</label> */}
                                <div className='flex items-center w-[250px] h-[40px] gap-x-4 border border-[#D1D5DB] duration-300 rounded-[5px] px-3 py-2.5 group focus-within:border-[#1BC688] focus-within:ring-1 focus-within:ring-[#1BC688]'>
                                    <IoSearchOutline className={`group-focus-within:text-[#1BC688] text-[#868686]`} size={20} />
                                    <input onChange={(e) => setSearchName(e.target.value)} value={searchName} className='text-sm md:text-base w-full focus:outline-none  text-[#4E5155]' type="text" placeholder='ค้นหาด้วยชื่อครุภัณฑ์' />
                                </div>
                            </div>
                            <div className='flex flex-col gap-y-2'>
                                {/* <label htmlFor="">เลือกหมวดหมู่</label> */}
                                <Select
                                    className='text-sm md:text-base'
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            width: '250px',
                                            minHeight: '40px',
                                            height: '40px',
                                            borderRadius: '5px',
                                            borderColor: state.isFocused ? '#1BC688' : '#D1D5DB',
                                            boxShadow: state.isFocused ? '0 0 0 1.5px #1BC688' : 'none',
                                            color: '#4E5155',
                                            transition: 'border-color 0.2s',
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: '#868686',
                                        }),
                                    }} options={categories} value={selectedCategory} onChange={setSelectedCategory} placeholder="เลือกหมวดหมู่" />
                            </div>
                        </div>
                        <div className='flex items-center gap-x-4'>
                            <button
                                onClick={handleClear}
                                type='button'
                                className='text-sm md:text-base flex items-center justify-center gap-x-2 h-[40px] text-[14px] px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-[5px] font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer'
                            >
                                <span><IoRefresh size={20} className='text-gray-500' /></span>
                            </button>
                            {/* <button type='submit' className='flex items-center gap-x-2 cursor-pointer rounded-[5px] h-[40px] text-[15px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><IoSearchOutline size={20} color='white' /><span>ค้นหา</span></button> */}
                        </div>
                    </form>
                </div>
                <div>
                    <div id="user-overview">
                        <div className='mb-6 flex justify-between items-center'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการครุภัณฑ์</h2>
                            <p className='text-sm  text-gray-400'>{overview?.length > 0 ? `ทั้งหมด ${overview?.length} รายการ` : 'ไม่มีรายการ'}</p>
                        </div>
                        <div>
                            {loading ? <div className='h-[180px] flex justify-center items-center'>
                                <div className="relative w-20 h-20 flex items-center justify-center">
                                    <Spinner />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                                </div>
                            </div> : overview?.length === 0 ? (<div className='h-[180px] flex justify-center items-center text-center tracking-[.5px]'>
                                <div className='space-y-4'>
                                    <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                                    <p className='text-[16px] text-gray-400'>ยังไม่มีรายการครุภัณฑ์</p>
                                </div>
                            </div>) : <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                                {overview?.map(equipment => (
                                    <div key={equipment.equipment_name} className='group bg-white rounded-[5px] border border-[#E0E0E0] overflow-hidden transition-all duration-500 ease-out shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:border-[#1BC688]/30 hover:-translate-y-2'>
                                        <div className='relative w-full h-[200px] overflow-hidden'>

                                            {equipment?.image_path?.includes('https://res.cloudinary.com') ? (
                                                <Image
                                                    className='object-cover transition-all duration-700 ease-out group-hover:scale-110 border-b border-[#E0E0E0]'
                                                    fill
                                                    src={equipment?.image_path}
                                                    alt={equipment.equipment_name}
                                                />
                                            ) : (
                                                <div className='flex justify-center items-center h-full border-b border-[#E0E0E0] text-center tracking-[.5px]'>
                                                    <div>
                                                        <div className='mb-4'>
                                                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                                                        </div>
                                                        <p className='text-gray-400 text-[14px]'>ไม่มีรูปภาพ</p>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Gradient overlay on hover */}
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

                                            {/* Availability badge */}
                                            <div className='absolute top-3 right-3 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100'>
                                                <div className='bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full'>
                                                    <span className='text-xs font-medium text-green-600'>{equipment.available_quantity} ว่าง</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='p-5'>
                                            <div className='mb-4'>
                                                <h3 className='line-clamp-1 text-sm md:text-base font-semibold tracking-[.5px] text-gray-600 mb-2 leading-tight group-hover:text-[#1BC688] transition-colors duration-300'>
                                                    {equipment.equipment_name}
                                                </h3>
                                            </div>

                                            <div className='space-y-3 mb-5'>
                                                <div className='flex items-center gap-x-3 text-gray-500'>
                                                    <BiSolidCategory size={19} className=' group-hover:text-[#1BC688] transition-colors duration-300' />
                                                    <span className='text-xs sm:text-sm'>{equipment.category_name}</span>
                                                </div>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-x-3 text-gray-500'>
                                                        <BsCheckCircle size={19} className={`${equipment.available_quantity > 0 ? 'text-green-500' : 'text-red-400'} group-hover:scale-120 transition-transform duration-300`} />
                                                        <span className={`text-xs sm:text-sm ${equipment.available_quantity > 0 ? 'text-green-500' : 'text-red-400'}`}>ครุภัณฑ์ที่ว่าง</span>
                                                    </div>
                                                    <span className={`font-semibold ${equipment.available_quantity > 0 ? 'text-green-600' : 'text-red-400'} ${equipment.available_quantity > 0 ? 'group-hover:text-green-700' : 'group-hover:text-red-500'} text-base  transition-colors duration-300`}>{equipment.available_quantity}</span>
                                                </div>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-x-3 text-gray-500'>
                                                        <BsBoxSeam size={19} className='text-gray-400 group-hover:text-gray-500 transition-colors duration-300' />
                                                        <span className='text-xs sm:text-sm'>ครุภัณฑ์ทั้งหมด</span>
                                                    </div>
                                                    <span className='font-semibold text-base text-gray-700'>{equipment.total_quantity}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setSelectedEquipment(equipment)}
                                                className='cursor-pointer w-full bg-gray-50 text-gray-700 font-medium text-sm py-3 px-4 rounded-[5px] border border-gray-200 transition-all duration-300 group-hover:bg-[#1BC688] group-hover:text-white group-hover:border-[#1BC688] group-hover:shadow-[0_4px_12px_rgba(27,198,136,0.3)] focus:outline-none focus:ring-2 focus:ring-[#1BC688]/30 active:scale-95'
                                            >
                                                <span className=' transition-all duration-300'>เลือกดูครุภัณฑ์</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>}
                        </div>
                        {/* {selectedEquipmentModal && (
                <EquipmentBorrowModal equipment={selectedEquipmentModal} onClose={() => setSelectedEquipment(null)} />
            )} */}
                        {selectedEquipmentModal && (
                            <EquipmentGroupModal equipment={selectedEquipmentModal} onClose={() => setSelectedEquipment(null)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function EquipmentGroupModal({ equipment, onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [equipmentList, setEquipmentList] = useState([]);
    const [selectedEquipmentModal, setSelectedEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchGroupDetail = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/equipment/group-detail', { params: { equipment_name: equipment.equipment_name } });
            setEquipmentList(response.data);
        } catch (error) {
            console.error("Error fetching group detail:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchGroupDetail();
    }, []);
    const statusColor = {
        'available': {
            bg: 'bg-[#D1FAE5]',
            border: '#34D399',
            dot: 'bg-[#10B981]',
            text: 'text-[#059669]',
            label: 'ว่าง'
        },
        'borrowed': {
            bg: 'bg-[#FEE2E2]',
            border: '#F87171',
            dot: 'bg-[#EF4444]',
            text: 'text-[#DC2626]',
            label: 'ไม่ว่าง'
        },
        'repair': {
            bg: 'bg-[#FDF6B2]',
            border: '#F59E42',
            dot: 'bg-[#F59E42]',
            text: 'text-[#B58105]',
            label: 'ซ่อมบำรุง'
        },
        'retired': {
            bg: 'bg-[#E5E7EB]',
            border: '#9CA3AF',
            dot: 'bg-[#6B7280]',
            text: 'text-[#6B7280]',
            label: 'ปลดระวาง'
        },
        'active': {
            bg: 'bg-[#E0F2FE]',
            border: '#38BDF8',
            dot: 'bg-[#0EA5E9]',
            text: 'text-[#0284C7]',
            label: 'พร้อมใช้งาน'
        },
        'cancelled': {
            bg: 'bg-[#F3F4F6]',
            border: '#D1D5DB',
            dot: 'bg-[#9CA3AF]',
            text: 'text-[#6B7280]',
            label: 'ยกเลิก'
        },
        'selled': {
            bg: 'bg-[#FFF7ED]',
            border: '#FDBA74',
            dot: 'bg-[#FB923C]',
            text: 'text-[#F97316]',
            label: 'ขายแล้ว'
        },
        'pending_approval': {
            bg: 'bg-[#E0F2FE]',
            border: 'border-[#38BDF8]',
            dot: 'bg-[#0EA5E9]',
            text: 'text-[#0284C7]',
            label: 'รออนุมัติ'
        }
    };
    return (
        <div id="user-equipment-group-modal">
            <div className="px-4 lg:px-0 fixed inset-0 z-20 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[300px] max-w-[750px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-6'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการครุภัณฑ์</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    {loading ? <div className='py-20 flex justify-center items-center'>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <Spinner />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                        </div>
                    </div> :
                        <div className='pl-6 pr-4'>
                            <div className='space-y-4 overflow-y-auto max-h-[375px] pr-4'>
                                {equipmentList?.map(equipment => (
                                    <div key={equipment.id}
                                        onClick={() => { equipment.usage_status === 'available' && setSelectedEquipment(equipment) }}
                                        style={{ borderLeftColor: statusColor[equipment.usage_status]?.border }}
                                        className={`${equipment.usage_status === 'available' ? 'cursor-pointer hover:bg-[#1bc68718] active:bg-[#1bc6872f] hover:border-[#1BC688]' : 'cursor-default hover:bg-gray-100'}  duration-300 text-[#4E5155] space-y-1 p-5 border-l-7 border-t border-r border-b border-gray-300   shadow-xs rounded-r-md group`}>
                                        <div className='flex justify-between items-start mb-2'>
                                            <div className='space-y-2'>
                                                <p className={`text-base md:text-lg  tracking-[.5px] text-gray-600 ${equipment.usage_status === 'available' ? 'duration-300 group-hover:text-[#1BC688]' : ''}`}>{ equipment?.brand && equipment?.model ? `${equipment.brand} ${equipment.model}` : '-' }</p>
                                                <p className='text-sm flex items-center gap-x-2 text-gray-600'><PiScanLight size={20} /> <span>{equipment.equipment_code}</span></p>
                                            </div>
                                            <div>
                                                {statusColor[equipment.usage_status] && (
                                                    <div className={`flex items-center gap-x-2 w-fit rounded-md px-4 py-1 ${statusColor[equipment.usage_status].bg}`}>
                                                        {/* เส้นขอบ Status border border-[${statusColor[equipment.status].border}] */}
                                                        <div className={`size-[7px] rounded-full ${statusColor[equipment.usage_status].dot}`}></div>
                                                        <span className={`cursor-default ${statusColor[equipment.usage_status].text} text-[13px]`}>
                                                            {statusColor[equipment.usage_status].label}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className='space-y-2'>
                                            <p className='text-sm sm:text-sm flex items-center gap-x-2 text-gray-600'><IoLocationOutline size={20} /><span>{equipment.room_info.building_name} ชั้น {equipment.room_info.floor_number} ห้อง {equipment.room_info.room_number}</span></p>
                                            {/* <p className='text-sm '>Serial : {equipment.serial_number}</p> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>}
                </div>
            </div>
            {selectedEquipmentModal &&
                <EquipmentBorrowModal equipment={selectedEquipmentModal} onClose={() => setSelectedEquipment(null)} />
            }
        </div>
    )
}

export function EquipmentBorrowModal({ equipment, onClose }) {
    const showWarningAlert = () => {
        return Swal.fire({
            title: 'ไม่สามารถส่งคำขอได้',
            text: 'กรุณากรอกข้อมูลให้ครบ',
            icon: 'warning',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#FFC107',
            customClass: {
                container: 'z-[10000]',
            }
        });
    }
    const showSubmitAlert = () => {
        return Swal.fire({
            title: 'ยืนยันคำขอยืม?',
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
            text: 'ส่งรายการคำขอครุภัณฑ์เรียบร้อยแล้ว',
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
            confirmButtonColor: '#d33',
            customClass: {
                container: 'z-[10000]'
            }
        });
    };
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [purpose, setPurpose] = useState('');
    // จำกัด 10:00–16:00
    const minTime = new Date();
    minTime.setHours(10, 0, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(16, 0, 0, 0);
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
            // if (!startDate || !endDate || !purpose || !equipment.id) return await showWarningAlert();
            const borrowDate = startDate ?
                DateTime.fromJSDate(startDate)
                    .setZone('Asia/Bangkok')
                    .toISO()  // จะได้ ISO string พร้อม timezone offset
                : null;
            const expectedReturnDate = endDate ? DateTime.fromJSDate(endDate).setZone('Asia/Bangkok').toISO() : null;
            if (startDate && endDate && purpose && equipment.id) {
                const result = await showSubmitAlert();
                if (!result.isConfirmed) return;
            }
            const response = await axios.post('/api/users/borrow/create', {
                borrowDate,
                expectedReturnDate,
                purpose: purpose.trim(),
                item: [{ equipmentId: equipment.id }]
            });
            const result = response.data;
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result.message || 'ส่งรายการคำขอครุภัณฑ์เรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1BC688',
                customClass: {
                    container: 'z-[10000]'
                }
            });
            onClose();
        } catch (error) {
            console.error("Error submitting borrow request:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="user-equipment-borrow-modal">
            <div className="px-4 lg:px-0 fixed inset-0 z-30 bg-[rgba(0,0,0,0.0)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[300px] max-w-[800px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-semibold text-gray-600'>แบบฟอร์มขอยืมครุภัณฑ์</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6 py-3'>
                        <div className='space-y-4 border border-[#1bc688] bg-[#1bc68718] shadow-md rounded-md p-4 mb-6'>
                            <h2 className=' '><span className='text-[#1BC688]  text-[18px] tracking-[.5px]'>{ equipment?.brand && equipment?.model ? `${equipment.brand} ${equipment.model}` : '-' }</span></h2>
                            <div className='flex items-center gap-x-4 '>
                                <div className='size-10 border border-[#1BC688] rounded-full flex items-center justify-center bg-white'>
                                    <PiScanLight size={20} className='text-green-600' />
                                </div>
                                <p className='flex flex-col sm:flex-row sm:items-center sm:gap-x-2 text-sm sm:text-base text-gray-700'><span className='text-gray-500 text-xs sm:text-sm'>รหัสครุภัณฑ์</span> {equipment?.equipment_code}</p>
                            </div>
                            <div className='flex items-center gap-x-4'>
                                <div className='size-10 border border-[#1BC688] rounded-full flex items-center justify-center bg-white'>
                                    <PiHashStraightLight size={20} className='text-green-600' />
                                </div>
                                <p className='flex flex-col sm:flex-row sm:items-center sm:gap-x-2 text-sm sm:text-base text-gray-700'><span className='text-gray-500 text-xs sm:text-sm'>Serial Number</span> {equipment?.serial_number}</p>
                            </div>
                            <div className='flex items-center gap-x-4'>
                                <div className='size-10 border border-[#1BC688] rounded-full flex items-center justify-center bg-white'>
                                    <IoLocationOutline size={20} className='text-green-600' />
                                </div>
                                <p className='flex flex-col sm:flex-row sm:items-center sm:gap-x-2 text-sm sm:text-base text-gray-700'><span className='text-gray-500 text-xs sm:text-sm'>สถานที่</span> {equipment?.room_info.building_name} ชั้น {equipment.room_info.floor_number} ห้อง {equipment.room_info.room_number}</p>
                            </div>

                        </div>
                        <div className='space-y-4 overflow-y-scroll overflow-x-hidden h-[250px] pr-6 sm:pr-0 sm:h-auto sm:overflow-x-hidden sm:overflow-y-hidden'>
                            <form onSubmit={handleSubmit} action="">
                                <div className='flex flex-col gap-y-3 mb-6'>
                                    <label htmlFor="" className='text-sm md:text-base text-gray-700'>วัตถุประสงค์การยืมครุภัณฑ์</label>
                                    <div className='flex items-center gap-x-2'>
                                        <textarea
                                            value={purpose}
                                            onChange={e => setPurpose(e.target.value)}
                                            autoFocus
                                            className=' text-[#4E5155] text-sm md:text-base w-full border border-gray-300 rounded-[5px] px-3 py-3 duration-300 focus-within:outline-[#1BC688]' type="text" placeholder='ใช้สำหรับกิจกรรม หรือการเรียน' />
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
                                    <div className='flex flex-col gap-y-3'>
                                        <label htmlFor='' className='text-sm md:text-base text-gray-700'>วันที่ต้องการยืม</label>
                                        <DateTimePicker
                                            value={startDate}
                                            onChange={date => setStartDate(date)}
                                            placeholderText='เลือกวันและเวลา'
                                            minDate={new Date()}
                                            maxDate={endDate || null}
                                            minTime={minTime}
                                            maxTime={maxTime}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-y-3'>
                                        <label htmlFor='' className='text-sm md:text-base text-gray-700'>วันที่คาดว่าจะคืน <span className='text-yellow-600 text-sm'>( ต้องระบุวันเริ่มต้นก่อน )</span></label>
                                        <DateTimePicker
                                            value={endDate}
                                            onChange={date => setEndDate(date)}
                                            placeholderText='เลือกวันและเวลา'
                                            minTime={
                                                endDate && startDate && endDate.toDateString() === startDate.toDateString()
                                                    ? startDate
                                                    : minTime // เวลาต่ำสุดปกติ เช่น 10:00
                                            }
                                            maxTime={maxTime}
                                            // กันวันก่อนหน้าไม่ได้
                                            minDate={startDate || null}
                                            // กันเวลาให้ไม่ต่ำกว่า startDate เมื่อเป็นวันเดียวกัน
                                            // minDateTime={startDate || null}
                                            disabled={!startDate}
                                            containerClassName={`flex items-center justify-between border border-[#D1D5DB] group rounded-[5px] py-2.5 px-4 duration-300 focus-within:border-[#1BC688] focus-within:ring-1 focus-within:ring-[#1BC688] ${!startDate ? 'bg-gray-100' : 'bg-white'}`}
                                        />
                                    </div>
                                </div>
                                <div className='flex justify-end gap-x-4'>
                                    <button type='button' onClick={onClose} className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ยกเลิก</button>
                                    <button type='submit' className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white font-medium duration-200 hover:bg-[#03ad6f] '>ส่งคำขอยืม</button>
                                </div>
                            </form>
                        </div>

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

