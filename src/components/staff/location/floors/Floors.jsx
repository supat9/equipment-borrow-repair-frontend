'use client';
import React from 'react';
import mockBuildings from '@/mock/mockBuildings';
import Select from 'react-select'
import { useState, useEffect, useCallback } from 'react';
import { HiOutlinePlusSmall, HiOutlineMinusSmall } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { FaLayerGroup } from "react-icons/fa6";
import axios from 'axios';
import Swal from 'sweetalert2';
import { SubmitLoading, DataLoading } from '@/components/users/loading/LoadingOverlay';
import ActiveSwitch from '@/components/inputs/ActiveSwitch';

export function Floors() {
    const [addFloorModal, setAddFloorModal] = useState(false);
    const [editFloorModal, setEditFloorModal] = useState(null);
    const [floorList, setFloorList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const fetchFloorList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/floor');
            setFloorList(response.data);
        } catch (error) {
            console.error("Error fetching floor list:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchFloorList();
    }, [fetchFloorList]);
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
            title: "ไม่สามารถลบชั้นได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const handleDelete = async (floor) => {
        try {
            const confirmed = await Swal.fire({
                title: 'ยืนยันการลบ',
                text: `คุณต้องการลบ "${floor.description}" อาคาร ${floor.building_code} หรือไม่?`,
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
            const id = floor?.id;
            const response = await axios.delete(`/api/staff/floor/${encodeURIComponent(id)}`);
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || `ลบชั้น "${floor.description}" เรียบร้อยแล้ว`,
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1BC688',
                customClass: {
                    container: 'z-[10000]'
                }
            });
            fetchFloorList();
        } catch (error) {
            console.error("Delete floor error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="floors">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการชั้น</h2>
                <button onClick={() => setAddFloorModal(true)} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><HiOutlinePlusSmall size={23} /> <span>เพิ่มชั้น</span></button>
            </div>
            <div>
                {loading ? <DataLoading /> : <>{Object.entries(floorList).map(([buildingName, floors]) => {
                    return (
                        <div className='mb-6 px-4 pt-6 pb-4 border border-[#E0E0E0] rounded-[5px] shadow-[0px_0px_10px_#00000014]' key={buildingName}>
                            <div className='mb-6'>
                                <h2 className='flex items-center gap-x-2 text-[16px] bg-white border border-gray-300 cursor-default text-gray-500 rounded-[5px] px-3 py-2 shadow-sm w-fit'><span>อาคาร</span>{buildingName}</h2>
                            </div>
                            {floors.length > 0 ? <table className='w-full tracking-[.5px] text-left border-collapse'>
                                <thead className='bg-slate-50 border border-gray-300'>
                                    <tr className='text-sm text-gray-700'>
                                        <th className='font-light text-[#606060] px-4 py-3 rounded-l-[3px]'>หมายเลขชั้น</th>
                                        <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                            รายละเอียด
                                        </span></th>
                                        <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                            สถานะ
                                        </span></th>
                                        <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการชั้น</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {floors.map((floor) => (
                                        <tr key={floor.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                            <td className='p-4'>{floor.floor_number || '-'}</td>
                                            <td className='p-4'>{floor.description || '-'}</td>
                                            <td className='p-4'>
                                                {statusColor[floor.is_active] && (
                                                    <div className={`inline-flex items-center w-[100px] gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${statusColor[floor.is_active].bg} ${statusColor[floor.is_active].text}`}>
                                                        <div className={`size-2 rounded-full ${statusColor[floor.is_active].dot}`}></div>
                                                        <span className="text-xs font-medium tracking-wide">
                                                            {statusColor[floor.is_active].label}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className='p-4'>
                                                <div className='flex items-center gap-x-4'>
                                                    <button onClick={() => setEditFloorModal(floor)} className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                                        <CiEdit className="text-gray-600" size={20} />
                                                    </button>
                                                    <button onClick={() => handleDelete(floor)} className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                                        <PiTrashLight className="text-gray-600" size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> : <div className='py-8 text-center tracking-[.5px]'>
                                <div className='mb-3'>
                                    <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                                </div>
                                <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีข้อมูลชั้น</p>
                                <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มชั้นแรกของอาคารนี้</p>
                            </div>}
                        </div>
                    )
                })}</>}

            </div>
            {addFloorModal && <AddFloorsModal onClose={() => setAddFloorModal(false)} refresh={fetchFloorList} />}
            {editFloorModal && <EditFloorsModal onClose={() => setEditFloorModal(null)} refresh={fetchFloorList} floor={editFloorModal} />}
            {submitLoading && <SubmitLoading />}
        </div>
    )
}

export function AddFloorsModal({ onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [buildingOptions, setBuildingOptions] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [countFloors, setCountFloors] = useState(1);
    const [floorsData, setFloorsData] = useState([
        { floor_number: '', description: '' }
    ]);
    const fetchBuildingOptions = async () => {
        try {
            const response = await axios.get('/api/staff/building');
            const result = response.data;
            const options = result.map(building => ({
                value: building.id,
                label: building.building_code
            }));
            setBuildingOptions(options);
        } catch (error) {
            console.error("Error fetching building options:", error);
        }
    };
    const updateFloorData = (index, field, value) => {
        const newFloorsData = [...floorsData];
        newFloorsData[index] = {
            ...newFloorsData[index],
            [field]: value
        };
        setFloorsData(newFloorsData);
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
            title: "ไม่สามารถเพิ่มชั้นได้",
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
            // ตรวจสอบว่าเลือกอาคารแล้วหรือไม่
            if (!selectedBuilding) return await Swal.fire({
                title: 'ไม่สามารถเพิ่มชั้นได้',
                text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                icon: 'warning',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#FFC107',
                customClass: {
                    container: 'z-[10000]',
                }
            });
            // ตรวจสอบข้อมูลทุกชั้นในครั้งเดียว
            const isValid = floorsData.every(floor =>
                floor.floor_number.trim() && floor.description.trim()
            );
            if (isValid || selectedBuilding) {
                const confirmed = await Swal.fire({
                    title: 'ยืนยันการเพิ่ม?',
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
            const requestData = floorsData.map(floor => ({
                building_id: selectedBuilding ? selectedBuilding.value : null,
                floor_number: floor.floor_number,
                description: floor.description
            }));
            setSubmitLoading(true);
            const response = await axios.post('/api/staff/floor', { floors: requestData });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || 'เพิ่มชั้นเรียบร้อยแล้ว',
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
            console.error("create floor error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    useEffect(() => {
        fetchBuildingOptions();
    }, []);
    useEffect(() => {
        const newFloorsData = Array.from({ length: countFloors }, (_, index) =>
            floorsData[index] || { floor_number: (index + 1).toString(), description: '' }
        );
        setFloorsData(newFloorsData);
    }, [countFloors]);
    return (
        <div id="add-building-model">
            <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[600px] max-w-[750px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-gray-600'>เพิ่มชั้น</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <form onSubmit={handleSubmit} action="">
                            <div className='flex justify-between items-center my-6'>
                                <div className='flex items-center gap-x-4'>
                                    <p className='text-[16px] text-gray-600'>เลือกอาคาร</p>
                                    <Select options={buildingOptions}
                                        autoFocus
                                        onChange={(selectedOption) => setSelectedBuilding(selectedOption)}
                                        placeholder="อาคาร"
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                width: '240px',
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
                                        }} />
                                </div>
                                <div className='flex items-center gap-x-3'>
                                    {/* <button onClick={() => setCountFloors(countFloors - 1)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#e5e7e9] text-[#454545] duration-200 hover:bg-[#cacfd2]'>
                                        <HiOutlineMinusSmall size={18} />
                                        <span>ลดจำนวนชั้น</span>
                                    </button>
                                    <button onClick={() => setCountFloors(countFloors + 1)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>
                                        <HiOutlinePlusSmall size={18} />
                                        <span>เพิ่มจำนวนชั้น</span>
                                    </button> */}
                                    <p className='text-gray-600'>ลด / เพิ่ม จำนวนชั้น</p>
                                    <button type='button' onClick={() => { if (countFloors > 1) setCountFloors(countFloors - 1) }} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-gray-50 border border-gray-300 text-[#454545] duration-200 hover:bg-gray-200'>
                                        <HiOutlineMinusSmall size={18} />
                                    </button>
                                    <button type='button' onClick={() => { if (countFloors < 5) setCountFloors(countFloors + 1) }} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>
                                        <HiOutlinePlusSmall size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className='max-h-64 overflow-y-auto mb-4 pr-4'>
                                <div className='mb-4'>
                                    {Array.from({ length: countFloors }, (_, index) => (
                                        <div key={index} className='grid grid-cols-2 items-center px-1 gap-x-4 mb-4'>
                                            <div className='flex flex-col gap-y-2'>
                                                <label className='text-gray-600' htmlFor={`floorNumber-${index}`}>หมายเลขชั้น</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
                                                    value={floorsData[index]?.floor_number || ''}
                                                    onChange={(e) => updateFloorData(index, 'floor_number', e.target.value)}
                                                    placeholder={index + 1}
                                                    type="text"
                                                    id={`floorNumber-${index}`}
                                                    name={`floorNumber-${index}`}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2'>
                                                <label className='text-gray-600' htmlFor={`desc-${index}`}>รายละเอียด</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
                                                    value={floorsData[index]?.description || ''}
                                                    onChange={(e) => updateFloorData(index, 'description', e.target.value)}
                                                    placeholder='ชั้นเก็บของ'
                                                    id={`desc-${index}`}
                                                    name={`desc-${index}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
            </div >
            {submitLoading && <SubmitLoading />}
        </div >
    )
}

export function EditFloorsModal({ onClose, refresh, floor }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [description, setDescription] = useState(floor.description || '');
    const [floorNumber, setFloorNumber] = useState(floor.floor_number || '');
    const [buildingOptions, setBuildingOptions] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(floor.building_id || '');
    const [is_active, setIsActive] = useState(floor?.is_active);
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchBuildingOptions = async () => {
        try {
            const response = await axios.get('/api/staff/building');
            const result = response.data;
            setBuildingOptions(result.map(building => ({
                value: building.id,
                label: building.building_code
            })));
        } catch (error) {
            console.error("Error fetching building options:", error);
        }
    }
    useEffect(() => {
        fetchBuildingOptions();
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
            text = message || "ไม่พบข้อมูลที่ต้องการในระบบ";
        } else if (status === 500) {
            icon = "error";
            color = "#d33"; // red
            text = message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
        }

        await Swal.fire({
            title: "ไม่สามารถแก้ไขข้อมูลชั้นได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (floorNumber && selectedBuilding && is_active !== null) {
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
                if (!confirmed.isConfirmed) return;
            }
            setSubmitLoading(true);
            const id = floor.id;
            const response = await axios.put(`/api/staff/floor/${encodeURIComponent(id)}`, {
                description,
                floor_number: floorNumber,
                building_id: selectedBuilding,
                is_active
            });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || 'แก้ไขข้อมูลชั้นเรียบร้อยแล้ว',
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
            console.error("edit floor error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="edit-floor-model">
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[500px] max-w-[600px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>แก้ไขข้อมูล {floor.building_code} ชั้น {floor.floor_number}</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <form onSubmit={handleSubmit}>
                            <div className='grid grid-cols-2 gap-x-4'>
                                <div className='flex flex-col gap-y-3 mb-6'>
                                    <label htmlFor="building">เลือกอาคาร</label>
                                    <div>
                                        <Select
                                            className='w-full'
                                            placeholder='เลือกอาคาร'
                                            options={buildingOptions}
                                            onChange={(option) => setSelectedBuilding(option?.value || '')}
                                            value={buildingOptions.find(opt => opt.value === selectedBuilding) || null}
                                            isDisabled={true}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-y-2 mb-4'>
                                    <label htmlFor="floorNumber">หมายเลขชั้น</label>
                                    <input value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)} className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='1' id="floorNumber" name="floorNumber" />
                                </div>
                            </div>
                            <div className='flex flex-col gap-y-2 mb-6'>
                                <label htmlFor="desc">รายละเอียด</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='ตึกสาขาเทคโนโลยีสารสนเทศ' id="desc" name="desc" ></textarea>
                            </div>
                            <div className='flex items-center justify-end gap-x-4 mb-6'>
                                <label className='text-gray-600' htmlFor="">สถานะการใช้งาน</label>
                                <ActiveSwitch checked={is_active} onChange={setIsActive} />
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



