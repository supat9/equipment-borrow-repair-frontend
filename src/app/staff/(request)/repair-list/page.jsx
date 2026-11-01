'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { RequestRepair, RequestMaintenance, RequestInspection, RequestReplacement, RequestAll, RequestCompleted } from '@/components/staff/request/repair/RequestRepair';
import Header from '@/components/users/layout/Header';

export default function page() {
    const [selected, setSelected] = useState('inspection');
    const menuManage = [
        { name: "ตรวจสอบ", value: "inspection" },
        { name: "ซ่อมแซม", value: "repair" },
        { name: "บำรุงรักษา", value: "maintenance" },
        { name: "เปลี่ยนใหม่", value: "replacement" },
        {name: "รายการเสร็จสิ้น", value: "completed" },
        { name: "รายการทั้งหมด", value: "all" },
    ];
    return (
        <div id="repair" className='m-6'>
            <Header title='จัดการคำขอรายการแจ้งซ่อม' text='ดูและจัดการคำขอรายการแจ้งซ่อมในระบบ' />
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
                        {selected === 'repair' && <RequestRepair />}
                        {selected === 'maintenance' && <RequestMaintenance />}
                        {selected === 'inspection' && <RequestInspection />}
                        {selected === 'replacement' && <RequestReplacement />}
                        {selected === 'completed' && <RequestCompleted />}
                        {selected === 'all' && <RequestAll />}
                    </div>
                </div>
            </div>

        </div>
    )
}
