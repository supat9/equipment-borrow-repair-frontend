'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { BorrowRequest, BorrowingRequest, BorrowReturn, BorrowReject, BorrowHistory, BorrowApproved, BorrowOverdue, BorrowCancelled } from '@/components/staff/borrow-return/BorrowReturn';
import Header from '@/components/staff/layout/Header';

export default function page() {
    const [selected, setSelected] = useState('borrow');
    const menuManage = [
        { name: "รออนุมัติ", value: "borrow" },
        { name: "อนุมัติแล้ว", value: "approved" },
        { name: "กำลังยืม", value: "borrowing" },
        { name: "เกินกำหนดคืน", value: "overdue" },
        { name: "คืนแล้ว", value: "returned" },
        { name: "ไม่อนุมัติ", value: "rejected" },
        { name: "ยกเลิก", value: "cancelled" },
        { name: "รายการทั้งหมด", value: "history" },
    ];
    return (
        <div className='m-6' id="borrow-return">
            <Header title='จัดการคำขอยืมครุภัณฑ์' text='ดูและจัดการคำขอยืมอุปกรณ์ในระบบ' />
            <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8'>
                <div className='flex justify-between items-center mb-8'>
                    <h2 className='text-[18px] font-bold text-[#4E5155]'>จัดการรายการคำขอ</h2>
                    <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                </div>
                <div>
                    <div className='flex items-center gap-x-4 border-b border-[#E0E0E0] pb-4 mb-6'>
                        {menuManage.map((value, index) => {
                            return (
                                <div key={index}>
                                    <button className={`text-[16px] cursor-pointer px-4 py-1.5 duration-300 ${selected === value.value ? 'bg-[#28c3d7] text-white rounded-[3px] shadow-[0px_0px_10px_#00000014]' : 'text-[#868686] rounded-[3px] hover:bg-[#C7F3F7]'}`} onClick={() => setSelected(value.value)}>{value.name}</button>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        {selected === 'borrow' && <BorrowRequest />}
                        {selected === 'borrowing' && <BorrowingRequest />}
                        {selected === 'returned' && <BorrowReturn />}
                        {selected === 'rejected' && <BorrowReject />}
                        {selected === 'history' && <BorrowHistory />}
                        {selected === 'approved' && <BorrowApproved />}
                        {selected === 'overdue' && <BorrowOverdue />}
                        {selected === 'cancelled' && <BorrowCancelled />}
                    </div>
                </div>
            </div>
        </div>
    )
}
