'use client';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { PiFileCsvLight } from "react-icons/pi";
import { SlArrowRight } from "react-icons/sl";
import { mockStudents } from '@/mock/mockStudents';
import { FaSort } from 'react-icons/fa';
import { CiEdit } from "react-icons/ci";
import { PiTrashLight } from "react-icons/pi";
import Select from 'react-select';
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { mockFaculties } from '@/mock/mockFaculty';
import { useRouter } from 'next/navigation';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import Swal from 'sweetalert2';
import Spinner from '@/components/users/loading/Spinner';
import { SubmitLoading, DataLoading } from '@/components/users/loading/LoadingOverlay';
import { FaLayerGroup } from "react-icons/fa";
import { FaHashtag } from "react-icons/fa"; // เพิ่มที่ด้านบน
import { PiHashStraightLight } from "react-icons/pi";
import { IoRefresh } from "react-icons/io5";
import Pagination from '@/components/staff/pagination/Pagination';


export function ManageStudents() {
    const router = useRouter();
    const [searchId, setSearchId] = useState('');
    const [searchName, setSearchName] = useState('');
    const [addUserTypeModalOpen, setAddUserTypeModalOpen] = useState(false);

    const [selectedRole, setSelectedRole] = useState(null);
    const [student_id, setStudent_id] = useState('');
    const [name, setName] = useState('');

    const optionRole = [
        // { value: '', label: 'ทุกบทบาท' },
        { value: 'student', label: 'นิสิต' },
        { value: 'teacher', label: 'อาจารย์' },
        { value: 'staff', label: 'เจ้าหน้าที่' },
        { value: 'admin', label: 'ผู้ดูแลระบบ' }
    ];
    const [editUserModal, setEditUserModal] = useState(null);
    const [addUserModal, setAddUserModal] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const fetchUsersList = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/staff/manage-users',
                {
                    params: {
                        role: selectedRole ? selectedRole.value : null,
                        student_id: student_id.trim(),
                        name: name.trim()
                    }
                }
            );
            setUsersList(response.data);
        } catch (error) {
            console.error('Fetch users list error:', error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        setCurrentPage(1);
        fetchUsersList();
    }, [student_id, name, selectedRole]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setStudent_id(searchId);
            setName(searchName);
        }, 500); // 500ms หลังหยุดพิมพ์

        return () => clearTimeout(handler);
    }, [searchName, searchId, selectedRole]);
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
            title: "ไม่สามารถส่งคำขอได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    const [submitLoading, setSubmitLoading] = useState(false);
    const handleDelete = async (user) => {
        try {
            const confirmed = await Swal.fire({
                title: 'ยืนยันการลบ',
                text: `คุณต้องการลบผู้ใช้ ${user.first_name} ${user.last_name} หรือไม่?`,
                icon: 'warning',
                confirmButtonText: 'ตกลง',
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
            const response = await axios.delete(`/api/staff/manage-users/${encodeURIComponent(user.id)}`);
            const result = response.data;
            setSubmitLoading(false);
            Swal.fire({
                icon: "success",
                title: result?.message || `ลบผู้ใช้เสร็จสิ้น`,
                text: `ลบผู้ใช้ ${user.first_name} ${user.last_name} สำเร็จ`,
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1BC688',
            });
            fetchUsersList();
        } catch (error) {
            console.error("Delete user error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    const statusColor = {
        student: {
            bg: 'bg-blue-50 border border-blue-200',
            dot: 'bg-blue-500',
            text: 'text-blue-700',
            label: 'นิสิต'
        },
        staff: {
            bg: 'bg-green-50 border border-green-200',
            dot: 'bg-green-500',
            text: 'text-green-700',
            label: 'เจ้าหน้าที่'
        },
        teacher: {
            bg: 'bg-purple-50 border border-purple-200',
            dot: 'bg-purple-500',
            text: 'text-purple-700',
            label: 'อาจารย์'
        },
        admin: {
            bg: 'bg-yellow-50 border border-yellow-200',
            dot: 'bg-yellow-500',
            text: 'text-yellow-700',
            label: 'ผู้ดูแลระบบ'
        }
    };
    const handleClear = async () => {
        try {
            setSearchId('');
            setSearchName('');
            setSelectedRole(null);
            setStudent_id('');
            setName('');
        } catch (error) {
            console.error("Clear search errors:", error);
        }
    }
    return (
        <>
            <div className='flex justify-between items-center mb-8'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>จัดการข้อมูลนิสิต</h2>
                <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
            </div>
            <div>
                <div className='flex items-center gap-x-4 mb-4'>
                    {/* <button onClick={() => setAddUserModal(true)} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><HiOutlinePlusSmall size={23} /> <span>เพิ่มผู้ใช้</span></button>
                    <button onClick={() => router.push('/staff/manage-students/add-students')} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><PiFileCsvLight size={23} /> <span>อัปโหลดด้วยไฟล์</span></button> */}
                </div>
                <div className='mb-6 flex justify-between items-center'>
                    <div className='flex items-center gap-x-4'>
                        <div className='flex items-center w-[250px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'>
                            <PiHashStraightLight size={23} color='#4E5155' />
                            <input value={searchId} onChange={(e) => setSearchId(e.target.value)} className='w-full text-[#4E5155] duration-300 focus:outline-none' type="text" placeholder='ค้นหาด้วยรหัสนิสิต' />
                        </div>
                        <div className='flex items-center w-[250px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'>
                            <IoSearchOutline size={20} color='#4E5155' />
                            <input value={searchName} onChange={(e) => setSearchName(e.target.value)} className='w-full text-[#4E5155] duration-300 focus:outline-none' type="text" placeholder='ค้นหาด้วยชื่อ' />
                        </div>
                        <Select styles={{
                            control: (base, state) => ({
                                ...base,
                                width: '250px',
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
                        }} options={optionRole} value={selectedRole} onChange={setSelectedRole} placeholder="เลือกบทบาท" />
                        {/* <Select styles={{
                            control: (base) => ({
                                ...base,
                                width: '200px',
                                minHeight: '44px',
                                height: '44px',
                                borderRadius: '5px',
                                borderColor: '#D1D5DB',
                                fontSize: '16px',
                                color: '#4E5155',
                            }),
                        }} options={optionRole} placeholder="ทุกบทบาท" />
                        <Select styles={{
                            control: (base) => ({
                                ...base,
                                width: '200px',
                                minHeight: '44px',
                                height: '44px',
                                borderRadius: '5px',
                                borderColor: '#D1D5DB',
                                fontSize: '16px',
                                color: '#4E5155',
                            }),
                        }} /> */}
                    </div>
                    <div className='flex items-center gap-x-4'>
                        <button
                            onClick={handleClear}
                            type='button'
                            className='flex items-center justify-center gap-x-2 h-[40px] text-[14px] px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-[5px] font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer'
                        >
                            <span><IoRefresh size={20} className='text-gray-500' /></span>
                        </button>
                        <button onClick={() => setAddUserTypeModalOpen(true)} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><HiOutlinePlusSmall size={23} /> <span>เพิ่มผู้ใช้</span></button>

                    </div>
                </div>
                <div>
                    {loading ? <DataLoading style='h-[230px]' /> : usersList.length === 0 ? <div className='h-[230px] flex flex-col justify-center items-center tracking-[.5px]'>
                        <div className='mb-3'>
                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                        </div>
                        <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีผู้ใช้งานในระบบขณะนี้</p>
                        <p className='text-[14px] text-[#9CA3AF]'>กรุณาเพิ่มข้อมูลผู้ใช้ใหม่</p>
                    </div> : <>
                    <table className='w-full tracking-[.5px] text-left border-collapse'>
                        <thead className='bg-slate-50 border border-gray-300'>
                            <tr className='text-sm text-gray-700'>
                                <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                    รหัสนิสิต
                                </span></th>
                                <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                    อีเมล
                                </span></th>
                                <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                    ชื่อจริง
                                </span></th>
                                <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                    นามสกุล
                                </span></th>
                                <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                    เบอร์โทรศัพท์
                                </span></th>
                                <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                    บทบาท
                                </span></th>
                                <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการนิสิต</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user) => (
                                <tr key={user.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                    <td className='p-4'>{user.student_id || user.employee_id}</td>
                                    <td className='p-4'>{user.email}</td>
                                    <td className='p-4'>{user.first_name}</td>
                                    <td className='p-4'>{user.last_name}</td>
                                    <td className='p-4'>{user.phone}</td>
                                    <td className='p-4'>
                                        {statusColor[user.role] && (
                                            <div className={`flex items-center gap-x-2 w-[105px] rounded-lg px-3 py-1 ${statusColor[user.role].bg} `}>
                                                {/* border  ${statusColor[user.role].border} */}
                                                <div className={`size-2 rounded-full ${statusColor[user.role].dot}`}></div>
                                                <span className={`cursor-default ${statusColor[user.role].text} text-[13px]`}>
                                                    {statusColor[user.role].label}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className='p-4'>
                                        <div className='flex items-center gap-x-4'>
                                            <button onClick={() => setEditUserModal(user)} className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                                <CiEdit className="text-gray-600" size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(user)} className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                                <PiTrashLight className="text-gray-600" size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex justify-between items-center mt-4 text-sm text-gray-600'>
                        <span>แสดง {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, usersList.length)} จาก {usersList.length} รายการ</span>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(usersList.length / itemsPerPage)}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                    </>}
                </div>
            </div>
            {editUserModal && (
                <EditUserModal user={editUserModal} onClose={() => setEditUserModal(null)} refresh={fetchUsersList} />
            )}
            {addUserModal && (
                <AddUserModal onClose={() => setAddUserModal(false)} refresh={fetchUsersList} />
            )}
            {addUserTypeModalOpen && (
                <AddUserTypeModal addOneUser={() => setAddUserModal(true)} addBulkUser={() => router.push('/staff/manage-students/bulk-upload')} onClose={() => setAddUserTypeModalOpen(false)} />
            )}
            {submitLoading && <SubmitLoading />}
        </>
    )
}

export function AddUserTypeModal({ onClose, addOneUser, addBulkUser }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    // ตัวอย่างฟังก์ชันสำหรับแต่ละตัวเลือก (ต้องไปเชื่อมต่อกับ modal จริง)
    const handleAddSingle = () => {
        addOneUser();
        onClose();
        // เปิด AddUserModal
        // setAddUserModal(true) หรือฟังก์ชันที่เหมาะสม
    };
    const handleAddBulk = () => {
        addBulkUser();
        onClose();
        // ไปหน้าอัปโหลดไฟล์ หรือเปิด modal สำหรับ bulk
        // router.push('/staff/manage-students/add-students') หรือฟังก์ชันที่เหมาะสม
    };

    return (
        <div id="type-add-users-modal">
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[400px] max-w-[500px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>เลือกวิธีการเพิ่มผู้ใช้</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <div className="flex flex-col gap-y-4 mt-2">
                            <button
                                onClick={handleAddSingle}
                                className="cursor-pointer flex items-center gap-x-3 w-full px-4 py-3 border border-gray-300 rounded-[5px]  hover:border-[#1bc688]  transition group"
                            >
                                <HiOutlinePlusSmall size={30} className="text-[#1BC688] duration-300 group-hover:scale-125" />
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-base text-[#1BC688]">เพิ่มทีละคน</span>
                                    <span className="text-gray-600 text-sm">กรอกข้อมูลผู้ใช้ทีละราย</span>
                                </div>
                                <SlArrowRight className="ml-auto text-gray-400 group-hover:text-[#1BC688]" />
                            </button>
                            <button
                                onClick={handleAddBulk}
                                className="cursor-pointer flex items-center gap-x-3 w-full px-4 py-3 border border-gray-300 rounded-[5px]  hover:border-[#1bc688]  transition group"
                            >
                                <PiFileCsvLight size={30} className="text-[#1BC688] duration-300 group-hover:scale-125" />
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-base text-[#1BC688]">เพิ่มแบบกลุ่ม (CSV)</span>
                                    <span className="text-gray-600 text-sm">นำเข้าไฟล์ .csv เพื่อเพิ่มผู้ใช้หลายราย</span>
                                </div>
                                <SlArrowRight className="ml-auto text-gray-400 group-hover:text-[#1BC688]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function EditUserModal({ user, onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState('');
    const [student_id, setStudent_id] = useState(user.student_id);
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [employee_id, setEmployee_id] = useState(user.employee_id);
    const roleOptions = [
        { value: 1, label: 'ผู้ดูแลระบบ' },
        { value: 2, label: 'เจ้าหน้าที่' },
        { value: 3, label: 'นิสิต' },
        { value: 4, label: 'อาจารย์' }
    ];
    const [selectedRole, setSelectedRole] = useState(roleOptions.find(role => role.value === user.role_id));

    const [prefixOptions, setPrefixOptions] = useState([]);
    const [selectedPrefix, setSelectedPrefix] = useState(null);

    const [facultyOptions, setFacultyOptions] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [majorOptions, setMajorOptions] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState(null);

    const fetchPrefixes = useCallback(async () => {
        try {
            const response = await axios.get('/api/staff/prefix');
            const options = response.data.map((prefix) => ({
                value: prefix.id,
                label: prefix.prefix_name
            }));
            setPrefixOptions(options);

            // หา selectedPrefix หลังจากที่ได้ข้อมูลแล้ว
            const foundPrefix = options.find(prefix => prefix.label === user.prefix_name);
            if (foundPrefix) {
                setSelectedPrefix(foundPrefix);
            }
        } catch (error) {
            console.error("Error fetching prefixes:", error);
        }
    }, [user.prefix_name]);

    const fetchFaculties = useCallback(async () => {
        try {
            const response = await axios.get('/api/staff/faculty');
            const options = response.data.map((faculty) => ({
                value: faculty.id,
                label: faculty.faculty_name
            }));
            setFacultyOptions(options);

            // หา selectedFaculty หลังจากที่ได้ข้อมูลแล้ว
            const foundFaculty = options.find(faculty => faculty.label === user.faculty_name);
            if (foundFaculty) {
                setSelectedFaculty(foundFaculty);
                // ดึงข้อมูล major ทันทีหลังจากหา faculty แล้ว
                fetchMajorByFacultyId(foundFaculty.value);
            }
        } catch (error) {
            console.error("Error fetching faculties:", error);
        }
    }, [user.faculty_name]);

    const fetchMajorByFacultyId = useCallback(async (facultyId) => {
        try {
            const response = await axios.get(`/api/staff/major/${encodeURIComponent(facultyId)}`);
            const options = response.data.map((major) => ({
                value: major.id,
                label: major.major_name
            }));
            setMajorOptions(options);

            // หา selectedMajor หลังจากที่ได้ข้อมูลแล้ว
            const foundMajor = options.find(major => major.label === user.major_name);
            if (foundMajor) {
                setSelectedMajor(foundMajor);
            }
        } catch (error) {
            console.error("Fetch major list by faculty error:", error);
        }
    }, []);

    // เพิ่ม useEffect สำหรับจัดการเมื่อ faculty เปลี่ยน
    useEffect(() => {
        if (selectedFaculty?.value) {
            // รีเซ็ต major เมื่อ faculty เปลี่ยน
            if (selectedFaculty.label !== user.faculty_name) {
                setMajorOptions([]);
                setSelectedMajor(null);
            }
            fetchMajorByFacultyId(selectedFaculty.value);
        }
    }, [selectedFaculty, fetchMajorByFacultyId, user.faculty_name]);

    useEffect(() => {
        fetchPrefixes();
        fetchFaculties();
    }, [fetchPrefixes, fetchFaculties]);
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
            title: "ไม่สามารถแก้ไขข้อมูลได้",
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
            if (username && firstName && lastName && email && phone && selectedPrefix && selectedRole && selectedFaculty && selectedMajor) {
                const confirmed = await Swal.fire({
                    title: 'ยืนยันการแก้ไขข้อมูล',
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
            const formData = {
                username,
                phone,
                email,
                student_id,
                employee_id,
                prefixId: selectedPrefix ? selectedPrefix.value : '',
                firstName: firstName,
                lastName: lastName,
                roleId: selectedRole ? selectedRole.value : '',
                facultyId: selectedFaculty ? selectedFaculty.value : '',
                majorId: selectedMajor ? selectedMajor.value : '',
            };
            setSubmitLoading(true);
            const response = await axios.put(`/api/staff/manage-users/${encodeURIComponent(user.id)}`, { formData });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                icon: 'success',
                title: result?.message || 'แก้ไขข้อมูลสำเร็จ',
                confirmButtonText: 'ตกลง',
            });
            refresh();
            onClose();
        } catch (error) {
            console.error("Edit user error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="edit-users-modal">
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[700px] max-w-[1200px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>แก้ไขข้อมูลนิสิต</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <form onSubmit={handleSubmit} action="" className='text-[#4E5155]'>
                            <div className='grid grid-cols-[2fr_1fr] gap-x-6'>
                                <div>
                                    <div>
                                        <h2 className='mb-2 text-[18px] font-bold '>ข้อมูลบัญชี</h2>
                                        <div className='grid grid-cols-2 gap-x-4 border-b border-[#E0E0E0] pb-4 mb-6'>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">ชื่อบัญชี</label>
                                                <input

                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='ชื่อบัญชี'
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">รหัสผ่าน</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='รหัสผ่าน'
                                                    type="text"
                                                    id="password"
                                                    name="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">รหัสนิสิต</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='รหัสนิสิต'
                                                    type="text"
                                                    id="studentId"
                                                    name="studentId"
                                                    value={student_id || ''}
                                                    onChange={(e) => setStudent_id(e.target.value)}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">รหัสเจ้าหน้าที่</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='รหัสเจ้าหน้าที่'
                                                    type="text"
                                                    id="staffId"
                                                    name="staffId"
                                                    value={employee_id || ''}
                                                    onChange={(e) => setEmployee_id(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className='mb-2 text-[18px] font-bold '>ข้อมูลส่วนตัว</h2>
                                        <div className='grid grid-cols-3 gap-x-4'>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">คำนำหน้า</label>
                                                <Select
                                                    inputId="prefix"
                                                    name="prefix"
                                                    options={prefixOptions}
                                                    value={selectedPrefix}
                                                    onChange={setSelectedPrefix}
                                                    className='w-full'
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
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">ชื่อจริง</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='ชื่อจริง'
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"

                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}

                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">นามสกุล</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='นามสกุล'
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}

                                                />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-2 gap-x-4 '>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">อีเมล</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='อีเมล'
                                                    type="text"
                                                    id="email"
                                                    name="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}

                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">เบอร์โทรศัพท์</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='เบอร์โทรศัพท์'
                                                    type="text"
                                                    id="phone"
                                                    name="phone"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}

                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-between border-l border-[#E0E0E0] pl-6'>
                                    <div>
                                        <h2 className='mb-2 text-[18px] font-bold '>ข้อมูลสังกัดและบทบาท</h2>
                                        <div className='grid grid-cols-1 gap-x-4'>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">คณะ</label>
                                                <Select
                                                    inputId="faculty"
                                                    name="faculty"
                                                    options={facultyOptions}
                                                    value={selectedFaculty}
                                                    onChange={setSelectedFaculty}
                                                    className='w-full'
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
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">สาขา</label>
                                                <Select
                                                    inputId="major"
                                                    name="major"
                                                    options={majorOptions}
                                                    value={selectedMajor}
                                                    onChange={setSelectedMajor}
                                                    className='w-full'
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
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">บทบาท</label>
                                                <Select
                                                    inputId="role"
                                                    name="role"
                                                    options={roleOptions}
                                                    value={selectedRole}
                                                    onChange={setSelectedRole}
                                                    className='w-full'
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
                                    </div>
                                    <div className='flex justify-end gap-x-4'>
                                        <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                                        <button type='submit' className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] '>
                                            บันทึก
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {submitLoading && <SubmitLoading />}
        </div>
    )
}

export function AddUserModal({ onClose, refresh }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [student_id, setStudent_id] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [employee_id, setEmployee_id] = useState('');
    const roleOptions = [
        { value: 1, label: 'ผู้ดูแลระบบ' },
        { value: 2, label: 'เจ้าหน้าที่' },
        { value: 3, label: 'นิสิต' },
        { value: 4, label: 'อาจารย์' }
    ];
    const [selectedRole, setSelectedRole] = useState(null);
    const [prefixOptions, setPrefixOptions] = useState([]);
    const [selectedPrefix, setSelectedPrefix] = useState(null);
    const [facultyOptions, setFacultyOptions] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [majorOptions, setMajorOptions] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState(null);

    const fetchPrefixes = useCallback(async () => {
        try {
            const response = await axios.get('/api/staff/prefix');
            const options = response.data.map((prefix) => ({
                value: prefix.id,
                label: prefix.prefix_name
            }));
            setPrefixOptions(options);
        } catch (error) {
            console.error("Error fetching prefixes:", error);
        }
    }, []);

    const fetchFaculties = useCallback(async () => {
        try {
            const response = await axios.get('/api/staff/faculty');
            const options = response.data.map((faculty) => ({
                value: faculty.id,
                label: faculty.faculty_name
            }));
            setFacultyOptions(options);
        } catch (error) {
            console.error("Error fetching faculties:", error);
        }
    }, []);

    const fetchMajorByFacultyId = useCallback(async (facultyId) => {
        try {
            const response = await axios.get(`/api/staff/major/${encodeURIComponent(facultyId)}`);
            const options = response.data.map((major) => ({
                value: major.id,
                label: major.major_name
            }));
            setMajorOptions(options);
        } catch (error) {
            console.error("Fetch major list by faculty error:", error);
        }
    }, []);

    useEffect(() => {
        if (selectedFaculty?.value) {
            setMajorOptions([]);
            setSelectedMajor(null);
            fetchMajorByFacultyId(selectedFaculty.value);
        } else {
            setMajorOptions([]);
            setSelectedMajor(null);
        }
    }, [selectedFaculty]);

    useEffect(() => {
        fetchPrefixes();
        fetchFaculties();
    }, [fetchPrefixes, fetchFaculties]);
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
            title: "ไม่สามารถเพิ่มผู้ใช้ได้",
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
            if (username && firstName && lastName && email && phone && password && selectedPrefix && selectedRole && selectedFaculty && selectedMajor) {
                const confirmed = await Swal.fire({
                    title: 'ยืนยันการเพิ่มผู้ใช้',
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
            const formData = {
                username,
                password,
                phone,
                email,
                student_id,
                employee_id,
                prefixId: selectedPrefix ? selectedPrefix.value : '',
                firstName: firstName,
                lastName: lastName,
                roleId: selectedRole ? selectedRole.value : '',
                facultyId: selectedFaculty ? selectedFaculty.value : '',
                majorId: selectedMajor ? selectedMajor.value : '',
            };
            setSubmitLoading(true);
            const response = await axios.post(`/api/staff/manage-users/`, { formData });
            const result = response.data;
            setSubmitLoading(false);
            await Swal.fire({
                icon: 'success',
                title: result?.message || 'เพิ่มผู้ใช้สำเร็จ',
                confirmButtonText: 'ตกลง',
            });
            refresh();
            onClose();
        } catch (error) {
            console.error("Edit user error:", error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="add-users-modal">
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[700px] max-w-[1200px] w-full bg-gray-50 rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>เพิ่มรายการนิสิต</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <form onSubmit={handleSubmit} action="" className='text-[#4E5155]'>
                            <div className='grid grid-cols-[2fr_1fr] gap-x-6'>
                                <div>
                                    <div>
                                        <h2 className='mb-2 text-[18px] font-bold '>ข้อมูลบัญชี</h2>
                                        <div className='grid grid-cols-2 gap-x-4 border-b border-[#E0E0E0] pb-4 mb-6'>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">ชื่อบัญชี</label>
                                                <input
                                                    autoFocus
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='ชื่อบัญชี'
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">รหัสผ่าน</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='รหัสผ่าน'
                                                    type="text"
                                                    id="password"
                                                    name="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">รหัสนิสิต</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='รหัสนิสิต'
                                                    type="text"
                                                    id="studentId"
                                                    name="studentId"
                                                    value={student_id}
                                                    onChange={(e) => setStudent_id(e.target.value)}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">รหัสเจ้าหน้าที่</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='รหัสเจ้าหน้าที่'
                                                    type="text"
                                                    id="staffId"
                                                    name="staffId"
                                                    value={employee_id}
                                                    onChange={(e) => setEmployee_id(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className='mb-2 text-[18px] font-bold '>ข้อมูลส่วนตัว</h2>
                                        <div className='grid grid-cols-3 gap-x-4'>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">คำนำหน้า</label>
                                                <Select
                                                    inputId="prefix"
                                                    name="prefix"
                                                    options={prefixOptions}
                                                    value={selectedPrefix}
                                                    onChange={setSelectedPrefix}
                                                    placeholder="เลือกคำนำหน้า"
                                                    className='w-full'
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
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">ชื่อจริง</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='ชื่อจริง'
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"

                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}

                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">นามสกุล</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='นามสกุล'
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}

                                                />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-2 gap-x-4 '>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">อีเมล</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='อีเมล'
                                                    type="text"
                                                    id="email"
                                                    name="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}

                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">เบอร์โทรศัพท์</label>
                                                <input
                                                    className='text-[#4E5155] border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none'
                                                    placeholder='เบอร์โทรศัพท์'
                                                    type="text"
                                                    id="phone"
                                                    name="phone"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}

                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-between border-l border-[#E0E0E0] pl-6'>
                                    <div>
                                        <h2 className='mb-2 text-[18px] font-bold '>ข้อมูลสังกัดและบทบาท</h2>
                                        <div className='grid grid-cols-1 gap-x-4'>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">คณะ</label>
                                                <Select
                                                    inputId="faculty"
                                                    name="faculty"
                                                    options={facultyOptions}
                                                    value={selectedFaculty}
                                                    onChange={setSelectedFaculty}
                                                    placeholder="เลือกคณะ"
                                                    className='w-full'
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
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">สาขา</label>
                                                <Select
                                                    inputId="major"
                                                    name="major"
                                                    options={majorOptions}
                                                    value={selectedMajor}
                                                    onChange={setSelectedMajor}
                                                    isDisabled={!selectedFaculty}
                                                    placeholder="เลือกสาขา"
                                                    className='w-full'
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
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentName">บทบาท</label>
                                                <Select
                                                    inputId="role"
                                                    name="role"
                                                    options={roleOptions}
                                                    value={selectedRole}
                                                    onChange={setSelectedRole}
                                                    placeholder="เลือกบทบาท"
                                                    className='w-full'
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
                                    </div>
                                    <div className='flex justify-end gap-x-4'>
                                        <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                                        <button type='submit' className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] '>
                                            บันทึก
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {submitLoading && <SubmitLoading />}
        </div>
    )
}

