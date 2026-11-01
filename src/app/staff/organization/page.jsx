'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Faculty } from '@/components/staff/organization/faculty/Faculty';
import { Major } from '@/components/staff/organization/major/Major';
import { AiFillInfoCircle } from "react-icons/ai";


export default function page() {
    const [selected, setSelected] = useState('faculty');
    const menuManage = [
        { name: "คณะ", value: "faculty" },
        { name: "สาขา", value: "major" },
    ];
    return (
        <div className='m-6' id="department">
            <div className='tracking-[.5px] border-b border-[#E0E0E0] pb-6 mb-6'>
                <div><h1 className='text-[24px] font-bold text-[#4E5155]'>จัดการข้อมูลคณะและสาขา</h1></div>
                <div className='flex items-center gap-x-4'>
                    <p className='text-[#868686] text-[16px]'>ดูและจัดการคณะและสาขาในระบบ <span className='text-[#03a96b] ml-2'>วันจันทร์, 21 กรกฎาคม 2568</span></p>
                    <p className='bg-[#1BC688] cursor-default text-white text-[14px] rounded-2xl px-3 py-1 hover:bg-[#03a96b]'>ภาคต้น 2568</p>
                </div>
            </div>
            <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8'>
                <div className='flex justify-between items-center mb-8'>
                    <h2 className='text-[18px] font-bold text-[#4E5155]'>เลือกจัดการข้อมูลคณะหรือสาขา</h2>
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
                        {selected === 'faculty' && <Faculty />}
                        {selected === 'major' && <Major />}
                    </div>
                </div>
            </div>
        </div>
    )
}
