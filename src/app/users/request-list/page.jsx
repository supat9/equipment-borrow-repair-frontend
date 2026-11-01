'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { MyInstallRequest, MyInstallApproved, MyInstallRejected, MyInstallCancelled, MyInstallCompleted, MyInstallHistory } from '@/components/users/request-list/Request';
import Header from '@/components/users/layout/Header';
import Select from 'react-select';

export default function page() {
    const [selected, setSelected] = useState('waiting');
    const menuManage = [
        { label: "รออนุมัติ", value: "waiting" },
        { label: "อนุมัติแล้ว", value: "confirmed" },
        { label: "เสร็จสิ้น", value: "completed" },
        { label: "ไม่อนุมัติ", value: "rejected" },
        { label: "ยกเลิก", value: "cancelled" },
        { label: "รายการทั้งหมด", value: "all" },
    ];
    return (
        <div className='m-6' id="request-list">
            <Header title='ประวัติรายการติดต่อเจ้าหน้าที่' text='ดูประวัติการติดต่อเจ้าหน้าที่ทั้งหมด' />
            <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8'>
                <div className='flex justify-between items-center gap-2 mb-8'>
                    <h2 className='line-clamp-1 text-[18px] font-bold text-[#4E5155]'>รายการติดต่อเจ้าหน้าที่ของคุณ</h2>
                    <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                </div>
                <div>

                    {/* Desktop Layout */}
                    <div className='hidden xl:flex items-center gap-x-4 border-b border-[#E0E0E0] pb-4 mb-6'>
                        {menuManage.map((value, index) => {
                            return (
                                <div key={index}>
                                    <button className={`text-[16px] cursor-pointer px-4 py-1.5 duration-300 ${selected === value.value ? 'bg-[#28c3d7] text-white rounded-[3px] shadow-[0px_0px_10px_#00000014]' : 'text-[#868686] rounded-[3px] hover:bg-[#C7F3F7]'}`} onClick={() => setSelected(value.value)}>{value.label}</button>
                                </div>
                            );
                        })}
                    </div>
                    {/* Mobile Layout */}
                    <div className='xl:hidden flex justify-start md:justify-end mb-6'>
                        <div className='flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-4'>
                            <label htmlFor="" className='text-sm md:text-base text-gray-600'>เลือกหมวดหมู่</label>
                            <Select
                                className='text-sm md:text-base w-[250px]'
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
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
                                }} options={menuManage} value={menuManage.find(option => option.value === selected)} onChange={opt => setSelected(opt.value)} placeholder="เลือกดูสถานะ" />
                        </div>
                    </div>
                    <div>
                        {selected === 'waiting' && <MyInstallRequest />}
                        {selected === 'confirmed' && <MyInstallApproved />}
                        {selected === 'rejected' && <MyInstallRejected />}
                        {selected === 'cancelled' && <MyInstallCancelled />}
                        {selected === 'completed' && <MyInstallCompleted />}
                        {selected === 'all' && <MyInstallHistory />}
                    </div>
                </div>
            </div>
        </div>
    )
}
