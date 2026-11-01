"use client";
import React from "react";
import { mockFaculties } from '@/mock/mockFaculty';
import Select from 'react-select'
import { useState, useEffect } from 'react';
import { HiPlus, HiOutlineMinusSmall } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { FaLayerGroup } from "react-icons/fa6";
import { PiBooksFill } from "react-icons/pi";
import Swal from 'sweetalert2';
import axios from 'axios';
import { SubmitLoading, DataLoading } from "@/components/users/loading/LoadingOverlay";


export function Major({ majorData, onRefresh, facultyData }) {
  const [addMajorModal, setAddMajorModal] = useState(false);
  const [editMajorModal, setEditMajorModal] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleDeleteMajor = async (major) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ',
      text: `คุณต้องการลบสาขา "${major.major_name || major.majorName}" หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
    });

    if (!result.isConfirmed) return;

    const id = major.id ?? major.major_id ?? major.major_code ?? major.majorCode;
    if (!id) {
      Swal.fire({ icon: 'error', title: 'ไม่พบรหัสสาขา', text: 'ไม่สามารถลบได้ เนื่องจากไม่พบรหัสสาขา' });
      return;
    }

    try {
      setSubmitLoading(true);
      await axios.delete(`/api/admin/major/${encodeURIComponent(id)}`);
      setSubmitLoading(false);
      await Swal.fire({ icon: 'success', title: 'ลบสาขาสำเร็จ', timer: 1200, showConfirmButton: false });
      onRefresh?.();
    } catch (error) {
      console.error('Delete major error:', error);
      const msg = error?.response?.data?.message ?? 'เกิดข้อผิดพลาดในการลบสาขา';
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: msg, confirmButtonColor: '#dc3545' });
    } finally {
      setSubmitLoading(false);
    }
  };

  // จัดกลุ่มข้อมูล major ตาม faculty
  const groupedByFaculty = majorData?.reduce((groups, major) => {
    const facultyName = major.faculty_name;
    if (!groups[facultyName]) {
      groups[facultyName] = [];
    }
    groups[facultyName].push(major);
    return groups;
  }, {}) || {};

  return (
    <div id="major">
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการสาขา</h2>
        <button onClick={() => setAddMajorModal(true)} className='flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'><HiPlus size={23} /> <span>เพิ่มสาขา</span></button>
      </div>
      <div>
        {Object.entries(groupedByFaculty).map(([facultyName, majors]) => {
          return (
            <div className='mb-6 px-4 pt-6 pb-4 border border-[#E0E0E0] rounded-[5px] shadow-[0px_0px_10px_#00000014]' key={facultyName}>
              <div className='mb-6 '>
                <h2 className='text-[16px] bg-white border border-gray-300 cursor-default text-gray-500 rounded-[5px] px-3 py-2 shadow-sm w-fit'>{facultyName}</h2>
              </div>
              {majors.length > 0 ? <table className='w-full tracking-[.5px] text-left border-collapse'>
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
                  {majors.map((major) => (
                    <tr key={major.id} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                      <td className='p-4'>{major.major_code}</td>
                      <td className='p-4'>{major.major_name}</td>
                      <td className='p-4'>
                        <div className='flex items-center gap-x-4'>
                          <button onClick={() => { setSelectedMajor(major); setEditMajorModal(true); }} className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]' title="แก้ไขสาขา">
                            <CiEdit className="text-gray-600" size={20} />
                          </button>
                          <button onClick={() => handleDeleteMajor(major)} className='cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]' title="ลบสาขา">
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
      {addMajorModal && <AddMajorsModal onClose={() => setAddMajorModal(false)} onRefresh={onRefresh} facultyData={facultyData} />}
      {editMajorModal && selectedMajor && (
        <EditMajorModal
          major={selectedMajor}
          onClose={() => { setEditMajorModal(false); setSelectedMajor(null); }}
          onRefresh={onRefresh}
          facultyData={facultyData}
        />
      )}
      {submitLoading && <SubmitLoading />}
    </div>
  )
}

export function AddMajorsModal({ onClose, onRefresh, facultyData }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);
  const facultyOptions = (facultyData && Array.isArray(facultyData) ? facultyData : mockFaculties).map(faculty => ({
    value: faculty.id,
    label: faculty.faculty_name || faculty.name || faculty.facultyName
  }));
  const [countMajors, setCountMajors] = useState(1);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFaculty) {
      Swal.fire({ icon: 'warning', title: 'เลือกคณะ', text: 'โปรดเลือกคณะก่อนบันทึก', confirmButtonColor: '#1BC688' });
      return;
    }

    const majors = [];
    const form = e.target;
    for (let i = 0; i < countMajors; i++) {
      const code = form[`majorCode`]?.value || form.querySelectorAll('input[name="majorCode"]')[i]?.value;
      const name = form[`majorName`]?.value || form.querySelectorAll('input[name="majorName"]')[i]?.value;
      if (code && name) majors.push({ majorCode: code.trim(), majorName: name.trim(), facultyId: Number(selectedFaculty.value) });
    }
    if (majors.length === 0) {
      Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบ', text: 'โปรดกรอกรหัสและชื่อสาขาอย่างน้อยหนึ่งรายการ', confirmButtonColor: '#1BC688' });
      return;
    }

    setIsSubmitting(true);
    try {
      // send sequentially or adapt to your backend that accepts bulk; here we send one by one
      setSubmitLoading(true);
      for (const m of majors) {
        await axios.post('/api/admin/major', {
          facultyId: m.facultyId,
          majorCode: m.majorCode,
          majorName: m.majorName,
        });
      }
      setSubmitLoading(false);
      setIsSubmitting(false);
      onClose();
      onRefresh?.();
      Swal.fire({ icon: 'success', title: 'เพิ่มสาขาสำเร็จ', timer: 1200, showConfirmButton: false, background: '#fff' });
    } catch (error) {
      setIsSubmitting(false);
      const msg = error?.response?.data?.message ?? 'เกิดข้อผิดพลาดในการเพิ่มสาขา';
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: msg, confirmButtonColor: '#dc3545' });
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <div id="add-building-model">
      <div className="fixed inset-0 z-10 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
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
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col items-left gap-y-6 my-6'>
                <div className='flex items-center gap-x-4'>
                  <p className='text-[16px]'>เลือกคณะ</p>
                  <Select autoFocus styles={{
                    control: (base, state) => ({
                      ...base,

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
                  }} className='w-[80%]' options={facultyOptions} placeholder="เลือกคณะ" onChange={(v) => setSelectedFaculty(v)} value={selectedFaculty} />
                </div>
                <div className='flex items-center gap-x-3'>
                  <p>ลด / เพิ่ม</p>
                  <div className='flex items-center gap-x-2'>
                    <button onClick={() => setCountMajors(countMajors - 1)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#e5e7e9] text-[#454545] duration-200 hover:bg-[#cacfd2]'>
                      <HiOutlineMinusSmall size={18} />
                    </button>
                    <button onClick={() => setCountMajors(countMajors + 1)} className='flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>
                      <HiPlus size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <div className='max-h-64 overflow-y-auto mb-4 pr-4'>
                {Array.from({ length: countMajors }, (_, index) => (
                  <div key={index} className='flex items-center gap-x-4'>
                    <div className='flex flex-col gap-y-2 mb-4'>
                      <label htmlFor="majorCode">รหัสสาขา</label>
                      <input className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder={index + 1} type="text" id="majorCode" name="majorCode" required />
                    </div>
                    <div className='flex flex-col gap-y-2 mb-4'>
                      <label htmlFor="majorName">ชื่อสาขา</label>
                      <input className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' placeholder={`สาขา ${index + 1}`} type="text" id="majorName" name="majorName" required />
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex justify-end gap-x-4'>
                <button onClick={onClose} disabled={isSubmitting} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200' >
                  ปิด
                </button>
                <button type="submit" disabled={isSubmitting} className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] '>
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
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

export function EditMajorModal({ major, onClose, onRefresh, facultyData }) {
  const [majorCode, setMajorCode] = useState(major.major_code || major.majorCode || '');
  const [majorName, setMajorName] = useState(major.major_name || major.majorName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const facultyOptions = (facultyData && Array.isArray(facultyData) ? facultyData : mockFaculties).map(faculty => ({
    value: faculty.id,
    label: faculty.faculty_name || faculty.name || faculty.facultyName
  }));

  const initialFaculty = (() => {
    const list = (facultyData && Array.isArray(facultyData)) ? facultyData : mockFaculties;
    const fid = major.faculty_id ?? major.facultyId ?? null;
    if (fid) {
      const f = list.find(x => String(x.id) === String(fid));
      if (f) return { value: f.id, label: f.faculty_name || f.name || f.facultyName };
    }
    if (major.faculty_name) {
      const f = list.find(x => (x.faculty_name || x.name || x.facultyName) === major.faculty_name);
      if (f) return { value: f.id, label: f.faculty_name || f.name || f.facultyName };
    }
    return null;
  })();

  const [selectedFaculty, setSelectedFaculty] = useState(initialFaculty);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!majorCode.trim() || !majorName.trim() || !selectedFaculty) {
      Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบ', text: 'กรุณากรอกข้อมูลชื่อสาขาและรหัสคณะให้ครบถ้วน', confirmButtonColor: '#1BC688' });
      return;
    }
    setIsSubmitting(true);
    try {
      setSubmitLoading(true);
      await axios.put(`/api/admin/major/${encodeURIComponent(major.id || major.major_code)}`, {
        facultyId: Number(selectedFaculty.value),
        majorCode: majorCode.trim(),
        majorName: majorName.trim(),
      });
      setSubmitLoading(false);
      setIsSubmitting(false);
      onClose();
      onRefresh?.();
      Swal.fire({ icon: 'success', title: 'แก้ไขสาขาสำเร็จ', timer: 1200, showConfirmButton: false });
    } catch (error) {
      setIsSubmitting(false);
      const msg = error?.response?.data?.message ?? 'เกิดข้อผิดพลาดในการแก้ไขสาขา';
      Swal.fire({ icon: 'error', title: 'ข้อผิดพลาด', text: msg, confirmButtonColor: '#dc3545' });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div id="edit-major-modal">
      <div className="fixed inset-0 z-10 bg-[rgba(0,0,0,0.4)] flex justify-center items-center" onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}>
        <div className="tracking-[.5px] w-[400px] bg-white rounded-[5px] py-6 shadow-xl relative">
          <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
            <div className='flex items-center gap-x-2'>
              <PiBooksFill size={25} color='#4E5155' />
              <h2 className='text-[18px] font-bold text-[#4E5155]'>แก้ไขสาขา</h2>
            </div>
            <button onClick={() => !isSubmitting && onClose()} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
              <RxCross2 size={20} color='#454545' />
            </button>
          </div>
          <div className='px-6'>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col gap-y-2 mb-4'>
                <label>รหัสสาขา</label>
                <input value={majorCode} onChange={(e) => setMajorCode(e.target.value)} className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' />
              </div>
              <div className='flex flex-col gap-y-2 mb-4'>
                <label>ชื่อสาขา</label>
                <input value={majorName} onChange={(e) => setMajorName(e.target.value)} className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none' />
              </div>
              <div className='flex justify-end gap-x-4'>
                <button type='button' onClick={() => !isSubmitting && onClose()} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                <button type='submit' disabled={isSubmitting} className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]'>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {submitLoading && <SubmitLoading />}
    </div>
  );
}