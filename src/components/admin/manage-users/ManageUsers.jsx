'use client';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { FaSort } from 'react-icons/fa';
import { CiEdit } from "react-icons/ci";
import { PiTrashLight } from "react-icons/pi";
import Select from 'react-select';
import { IoSearchOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { mockAdmin } from '@/mock/mockAdmin';
import { IoIosInformationCircleOutline } from "react-icons/io";
import axios from 'axios';
import Swal from 'sweetalert2';
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { PiFileCsvLight } from "react-icons/pi";
import { useRouter } from 'next/navigation';
import Spinner from '@/components/users/loading/Spinner';
import { SubmitLoading, DataLoading } from '@/components/users/loading/LoadingOverlay';


export function ManageUsers() {
    const router = useRouter();
    const [editUserModal, setEditUserModal] = useState(null);
    const [addUserModal, setAddUserModal] = useState(false);
    const [loading, setLoading] = useState(true);
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [usersList, setUsersList] = useState([]);
    const fetchUsersList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/manage-users');
            setUsersList(response.data);
        } catch (error) {
            console.error('Fetch users list error:', error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchUsersList();
    }, [fetchUsersList]);
    const totalPages = Math.ceil(usersList.length / itemsPerPage);
    const paginatedUsers = usersList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const [submitLoading, setSubmitLoading] = useState(false);
    const handleDelete = async (user) => {
        try {
            const result = await Swal.fire({
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
            if (!result.isConfirmed) return;
            setSubmitLoading(true);
            await axios.delete(`/api/staff/manage-users/${encodeURIComponent(user.id)}`);
            setSubmitLoading(false);
            Swal.fire({
                icon: "success",
                title: `ลบผู้ใช้ ${user.first_name} ${user.last_name} สำเร็จ`,
            });
            fetchUsersList();
        } catch (error) {
            console.error("Delete user error:", error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถแก้ไขข้อมูลได้ โปรดลองอีกครั้ง",
                confirmButtonColor: "#1BC688",
            });
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="manage-users-admin-components">
            <div className='mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายชื่อทั้งหมด</h2>
            </div>
            <div className='mb-6 flex justify-between items-center'>
                <div className='flex items-center gap-x-4'>
                    <div className="flex items-center w-[250px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none">
                        <IoSearchOutline size={20} color="#4E5155" />
                        <input

                            className="w-full text-[#4E5155] focus:outline-none"
                            type="text"
                            placeholder="ค้นหาด้วยรหัสนิสิต"
                        />
                    </div>
                    <Select
                        options={[
                            { value: 1, label: 'admin' },
                            { value: 2, label: 'staff' },
                            { value: 3, label: 'student' },
                            { value: 4, label: 'teacher' }
                        ]}
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
                        }} placeholder="เลือกบทบาท" />
                </div>
                <div className='flex items-center gap-x-4'>
                    <button onClick={() => setAddUserModal(true)} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><HiOutlinePlusSmall size={23} /> <span>เพิ่มรายการนิสิต</span></button>
                    {/* <button onClick={() => router.push('/admin/manage-users/add-users')} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><PiFileCsvLight size={23} /> <span>อัปโหลดด้วยไฟล์</span></button> */}
                </div>
                {/* <button onClick={() => setAdduserModal(true)} className='flex users-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><IoSearchOutline size={23} /> <span>ค้นหา</span></button> */}
            </div>
            <div>
                {loading ? <DataLoading /> : usersList.length === 0 ? (
                    <div className='h-[230px] flex flex-col justify-center items-center tracking-[.5px]'>
                        <div className='mb-3'>
                            <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                        </div>
                        <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีผู้ใช้งานในระบบขณะนี้</p>
                        <p className='text-[14px] text-[#9CA3AF]'>กรุณาเพิ่มข้อมูลผู้ใช้ใหม่</p>
                    </div>
                ) : <table className='w-full tracking-[.5px] text-left border-collapse'>
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
                        {paginatedUsers.map((user) => (
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
                </table>}
                {!loading && usersList.length > 0 && (
                    <div className='flex justify-between items-center mt-4 text-sm text-gray-600'>
                        <span>แสดง {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, usersList.length)} จาก {usersList.length} รายการ</span>
                        <div className='flex items-center gap-x-1'>
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className='px-3 py-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100 disabled:cursor-not-allowed duration-150'
                            >
                                ก่อนหน้า
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1.5 rounded border duration-150 ${page === currentPage ? 'bg-[#1BC688] text-white border-[#1BC688]' : 'border-gray-300 hover:bg-gray-100'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className='px-3 py-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100 disabled:cursor-not-allowed duration-150'
                            >
                                ถัดไป
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {
                editUserModal && (
                    <EditUserModal refresh={fetchUsersList} user={editUserModal} onClose={() => setEditUserModal(null)} />
                )
            }
            {addUserModal && (
                <AddUserModal onClose={() => setAddUserModal(false)} refresh={fetchUsersList} />
            )}
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
    const [employeeId, setEmployeeId] = useState('');
    const roleOptions = [
        { value: 1, label: 'admin' },
        { value: 2, label: 'staff' },
        { value: 3, label: 'student' },
        { value: 4, label: 'teacher' }
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
    const [submitLoading, setSubmitLoading] = useState(false);
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!username || !firstName || !lastName || !email || !phone || (!student_id && !employeeId) || !selectedPrefix || !selectedRole || !selectedFaculty || !selectedMajor) {
                Swal.fire({
                    icon: "warning",
                    title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                    text: "โปรดกรอกข้อมูลในฟิลด์ที่จำเป็นทั้งหมด",
                    confirmButtonColor: "#1BC688",
                    customClass: {
                        container: 'z-[10000]'
                    }
                });
                return;
            }
            const result = await Swal.fire({
                title: 'ยืนยันการเพิ่มผู้ใช้',
                text: `คุณต้องการเพิ่มผู้ใช้หรือไม่?`,
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
            if (!result.isConfirmed) return;
            const formData = {
                username,
                password,
                phone,
                email,
                student_id,
                employeeId,
                prefixId: selectedPrefix ? selectedPrefix.value : '',
                firstName: firstName,
                lastName: lastName,
                roleId: selectedRole ? selectedRole.value : '',
                facultyId: selectedFaculty ? selectedFaculty.value : '',
                majorId: selectedMajor ? selectedMajor.value : '',
            };
            setSubmitLoading(true);
            await axios.post(`/api/admin/manage-users/`, { formData });
            setSubmitLoading(false);
            Swal.fire({
                icon: "success",
                title: "เพิ่มรายการผู้ใช้สำเร็จ",
            });
            refresh();
            onClose();
        } catch (error) {
            console.error("Edit user error:", error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถเพิ่มข้อมูลได้ โปรดลองอีกครั้ง",
                confirmButtonColor: "#1BC688",
                customClass: {
                    container: 'z-[10000]'
                }
            });
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="add-users-modal">
            <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[700px] max-w-[1200px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
                                                    placeholder='รหัสเจ้าหน้าที่'
                                                    type="text"
                                                    id="staffId"
                                                    name="staffId"
                                                    value={employeeId}
                                                    onChange={(e) => setEmployeeId(e.target.value)}
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
                                                    styles={{
                                                        control: (base, state) => ({
                                                            ...base,
                                                            width: "100%",
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
                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">ชื่อจริง</label>
                                                <input
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    styles={{
                                                        control: (base, state) => ({
                                                            ...base,
                                                            width: "100%",
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
                                                    styles={{
                                                        control: (base, state) => ({
                                                            ...base,
                                                            width: "100%",
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
                                                    styles={{
                                                        control: (base, state) => ({
                                                            ...base,
                                                            width: "100%",
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
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end gap-x-4'>
                                        <button type='button' onClick={onClose} className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>

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
    const [employeeId, setEmployeeId] = useState(user.employee_id);
    const roleOptions = [
        { value: 1, label: 'admin' },
        { value: 2, label: 'staff' },
        { value: 3, label: 'student' },
        { value: 4, label: 'teacher' }
    ];
    const [selectedRole, setSelectedRole] = useState(roleOptions.find(role => role.label === user.role));

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
    const [submitLoading, setSubmitLoading] = useState(false);
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!username || !firstName || !lastName || !email || !phone || (!student_id && !employeeId) || !selectedPrefix || !selectedRole || !selectedFaculty || !selectedMajor) {
                Swal.fire({
                    icon: "warning",
                    title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                    text: "โปรดกรอกข้อมูลในฟิลด์ที่จำเป็นทั้งหมด",
                    confirmButtonColor: "#1BC688",
                    customClass: {
                        container: 'z-[10000]'
                    }
                });
                return;
            }
            const result = await Swal.fire({
                title: 'ยืนยันการแก้ไข',
                text: `คุณต้องการแก้ไขข้อมูลหรือไม่?`,
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
            if (!result.isConfirmed) return;
            const formData = {
                username,
                phone,
                email,
                student_id,
                employeeId,
                prefixId: selectedPrefix ? selectedPrefix.value : '',
                firstName: firstName,
                lastName: lastName,
                roleId: selectedRole ? selectedRole.value : '',
                facultyId: selectedFaculty ? selectedFaculty.value : '',
                majorId: selectedMajor ? selectedMajor.value : '',
            };
            setSubmitLoading(true);
            await axios.put(`/api/admin/manage-users/${encodeURIComponent(user.id)}`, { formData });
            setSubmitLoading(false);
            Swal.fire({
                icon: "success",
                title: "แก้ไขข้อมูลสำเร็จ",
            });
            refresh();
            onClose();
        } catch (error) {
            console.error("Edit user error:", error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถแก้ไขข้อมูลได้ โปรดลองอีกครั้ง",
                confirmButtonColor: "#1BC688",
                customClass: {
                    container: 'z-[10000]'
                }
            });
        } finally {
            setSubmitLoading(false);
        }
    }
    return (
        <div id="edit-users-modal">
            <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
                                                    placeholder='รหัสเจ้าหน้าที่'
                                                    type="text"
                                                    id="staffId"
                                                    name="staffId"
                                                    value={employeeId || ''}
                                                    onChange={(e) => setEmployeeId(e.target.value)}
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

                                                    styles={{
                                                        control: (base, state) => ({
                                                            ...base,
                                                            width: "100%",
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
                                                />
                                            </div>
                                            <div className='flex flex-col gap-y-2 mb-4'>
                                                <label htmlFor="equipmentId">ชื่อจริง</label>
                                                <input
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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
                                                    className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
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

                                                    styles={{
                                                        control: (base, state) => ({
                                                            ...base,
                                                            width: "100%",
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

                                                    styles={{
                                                        control: (base, state) => ({
                                                            ...base,
                                                            width: "100%",
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
                                                    styles={{
                                                        control: (base, state) => ({
                                                            ...base,
                                                            width: "100%",
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
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end gap-x-4'>
                                        <button type='button' onClick={onClose} className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>

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