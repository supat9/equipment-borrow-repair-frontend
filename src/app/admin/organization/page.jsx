'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'; // เพิ่ม import axios
import { Faculty } from '@/components/admin/organization/faculty/Faculty';
import { Major } from '@/components/admin/organization/major/Major';
import { AiFillInfoCircle } from "react-icons/ai";
import Header from '@/components/admin/layout/Header';
import { DataLoading } from '@/components/users/loading/LoadingOverlay';

// เอา async ออกจาก function declaration
export default function page() {
    const [majorData, setMajorData] = useState(null);
    const [facultyData, setFacultyData] = useState(null);
    const [selected, setSelected] = useState('faculty');
    const menuManage = [
        { name: "คณะ", value: "faculty" },
        { name: "สาขา", value: "major" },
    ];

    const fetchMajorData = async () => {
        try {
            const response = await axios.get('/api/admin/major');
            setMajorData(response.data);
        } catch (error) {
            console.error("Error fetching major data:", error);
        }
    };

    const fetchFacultyData = async () => {
        try {
            const response = await axios.get('/api/admin/faculty');
            setFacultyData(response.data);
        } catch (error) {
            console.error("Error fetching faculty data:", error);
        }
    };

    // fetch faculty list once on mount so Major Add form can use it
    useEffect(() => {
        fetchFacultyData();
    }, []);

    useEffect(() => {
        if (selected === 'major') {
            setMajorData(null);
            fetchMajorData();
        } else if (selected === 'faculty') {
            setMajorData(null);
            fetchFacultyData();
        }
    }, [selected]);

    return (
        <div className='m-6' id="department">
            <Header title='จัดการข้อมูลคณะและสาขา' text='ดูและจัดการข้อมูลคณะและสาขาในระบบ' />
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
                        {selected === 'faculty' && (
                            <div>
                                {!facultyData ? (
                                    <DataLoading />
                                ) : (
                                    <Faculty facultyData={facultyData} onRefresh={fetchFacultyData} />
                                )}
                            </div>
                        )}
                        {selected === 'major' && (
                            <div>
                                {!majorData ? (
                                    <DataLoading />
                                ) : (
                                    <Major majorData={majorData} onRefresh={fetchMajorData} facultyData={facultyData} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}