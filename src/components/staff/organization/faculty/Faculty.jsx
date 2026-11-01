'use client';
import React from 'react';
import { mockFaculties } from '@/mock/mockFaculty';
import { useState, useEffect } from 'react';
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { FaUniversity } from "react-icons/fa";

export function Faculty() {
    const [addFacultyModal, setAddFacultyModal] = useState(false);
    return (
        <div id="faculty">
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการคณะ</h2>
                <button onClick={() => setAddFacultyModal(true)} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><HiOutlinePlusSmall size={23} /> <span>เพิ่มคณะ</span></button>
            </div>
            <div>
                <table className='w-full tracking-[.5px] text-left border-collapse'>
                    <thead className='bg-slate-50 border border-gray-300'>
                        <tr className='text-sm text-gray-700'>
                            <th className='font-light text-[#606060] px-4 py-3 rounded-l-[3px]'>รหัสคณะ</th>
                            <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                ชื่อคณะ 
                            </span></th>
                            <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                จำนวนสาขา 
                            </span></th>
                            <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการคณะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockFaculties.map((faculty) => (
                            <tr key={faculty.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                <td className='p-4'>{faculty.code}</td>
                                <td className='p-4'>{faculty.name}</td>
                                <td className='p-4'>{faculty.majors.length} สาขา</td>
                                <td className='p-4'>
                                    <div className='flex items-center gap-x-4'>
                                        <button className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                            <CiEdit className="text-gray-600" size={20} />
                                        </button>
                                        <button className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]'>
                                            <PiTrashLight className="text-gray-600" size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {addFacultyModal && <AddFacultyModal onClose={() => setAddFacultyModal(false)} />}
        </div>
    )
}

export function AddFacultyModal({ onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    return (
        <div id="add-Faculty-model">
            <div className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[400px] max-w-[400px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <FaUniversity size={25} color='#4E5155' />
                            <h2 className='text-[18px] font-bold text-[#4E5155]'>เพิ่มคณะ</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <form action="">
                            <div className='flex flex-col gap-y-2 mb-4'>
                                <label htmlFor="FacultyCode">รหัสคณะ</label>
                                <input className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 focus:outline-none' placeholder='Q' type="text" id="facultyCode" name="facultyCode" required />
                            </div>
                            <div className='flex flex-col gap-y-2 mb-4'>
                                <label htmlFor="FacultyName">ชื่อคณะ</label>
                                <input className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 focus:outline-none' placeholder='ศิลปศาสตร์และวิทยาศาสตร์' type="text" id="facultyName" name="facultyName" required />
                            </div>
                            <div className='flex flex-col gap-y-2 mb-4'>
                                <label htmlFor="desc">รายละเอียด</label>
                                <textarea className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 focus:outline-none' placeholder='คณะที่มีสาขาเยอะที่สุด' id="desc" name="desc" required></textarea>
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#e5e7e9] text-[#454545] duration-200 hover:bg-[#cacfd2]' >
                                    ยกเลิก
                                </button>
                                <button className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] '>
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
