'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { ManageUsers } from '@/components/admin/manage-users/ManageUsers';
import Header from '@/components/admin/layout/Header';

export default function page() {
    return (
        <div id="manage-users-admin" className='m-6'>
            <Header title='จัดการรายชื่อผู้ใช้ในระบบ' text='ดูและจัดการรายชื่อผู้ใช้ในระบบ' />
            <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8 '>
                <div className='flex justify-between items-center mb-6 pb-6 border-b border-[#E0E0E0]'>
                    <h2 className='text-[18px] font-bold text-[#4E5155]'>จัดการรายชื่อผู้ใช้และบทบาท</h2>
                    <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                </div>
                <ManageUsers />
            </div>
        </div>
    )
}
