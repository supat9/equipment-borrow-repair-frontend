'use client';
import React from 'react';
import { mockFaculties } from '@/mock/mockFaculty';
import Select from 'react-select'
import { useState, useEffect } from 'react';
import { HiOutlinePlusSmall, HiOutlineMinusSmall } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { FaLayerGroup } from "react-icons/fa6";
import { PiBooksFill } from "react-icons/pi";


export function Major() {
  const [addMajorModal, setAddMajorModal] = useState(false);
  return (
    <div id="major">
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการสาขา</h2>
        <button onClick={() => setAddMajorModal(true)} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><HiOutlinePlusSmall size={23} /> <span>เพิ่มสาขา</span></button>
      </div>
      <div>
        {mockFaculties.map((faculty) => {
          return (
            <div className='mb-6 px-4 pt-6 pb-4 border border-[#E0E0E0] rounded-[5px] shadow-[0px_0px_10px_#00000014]' key={faculty.id}>
              <div className='mb-6 '>
                <h2 className='flex items-center gap-x-2 text-[14px] bg-[#32CEB0] cursor-default text-white rounded-[5px] px-3 py-1 w-fit'>{faculty.name}</h2>
              </div>
              {faculty.majors.length > 0 ? <table className='w-full tracking-[.5px] text-left border-collapse'>
                <thead className='bg-slate-50 border border-gray-300'>
                  <tr className='text-sm text-gray-700'>
                    <th className='font-light text-[#606060] px-4 py-3 rounded-l-[3px]'>รหัสสาขา</th>
                    <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                      ชื่อสาขา 
                    </span></th>
                    <th className='font-light text-[#606060] px-4 py-3 rounded-r-[3px]'>จัดการสาขา</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.majors.map((major) => (
                    <tr key={major.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                      <td className='p-4'>{major.id}</td>
                      <td className='p-4'>{major.name}</td>
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
              </table> : <div className='py-8 text-center tracking-[.5px]'>
                <div className='mb-3'>
                  <FaLayerGroup size={48} className='mx-auto text-[#E5E7EB]' />
                </div>
                <p className='text-[16px] text-[#6B7280] mb-2'>ยังไม่มีข้อมูลสาขา</p>
                <p className='text-[14px] text-[#9CA3AF]'>เริ่มต้นโดยการเพิ่มสาขาใหม่</p>
              </div>}
            </div>
          )
        })}
      </div>
      {addMajorModal && <AddMajorsModal onClose={() => setAddMajorModal(false)} />}
    </div>
  )
}

export function AddMajorsModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);
  const options = mockFaculties.map(faculty => ({
    value: faculty.name,
    label: faculty.name
  }));
  const [countMajors, setCountMajors] = useState(1);
  return (
    <div id="add-building-model">
      <div className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
        <div className="tracking-[.5px] w-fit bg-white rounded-[5px] py-6 shadow-xl relative">
          <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
            <div className='flex items-center gap-x-2'>
              <PiBooksFill size={25} color='#4E5155' />
              <h2 className='text-[18px] font-bold text-[#4E5155]'>เพิ่มสาขา</h2>
            </div>
            <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
              <RxCross2 size={20} color='#454545' />
            </button>
          </div>
          <div className='px-6'>
            <form action="">
              <div className='flex flex-col items-left gap-y-6 my-6'>
                <div className='flex items-center gap-x-4'>
                  <p className='text-[16px]'>เลือกคณะ</p>
                  <Select className='w-[80%]' options={options} placeholder="เลือกคณะ" />
                </div>
                <div className='flex items-center gap-x-3'>
                  <p>ลด / เพิ่ม</p>
                  <div className='flex items-center gap-x-2'>
                    <button onClick={() => setCountMajors(countMajors - 1)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#e5e7e9] text-[#454545] duration-200 hover:bg-[#cacfd2]'>
                      <HiOutlineMinusSmall size={18} />
                    </button>
                    <button onClick={() => setCountMajors(countMajors + 1)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>
                      <HiOutlinePlusSmall size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <div className='max-h-64 overflow-y-auto mb-4 pr-4'>
                {Array.from({ length: countMajors }, (_, index) => (
                  <div key={index} className='flex items-center gap-x-4'>
                    <div className='flex flex-col gap-y-2 mb-4'>
                      <label htmlFor="majorCode">รหัสสาขา</label>
                      <input className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 focus:outline-none' placeholder={index + 1} type="text" id="majorCode" name="majorCode" required />
                    </div>
                    <div className='flex flex-col gap-y-2 mb-4'>
                      <label htmlFor="majorName">ชื่อสาขา</label>
                      <input className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 focus:outline-none' placeholder={`สาขา ${index + 1}`} type="text" id="majorName" name="majorName" required />
                    </div>
                  </div>
                ))}
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