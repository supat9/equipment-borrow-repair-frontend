'use client';
import React, { act } from 'react';
import mockBuildings, { mockRoomTypes } from '@/mock/mockBuildings';
import Select from 'react-select'
import { useState, useEffect, useCallback } from 'react';
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { FaLayerGroup } from "react-icons/fa6";
import { MdMeetingRoom } from "react-icons/md";
import axios from 'axios';
import { SubmitLoading, DataLoading } from '@/components/users/loading/LoadingOverlay';
import ActiveSwitch from '@/components/inputs/ActiveSwitch';
import Swal from 'sweetalert2';

export function Rooms() {
    const [addRoomsModal, setAddRoomsModal] = useState(false);
    const [editRoomsModal, setEditRoomsModal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [roomList, setRoomList] = useState([]);
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
    const fetchRoomList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/room');
            setRoomList(response.data);
        } catch (error) {
            console.error("Fetch room list error:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchRoomList();
    }, [fetchRoomList]);
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
            title: "ไม่สามารถลบห้องได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const handleDelete = async (room) => {
        try {
            const confirmed = await Swal.fire({
                title: 'ยืนยันการลบ',
                text: `คุณต้องการลบ "${room.room_name}" หรือไม่?`,
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
            const id = room?.id;
            const response = await axios.delete(`/api/staff/room/${encodeURIComponent(id)}`);
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || `ลบห้อง "${room.room_name}" เรียบร้อยแล้ว`,
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1BC688',
                customClass: {
                    container: 'z-[10000]'
                }
            });
            fetchRoomList();
        } catch (error) {
            console.error("Delete room error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="rooms">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการห้อง</h2>
                <button onClick={() => setAddRoomsModal(true)} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><HiOutlinePlusSmall size={23} /> <span>เพิ่มห้อง</span></button>
            </div>
            <div>
                {loading ? <DataLoading /> : <>{Object.entries(roomList).map(([buildingName, floors]) => {
                    return (
                        <div key={buildingName} className='mb-6 px-4 pt-6 border border-[#E0E0E0] rounded-[5px] shadow-[0px_0px_10px_#00000014]'>
                            <div className='mb-6'>
                                <h2 className='flex items-center gap-x-2 text-[16px] bg-white border border-gray-300 cursor-default text-gray-500 rounded-[5px] px-3 py-2 shadow-sm w-fit'><span>อาคาร</span>{buildingName}</h2>
                            </div>
                            {Object.keys(floors).length ? (Object.entries(floors).map(([floorName, rooms]) => (
                                <div key={floorName} className='mb-6 px-4 pt-6 pb-4 border border-[#E0E0E0] rounded-[5px] shadow-[0px_0px_10px_#00000014]'>
                                    <div className='mb-6'>
                                        <h2 className='flex items-center gap-x-2 text-[16px] bg-white border border-gray-300 cursor-default text-gray-500 rounded-[5px] px-3 py-2 shadow-sm w-fit '>{floorName}</h2>
                                    </div>
                                    <table className='w-full tracking-[.5px] text-left border-collapse'>
                                        <thead className='bg-slate-50 border border-gray-300'>
                                            <tr className='text-sm text-gray-700'>
                                                <th className='font-light text-[#606060] px-4 py-3 rounded-l-[3px]'>เลขห้อง</th>
                                                <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                                    ชื่อห้อง
                                                </span></th>
                                                <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                                    ประเภทห้อง
                                                </span></th>
                                                <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                                    สถานะ
                                                </span></th>
                                                <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการชั้น</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rooms.map(room => (
                                                <tr key={room.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                                    <td className='p-4'>{room.room_number}</td>
                                                    <td className='p-4'>{room.room_name || '-'}</td>
                                                    <td className='p-4'>{room.room_type_name}</td>
                                                    <td className='p-4'>
                                                        {statusColor[room.is_active] && (
                                                            <div className={`inline-flex items-center w-[100px] gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${statusColor[room.is_active].bg} ${statusColor[room.is_active].text}`}>
                                                                <div className={`size-2 rounded-full ${statusColor[room.is_active].dot}`}></div>
                                                                <span className="text-xs font-medium tracking-wide">
                                                                    {statusColor[room.is_active].label}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className='p-4'>
                                                        <div className='flex items-center gap-x-4'>
                                                            <button onClick={() => setEditRoomsModal(room)} type='button' className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                                                <CiEdit className="text-gray-600" size={20} />
                                                            </button>
                                                            <button onClick={() => handleDelete(room)} type='button' className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                                                <PiTrashLight className="text-gray-600" size={20} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))) : (<div className='py-8 text-center tracking-[.5px]'>
                                <div className='mb-3'>
                                    <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                                </div>
                                <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีข้อมูลชั้น</p>
                                <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มชั้นแรกของอาคารนี้</p>
                            </div>)}
                        </div>
                    )
                })}</>}
            </div>
            {addRoomsModal && <AddRoomsModal onClose={() => setAddRoomsModal(false)} refresh={fetchRoomList} />}
            {editRoomsModal && <EditRoomsModal room={editRoomsModal} onClose={() => setEditRoomsModal(null)} refresh={fetchRoomList} />}
            {submitLoading && <SubmitLoading />}
        </div>
    )
}

export function AddRoomsModal({ onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [roomNumber, setRoomNumber] = useState('');
    const [roomName, setRoomName] = useState('');
    const [description, setDescription] = useState('');
    const [is_active, setIsActive] = useState(true);
    const [roomTypeOptions, setRoomTypeOptions] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const fetchRoomTypesOption = async () => {
        try {
            const response = await axios.get('/api/staff/room-type');
            const result = response.data;
            setRoomTypeOptions(result.map((roomType) => ({
                value: roomType.id,
                label: roomType.type_name
            })));
        } catch (error) {
            console.error("Fetch room types error:", error);
        }
    }
    const [buildingOptions, setBuildingOptions] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const fetchBuildingOptions = async () => {
        try {
            const response = await axios.get('/api/staff/building');
            const result = response.data;
            setBuildingOptions(result.map((building) => ({
                value: building.id,
                label: building.building_code
            })));
        } catch (error) {
            console.error("Fetch building options error:", error);
        }
    }
    const [floorOptions, setFloorOptions] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const fetchFloorListByBuildingId = async (buildingId) => {
        try {
            const response = await axios.get(`/api/staff/floor/building/${encodeURIComponent(buildingId)}`);
            setFloorOptions(response.data.map((floor) => ({
                value: floor.id,
                label: `ชั้น ${floor.floor_number} - ${floor.description}`
            })));
        } catch (error) {
            console.error("Fetch floor list by building error:", error);
        }
    }
    // useEffect สำหรับเมื่อ selectedBuilding เปลี่ยน
    useEffect(() => {
        if (selectedBuilding?.value) {
            setFloorOptions([]);
            setSelectedFloor(null);
            fetchFloorListByBuildingId(selectedBuilding.value);
        } else {
            setFloorOptions([]);
            setSelectedFloor(null);
        }
    }, [selectedBuilding]);
    useEffect(() => {
        fetchRoomTypesOption();
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
        } else if (status === 403) {
            icon = "error";
            color = "#d33"; // orange-red
            text = message || "คุณไม่มีสิทธิ์ดำเนินการนี้";
        } else if (status === 404) {
            icon = "info";
            color = "#2196F3"; // blue
            text = message || "ไม่พบข้อมูลที่ต้องการ";
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
            title: "ไม่สามารถเพิ่มห้องได้",
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
            if (selectedFloor && selectedRoomType && roomNumber && is_active !== null) {
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
            const response = await axios.post('/api/staff/room', {
                room_type_id: selectedRoomType ? selectedRoomType.value : null,
                room_number: roomNumber,
                floor_id: selectedFloor ? selectedFloor.value : null,
                room_name: roomName,
                description,
                is_active
            });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || 'เพิ่มห้องเรียบร้อยแล้ว',
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
            console.error("Edit room error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="add-room-model">
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[600px] max-w-[800px] bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>เพิ่มห้อง</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-8'>
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col gap-y-4 mb-6'>
                                <div className='flex items-center gap-x-8'>
                                    <p className='flex-shrink-0 w-[120px] text-[16px]'>เลือกอาคาร</p>
                                    <Select
                                        autoFocus
                                        className='flex-1 text-[15px]'
                                        options={buildingOptions}
                                        value={selectedBuilding}
                                        onChange={setSelectedBuilding}
                                        placeholder="เลือกอาคาร"
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
                                        }} />
                                </div>
                                <div className='flex items-center gap-x-8'>
                                    <p className='flex-shrink-0 w-[120px] text-[16px]'>เลือกชั้น</p>
                                    <Select
                                        className='flex-1 text-[15px]'
                                        options={floorOptions}
                                        value={selectedFloor}
                                        onChange={setSelectedFloor}
                                        isDisabled={!selectedBuilding}
                                        placeholder="เลือกชั้น"
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
                                        }} />
                                </div>
                                <div className='flex items-center gap-x-8'>
                                    <p className='flex-shrink-0 w-[120px] text-[16px]'>เลือกประเภทห้อง</p>
                                    <Select
                                        className='flex-1 text-[15px]'
                                        options={roomTypeOptions}
                                        value={selectedRoomType}
                                        onChange={setSelectedRoomType}
                                        placeholder="เลือกประเภทห้อง"
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
                                        }} />
                                </div>
                            </div>
                            <div>
                                <div className='grid grid-cols-2 gap-x-4 mb-4'>
                                    <div className='flex flex-col gap-y-2'>
                                        <label className='text-gray-600' htmlFor="roomNumber">เลขห้อง</label>
                                        <input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='101' type="text" id="roomNumber" name="roomNumber" />
                                    </div>
                                    <div className='flex flex-col gap-y-2'>
                                        <label className='text-gray-600' htmlFor="roomName">ชื่อห้อง (ถ้ามี)</label>
                                        <input value={roomName} onChange={(e) => setRoomName(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='ห้อง 101' type="text" id="roomName" name="roomName" />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-y-2 mb-6'>
                                    <label className='text-gray-600' htmlFor="desc">รายละเอียด</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='ห้องเก็บของ' id="desc" name="desc" ></textarea>
                                </div>
                                <div className='flex items-center justify-end gap-x-4 mb-6'>
                                    <label className='text-gray-600' htmlFor="">สถานะการใช้งาน</label>
                                    <ActiveSwitch checked={is_active} onChange={setIsActive} />
                                </div>
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                                <button className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] '>
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

export function EditRoomsModal({ room, onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [roomTypeOptions, setRoomTypeOptions] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState(room.room_type_id);
    const fetchRoomTypesOption = async () => {
        try {
            const response = await axios.get('/api/staff/room-type');
            const result = response.data;
            setRoomTypeOptions(result.map((roomType) => ({
                value: roomType.id,
                label: roomType.type_name
            })));
        } catch (error) {
            console.error("Fetch room types error:", error);
        }
    }

    const [buildingOptions, setBuildingOptions] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const fetchBuildingOptions = async () => {
        try {
            const response = await axios.get('/api/staff/building');
            const result = response.data;
            setBuildingOptions(result.map((building) => ({
                value: building.id,
                label: building.building_code
            })));
        } catch (error) {
            console.error("Fetch building options error:", error);
        }
    }

    const [floorOptions, setFloorOptions] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const fetchFloorListByBuildingId = async (buildingId) => {
        try {
            const response = await axios.get(`/api/staff/floor/building/${encodeURIComponent(buildingId)}`);
            setFloorOptions(response.data.map((floor) => ({
                value: floor.id,
                label: `ชั้น ${floor.floor_number} - ${floor.description}`
            })));
        } catch (error) {
            console.error("Fetch floor list by building error:", error);
        }
    }
    // useEffect สำหรับเมื่อ selectedBuilding เปลี่ยน
    useEffect(() => {
        if (selectedBuilding?.value) {
            setFloorOptions([]);
            setSelectedFloor(null);
            fetchFloorListByBuildingId(selectedBuilding.value);
        } else {
            setFloorOptions([]);
            setSelectedFloor(null);
        }
    }, [selectedBuilding]);

    // useEffect สำหรับโหลดข้อมูลเริ่มต้น
    useEffect(() => {
        fetchBuildingOptions();
        fetchRoomTypesOption();
    }, []);

    // useEffect สำหรับตั้งค่า building เริ่มต้นจาก room data
    useEffect(() => {
        if (room.building_id && buildingOptions.length > 0) {
            const building = buildingOptions.find(option => option.value === room.building_id);
            if (building) {
                setSelectedBuilding(building);
            }
        }
    }, [room.building_id, buildingOptions]);

    // useEffect สำหรับตั้งค่า floor เริ่มต้นจาก room data
    useEffect(() => {
        if (room.floor_id && floorOptions.length > 0) {
            const floor = floorOptions.find(option => option.value === room.floor_id);
            if (floor) {
                setSelectedFloor(floor);
            }
        }
    }, [room.floor_id, floorOptions]);

    const [roomNumber, setRoomNumber] = useState(room.room_number || '');
    const [roomName, setRoomName] = useState(room.room_name || '');
    const [is_active, setIsActive] = useState(room?.is_active);
    const [description, setDescription] = useState(room.description || '');
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
            color = "#d33"; // orange-red
            text = message || "คุณไม่มีสิทธิ์ดำเนินการนี้";
        } else if (status === 404) {
            icon = "info";
            color = "#2196F3"; // blue
            text = message || "ไม่พบข้อมูลที่ต้องการ";
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
            title: "ไม่สามารถแก้ไขข้อมูลห้องได้",
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
            if (selectedBuilding && selectedFloor && selectedRoomType && roomNumber && is_active !== null) {
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
                setSubmitLoading(true);
            }

            const response = await axios.put(`/api/staff/room/${encodeURIComponent(room.id)}`, {
                room_type_id: selectedRoomType.value || room.room_type_id,
                room_number: roomNumber,
                floor_id: selectedFloor.value,
                room_name: roomName,
                description,
                is_active
            });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || 'แก้ไขข้อมูลห้องเรียบร้อยแล้ว',
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
            console.error("Edit room error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="update-room-model">
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[600px] max-w-[800px] bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>แก้ไขข้อมูลห้อง</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-8'>
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col gap-y-4 mb-6'>
                                <div className='flex items-center gap-x-8'>
                                    <p className='min-w-[120px] text-[16px]'>เลือกอาคาร</p>
                                    <Select className='w-full text-[15px]'
                                        value={selectedBuilding}
                                        options={buildingOptions}
                                        onChange={setSelectedBuilding}
                                        placeholder="เลือกอาคาร"
                                        isDisabled={true}
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
                                        }} />
                                </div>
                                <div className='flex items-center gap-x-8'>
                                    <p className='min-w-[120px] text-[16px]'>เลือกชั้น</p>
                                    <Select
                                        className='w-full text-[15px]'
                                        options={floorOptions}
                                        value={selectedFloor}
                                        onChange={setSelectedFloor}
                                        placeholder="เลือกชั้น"
                                        isDisabled={true}
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
                                        }} />
                                </div>
                                <div className='flex items-center gap-x-8'>
                                    <p className='min-w-[120px] text-[16px]'>เลือกประเภทห้อง</p>
                                    <Select className='w-full text-[15px]'
                                        options={roomTypeOptions}
                                        value={roomTypeOptions.find(option => option.value === selectedRoomType)}
                                        onChange={setSelectedRoomType}
                                        placeholder="เลือกประเภทห้อง"
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
                                        }} />
                                </div>
                            </div>
                            <div>
                                <div className='grid grid-cols-2 gap-x-4 mb-4'>
                                    <div className='flex flex-col gap-y-2 '>
                                        <label className='text-gray-600' htmlFor="roomNumber">เลขห้อง</label>
                                        <input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='101' type="text" id="roomNumber" name="roomNumber" />
                                    </div>
                                    <div className='flex flex-col gap-y-2 '>
                                        <label className='text-gray-600' htmlFor="roomName">ชื่อห้อง (ถ้ามี)</label>
                                        <input value={roomName} onChange={(e) => setRoomName(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='ห้อง 101' type="text" id="roomName" name="roomName" />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-y-2 mb-6'>
                                    <label className='text-gray-600' htmlFor="desc">รายละเอียด</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder='ห้องเก็บของ' id="desc" name="desc" ></textarea>
                                </div>
                                <div className='flex items-center justify-end gap-x-4 mb-6'>
                                    <label className='text-gray-600' htmlFor="">สถานะการใช้งาน</label>
                                    <ActiveSwitch checked={is_active} onChange={setIsActive} />
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
            </div>
            {submitLoading && <SubmitLoading />}
        </div>
    )
}


