'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { mockCategories } from '@/mock/mockEquipment';
import { Equipment } from '@/components/users/equipment/Equipment';
import Select from 'react-select';
import axios from 'axios';
import Header from '@/components/users/layout/Header';

export default function page() {
    // const optionStatus = [
    //     { value: 'available', label: 'ว่าง' },
    //     { value: 'in_use', label: 'กำลังใช้งาน' },
    //     { value: 'maintenance', label: 'ซ่อมบำรุง' },
    //     { value: 'damaged', label: 'ชำรุด' }
    // ];
    // const optionCategories = mockCategories.map(category => ({
    //     value: category.category_id,
    //     label: category.category_name
    // }));

    return (
        <div className='m-6' id="user-equipment">
            <Header title='อุปกรณ์ครุภัณฑ์ในระบบ' text='ค้นหาและยืมอุปกรณ์ครุภัณฑ์' />
            <div>
                <Equipment />
            </div>
        </div>
    )
}
