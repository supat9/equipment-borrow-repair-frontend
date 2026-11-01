'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { PiFileCsvLight } from "react-icons/pi";
import { SlArrowRight } from "react-icons/sl";
import { mockStudents } from '@/mock/mockStudents';
import { FaSort } from 'react-icons/fa';
import { CiEdit } from "react-icons/ci";
import { PiTrashLight } from "react-icons/pi";
import Select from 'react-select';
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { mockFaculties } from '@/mock/mockFaculty';
import { useRouter } from 'next/navigation';
import { ManageStudents } from '@/components/staff/manage-students/ManageStudents';
import Header from '@/components/users/layout/Header';

export default function page() {
    return (
        <div className='m-6' id="manage-students">
            <Header title='จัดการรายชื่อนิสิตในระบบ' text='ดูและจัดการรายชื่อนิสิตในระบบ' />
            <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8'>
                <ManageStudents />
            </div>

        </div>
    )
}
