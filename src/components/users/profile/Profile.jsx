'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import Image from 'next/image';
import { mockUser } from '@/mock/mockUser';
import Spinner from '@/components/users/loading/Spinner.jsx';

export function GeneralInfo({ data }) {
    return (
        <div id="user-gerenal-info-components">
            <div className=''>
                <div className='mb-4'>
                    <h2 className='text-[18px] font-bold text-gray-600'>ข้อมูลทั่วไป</h2>
                </div>
                {data === undefined || !data ? (
                    <div className='h-[180px] flex justify-center items-center'>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <Spinner />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                        </div>
                    </div>
                ) : (<div className='flex flex-col gap-y-2'>
                    <p className='text-gray-700 text-sm sm:text-base tracking-[.5px]'><span className='text-gray-500'>รหัสนิสิต</span> : {data?.student_id || '-'}</p>
                    <p className='text-gray-700 text-sm sm:text-base tracking-[.5px]'><span className='text-gray-500'>ชื่อ - นามสกุล</span> : {data?.first_name} {data?.last_name}</p>
                    {/* <p><span className='text-gray-500'>ชื่อ - นามสกุล (EN)</span> : {data?.eng_first_name || '-'} {data?.eng_last_name || '-'}</p> */}
                    <p className='text-gray-700 text-sm sm:text-base tracking-[.5px]'><span className='text-gray-500'>อีเมล</span> : {data?.email}</p>
                    <p className='text-gray-700 text-sm sm:text-base tracking-[.5px]'><span className='text-gray-500'>เบอร์โทรศัพท์</span> : {data?.phone}</p>

                </div>)}
            </div>
        </div>
    )
}

export function EducationInfo({ data }) {
    return (
        <div id="user-education-info-components">
            <div className=''>
                <div className='mb-4'>
                    <h2 className='text-[18px] font-bold text-gray-600'>ข้อมูลการศึกษา</h2>
                </div>
                {data === undefined || !data ? (
                    <div className='h-[180px] flex justify-center items-center'>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <Spinner />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                        </div>
                    </div>
                ) : (<div className='flex flex-col gap-y-2'>
                    <p className='text-gray-700 text-sm sm:text-base tracking-[.5px]'><span className='text-gray-500'>สถานะ</span> : {data?.role ? 'นิสิต' : '-'}</p>
                    <p className='text-gray-700 text-sm sm:text-base tracking-[.5px]'><span className='text-gray-500'>คณะ</span> : {data?.faculty_name || '-'}</p>
                    <p className='text-gray-700 text-sm sm:text-base tracking-[.5px]'><span className='text-gray-500'>สาขา</span> : {data?.major_name || '-'}</p>
                </div >)}
            </div >
        </div >
    )
}

export function SystemInfo() {
    return (
        <div id="user-system-info-components">

            <div className='text-[#4E5155] border-b border-[#E0E0E0] pb-6 mb-6'>
                <div className='mb-4'>
                    <h2 className='text-[18px] font-bold '>ข้อมูลในระบบ</h2>
                </div>
                <div className='flex flex-col gap-y-2'>
                    <p><span className='text-[#868686]'>ชื่อผู้ใช้</span> : {mockUser.username}</p>
                    <p><span className='text-[#868686]'>อีเมล</span> : {mockUser.email}</p>
                    <p><span className='text-[#868686]'>วันที่สร้างบัญชี</span> : {mockUser.created_at}</p>
                    <p><span className='text-[#868686]'>วันที่แก้ไขล่าสุด</span> : {mockUser.updated_at}</p>
                    <p><span className='text-[#868686]'>สร้างโดยเจ้าหน้าที่</span> : {mockUser.created_by}</p>
                    <p><span className='text-[#868686]'>แก้ไขโดยเจ้าหน้าที่ </span> : {mockUser.updated_by}</p>
                </div>
            </div>
        </div>
    )
}