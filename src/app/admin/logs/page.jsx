'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'; // เพิ่ม import axios
import { AiFillInfoCircle } from "react-icons/ai";
import Header from '@/components/admin/layout/Header';
import { ActivityLogs } from '@/components/admin/logs/ActivityLogs';

export default function page() {
    return (
        <div className='m-6' id="department">
            <Header title='ประวัติการใช้งาน' text='ดูและจัดการข้อมูลกิจกรรมในระบบ' />
            <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8'>
                <div className='flex justify-between items-center mb-6 pb-6 border-b border-[#E0E0E0]'>
                    <h2 className='text-[18px] font-bold text-[#4E5155]'>รายละเอียดกิจกรรม</h2>
                    <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                </div>
                <div>
                    <ActivityLogs />
                </div>
            </div>
        </div>
    )
}
