'use client';
import React, { useState, useEffect } from 'react';

export default function Header({ title, text }) {
    function getThaiDateString(date = new Date()) {
        const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
        const months = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        const day = days[date.getDay()];
        const dayNum = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear() + 543;
        return `วัน${day}, ${dayNum} ${month} ${year}`;
    }
    return (
        <div id="user-header">
            <div className='tracking-[.5px] space-y-2 border-b border-[#E0E0E0] pb-6 mb-6'>
                <div><h1 className='text-xl md:text-2xl font-bold text-[#4E5155]'>{title}</h1></div>
                <div className='flex items-center '>
                    <p className='text-sm flex flex-col text-[#868686]
                     md:text-base md:flex-row md:items-center md:gap-x-2
                     '>{text}<span className='text-[#03a96b]'>{getThaiDateString()}</span></p>
                    {/* <p className='text-sm bg-[#1BC688] cursor-default text-white text-[14px] rounded-2xl px-3 py-1 hover:bg-[#03a96b]'>ภาคต้น {new Date().getFullYear() + 543}</p> */}
                </div>
            </div>
        </div>
    )
}