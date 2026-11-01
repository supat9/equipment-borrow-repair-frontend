'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { MyBorrowsRequest, MyBorrowsApproved, MyBorrowsBorrowing, MyBorrowsReturned, MyBorrowsRejected, MyBorrowsHistory, MyBorrowsCancelled, MyBorrowsOverdue } from '@/components/users/borrows/Borrows';
import Header from '@/components/users/layout/Header';
import Select from 'react-select';

export default function page() {
    const [selected, setSelected] = useState('borrow');
    const menuManage = [
        { label: "รออนุมัติ", value: "borrow" },
        { label: "อนุมัติแล้ว", value: "approved" },
        { label: "กำลังยืม", value: "borrowing" },
        { label: "เกินกำหนด", value: "overdue" },
        { label: "คืนแล้ว", value: "returned" },
        { label: "ไม่อนุมัติ", value: "rejected" },
        { label: "ยกเลิก", value: "cancelled" },
        { label: "รายการทั้งหมด", value: "history" },
    ];


    return (
        <div className='m-6' id="user-borrows">
            <Header title='ประวัติรายการคำขอในระบบ' text='ดูรายการคำขอทั้งหมด' />
            <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8'>
                <div className='flex justify-between items-center mb-8'>
                    <h2 className='text-[18px] font-bold text-[#4E5155]'>รายการคำขอยืมของคุณ</h2>
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
                        {selected === 'borrow' && <MyBorrowsRequest />}
                        {selected === 'approved' && <MyBorrowsApproved />}
                        {selected === 'borrowing' && <MyBorrowsBorrowing />}
                        {selected === 'returned' && <MyBorrowsReturned />}
                        {selected === 'rejected' && <MyBorrowsRejected />}
                        {selected === 'history' && <MyBorrowsHistory />}
                        {selected === 'cancelled' && <MyBorrowsCancelled />}
                        {selected === 'overdue' && <MyBorrowsOverdue />}
                    </div>
                </div>
            </div>
        </div>
    )
}
