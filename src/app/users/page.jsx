'use client';
import React from 'react';
import { useState } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { BsCardText } from "react-icons/bs";
import { FaLayerGroup } from "react-icons/fa6";
import { GoClock } from "react-icons/go";
import Header from '@/components/users/layout/Header';

export default function page() {
    const [selected, setSelected] = useState('ทั่วไป');
    const menuManage = [
        { name: "ทั่วไป", value: 'ทั่วไป' },
        { name: "รายวิชา", value: 'รายวิชา' }
    ];
    const numberLoop = 1;
    return (
        <div className='m-4 md:m-6' id="user-page">
            <Header title='ยินดีต้อนรับเข้าสู่ระบบยืมคืนครุภัณฑ์' text='สามารถยืมครุภัณฑ์และติดตามข่าวสาร' />
            <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8'>
                <div className='flex justify-between items-center mb-8'>
                    <h2 className='text-xl font-bold text-[#4E5155]'>ข่าวสารต่างๆ</h2>
                    <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                </div>
                <div>
                    <div className='flex items-center gap-x-4 border-b border-[#E0E0E0] pb-4 mb-6'>
                        {menuManage.map((value, index) => {
                            return (
                                <div key={index}>
                                    <button className={`text-sm sm:text-base cursor-pointer px-4 py-1.5 duration-300 ${selected === value.value ? 'bg-[#28c3d7] text-white rounded-[3px] shadow-[0px_0px_10px_#00000014]' : 'text-[#868686] rounded-[3px] hover:bg-[#C7F3F7]'}`} onClick={() => setSelected(value.value)}>{value.name}</button>
                                </div>
                            );
                        })}
                    </div>
                    <div className=''>
                        <div className='border border-[#E0E0E0] bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014]'>
                            <div className='p-4 flex items-center gap-x-4 border-b border-[#E0E0E0] pb-4 mb-6'>
                                <div className='p-3 bg-[#E0F7FA] rounded-full flex items-center justify-center'>
                                    <BsCardText color='#03a96b' size={25} />
                                </div>
                                <h2 className='text-[18px] font-bold text-[#4E5155]'>ประกาศทั่วไป</h2>
                            </div>
                            <div className='px-6 pb-6'>
                                {Array.from({ length: numberLoop }).map((_, index) => (
                                    <div key={index} className='p-6 mb-6 bg-[#f5faf4] rounded-[5px]'>
                                        <div className='space-y-8'>
                                            <div className='space-y-2'>
                                                <h2 className='text-[16px] font-bold text-[#4E5155]'>ตารางสอบกลางภาค ประจำภาคต้น ปีการศึกษา 2568</h2>
                                                <div className='flex items-center gap-x-2'>
                                                    <GoClock color='#868686' size={20} />
                                                    <p className='text-[15px] text-[#868686]'>ประกาศเมื่อ วันศุกร์, 25 กรกฎาคม 2568 เวลา 09:38 น.</p>
                                                </div>
                                            </div>
                                            <div className='space-y-2'>
                                                <p className='text-[15px] text-[#868686]'>📣📣 การสอบกลางภาค ประจำภาคต้น ปีการศึกษา 2568 วันที่ 9-17 สิงหาคม 2568</p>
                                                <p className='text-[15px] text-[#868686]' >👉 ขอให้นิสิตตรวจสอบวัน เวลา และห้องสอบ ได้ที่เว็บไซต์สำนักบริหารการศึกษา คลิก <span className='text-blue-600'>https://registrar.ku.ac.th/exam</span></p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* {selected === 'borrow' && <MyBorrowsRequest />}
                        {selected === 'approved' && <MyBorrowsApproved />} */}
                    </div>
                </div>
            </div>
        </div>
    )
}
