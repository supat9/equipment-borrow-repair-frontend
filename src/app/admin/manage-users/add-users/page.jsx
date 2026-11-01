'use client';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { PiFileCsvLight } from "react-icons/pi";
import { SlArrowRight } from "react-icons/sl";
import { mockStudents } from '@/mock/mockStudents';
import { FaSort } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';
import Header from '@/components/admin/layout/Header';

export default function page() {
    const [toggle, setToggle] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 1 = upload, 2 = preview
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState(null);
    const [facultyOptions, setFacultyOptions] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [majorOptions, setMajorOptions] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState(null);
    const [csvPreview, setCsvPreview] = useState([]);
    const [csvHeader, setCsvHeader] = useState([]);

    const parseCsv = (text) => {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length === 0) return { header: [], rows: [] };
        // กำหนด header เอง แทนการใช้แถวแรกของไฟล์
        const header = ['รหัสนิสิต', 'คำนำหน้า', 'ชื่อ', 'นามสกุล', 'อีเมล', 'เบอร์โทร'];
        const rows = lines.map(line => line.split(',')); // ใช้ทุกแถวรวมแถวแรก
        return { header, rows };
    };

    const handleCsvPreview = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const { header, rows } = parseCsv(text);
            setCsvHeader(header);
            setCsvPreview(rows);
        };
        reader.readAsText(file, 'utf-8');
    };

    // ...existing code...
    const fetchFaculties = useCallback(async () => {
        try {
            const response = await axios.get('/api/staff/faculty');
            const options = response.data.map((faculty) => ({
                value: faculty.id,
                label: faculty.faculty_name
            }));
            setFacultyOptions(options);
        } catch (error) {
            console.error("Error fetching faculties:", error);
        }
    }, []);

    const fetchMajorByFacultyId = useCallback(async (facultyId) => {
        try {
            const response = await axios.get(`/api/staff/major/${encodeURIComponent(facultyId)}`);
            const options = response.data.map((major) => ({
                value: major.id,
                label: major.major_name
            }));
            setMajorOptions(options);
        } catch (error) {
            console.error("Fetch major list by faculty error:", error);
        }
    }, []);

    useEffect(() => {
        if (selectedFaculty?.value) {
            setMajorOptions([]);
            setSelectedMajor(null);
            fetchMajorByFacultyId(selectedFaculty.value);
        } else {
            setMajorOptions([]);
            setSelectedMajor(null);
        }
    }, [selectedFaculty]);
    useEffect(() => {
        fetchFaculties();
    }, [fetchFaculties]);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            setSelectedFile(file);
            handleCsvPreview(file);
        } else {
            alert('กรุณาเลือกไฟล์ CSV เท่านั้น');
        }
    };


    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type === 'text/csv') {
            setSelectedFile(file);
            handleCsvPreview(file);
        } else {
            alert('กรุณาเลือกไฟล์ CSV เท่านั้น');
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };
    const handleNext = () => {
        if (!selectedFile) {
            Swal.fire({
                icon: 'warning',
                title: 'ไม่สามารถดำเนินการได้',
                text: 'กรุณาเลือกไฟล์ CSV ก่อนดำเนินการต่อ',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#03a96b',
            });
            return;
        }
        if (!selectedFaculty || !selectedMajor) {
            Swal.fire({
                icon: 'warning',
                title: 'ไม่สามารถดำเนินการได้',
                text: 'กรุณาเลือกคณะและสาขาก่อนดำเนินการต่อ',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#03a96b',
            });
            return;
        }
        setCurrentStep(2);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('csvFile', selectedFile);
            formData.append('faculty_id', selectedFaculty.value);
            formData.append('major_id', selectedMajor.value);
            const result = await Swal.fire({
                title: 'ยืนยันการเพิ่มผู้ใช้',
                text: `คุณต้องการเพิ่มผู้ใช้หรือไม่?`,
                icon: 'warning',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#d9534f',
                showCancelButton: true,
                cancelButtonColor: '#6B7280',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    container: 'z-[10000]'
                }
            });
            if (!result.isConfirmed) return;
            const response = await axios.post('/api/admin/manage-users/bulk-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            await Swal.fire({
                icon: 'success',
                title: 'อัปโหลดรายการสำเร็จ',
                text: `ระบบจะพาท่านไปยังหน้าจัดการรายชื่อนิสิต`,
            });
            router.push('/admin/manage-users');
        } catch (error) {
            console.error('Error uploading file:', error);
            await Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถเพิ่มผู้ใช้ได้ โปรดลองอีกครั้ง",
                confirmButtonColor: "#1BC688",
            });
        }
    }
    return (
        <div className='m-6' id="add-students">
            <Header title='จัดการรายชื่อนิสิต' text='ดูและจัดการรายชื่อนิสิตในระบบ' />
            <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8'>
                <div className='flex justify-between items-center mb-8'>
                    <h2 className='text-[18px] font-bold text-[#4E5155]'>จัดการข้อมูลนิสิต</h2>
                    <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                </div>
                
                {currentStep === 1 ? (
                    // Step 1: Upload File
                    <div>
                        <div className=''>
                            <div>
                                <h2 className='text-[18px] font-bold text-[#4E5155] mb-2'>1. อัปโหลดไฟล์ CSV</h2>
                                <ul className='tracking-[.5px] list-disc list-inside text-[#4E5155] mb-6'>
                                    <li>
                                        ไฟล์ต้องเป็นนามสกุล .csv และเข้ารหัสแบบ UTF-8
                                    </li>
                                    <li>
                                        แถวแรกสุด (Header) จะถูกละเว้นจากการอัปโหลด
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className='text-[18px] font-bold text-[#4E5155] mb-2'>2. เลือกคณะและสาขา</h2>
                            </div>
                            <div className='flex flex-col gap-y-6'>
                                <div className='flex items-center justify-end gap-x-4'>
                                    <div className='flex items-center gap-x-2 mb-4'>
                                        <label htmlFor="equipmentName">คณะ</label>
                                        <Select
                                            className='w-[250px]'
                                            inputId="faculty"
                                            name="faculty"
                                            options={facultyOptions}
                                            value={selectedFaculty}
                                            onChange={setSelectedFaculty}
                                        />
                                    </div>
                                    <div className='flex items-center gap-x-2 mb-4'>
                                        <label htmlFor="equipmentId">สาขา</label>
                                        <Select
                                            className='w-[250px]'
                                            inputId="major"
                                            name="major"
                                            options={majorOptions}
                                            value={selectedMajor}
                                            onChange={setSelectedMajor}
                                            isDisabled={!selectedFaculty}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={`flex flex-col items-center justify-center border-3 border-dashed rounded-[5px] h-[250px] shadow-[0px_5px_15px_#00000014] cursor-pointer transition-colors ${
                                        selectedFile 
                                            ? 'border-[#1BC688] bg-[#f0fdf4]' 
                                            : 'border-[#E0E0E0] hover:border-[#1BC688]'
                                    }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => document.getElementById('fileInput').click()}
                                >
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    {selectedFile ? (
                                        <>
                                            <PiFileCsvLight size={100} color='#1BC688' />
                                            <div>
                                                <p className='text-[#1BC688] text-[18px] mb-2 font-semibold'>
                                                    ไฟล์ที่เลือก
                                                </p>
                                                <p className='text-[#4E5155] text-[16px] text-center font-medium'>
                                                    {selectedFile.name}
                                                </p>
                                                <p className='text-[#868686] text-[14px] text-center mt-1'>
                                                    คลิกเพื่อเปลี่ยนไฟล์
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <PiFileCsvLight size={100} color='#E0E0E0' />
                                            <div>
                                                <p className='text-[#4E5155] text-[18px] mb-2'>
                                                    <span className='cursor-pointer text-blue-600'>เลือกไฟล์</span> หรือลากไฟล์มาวาง
                                                </p>
                                                <p className='text-[#868686] text-[14px] text-center'>
                                                    ยังไม่ได้เลือกไฟล์
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className='flex justify-end '>
                                    <button onClick={handleNext} className='cursor-pointer flex items-center gap-x-2 bg-[#1BC688] text-white rounded-[5px] px-4 py-2 hover:bg-[#03a96b]'>ตรวจสอบข้อมูล <SlArrowRight color='white' size={15} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Step 2: Preview Data
                    <div>
                        <div className=''>
                            <h2 className='text-[18px] font-bold text-[#4E5155] mb-2'>3. ตรวจสอบและยืนยันข้อมูลนิสิต</h2>
                            <p className='tracking-[.5px] text-[#4E5155] mb-6'>ระบบได้สร้าง Username อัติโนมัติ กรุณาตรวจสอบความถูกต้องของข้อมูลทั้งหมดก่อนทำการบันทึก</p>
                            <div className='flex flex-col gap-y-6'>
                                <div className='mb-4'>
                                    <h3 className='text-[16px] font-semibold mb-2 text-[#4E5155]'>ข้อมูลที่เลือก:</h3>
                                    <p className='text-[#4E5155]'>ไฟล์: {selectedFile?.name}</p>
                                    <p className='text-[#4E5155]'>คณะ: {selectedFaculty?.label}</p>
                                    <p className='text-[#4E5155]'>สาขา: {selectedMajor?.label}</p>
                                    <p className='text-[#4E5155]'>จำนวนข้อมูล: {csvPreview.length} แถว</p>
                                </div>
                                
                                {/* CSV Preview Table */}
                                {csvPreview.length > 0 && (
                                    <div>
                                        <h3 className='text-[16px] font-semibold mb-2 text-[#4E5155]'>ข้อมูลนิสิตที่จะเพิ่มเข้าระบบ</h3>
                                        <div className='overflow-x-auto max-h-[400px] border border-[#E0E0E0] rounded'>
                                            <table className='w-full tracking-[.5px] text-left border-collapse'>
                                                <thead className='bg-slate-50 border border-gray-300 sticky top-0'>
                                                    <tr className='text-sm text-gray-700'>
                                                        {csvHeader.map((col, idx) => (
                                                            <th key={idx} className='font-light text-[#606060] px-4 py-3 border-b'>{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {csvPreview.map((row, i) => (
                                                        <tr key={i} className='border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50'>
                                                            {row.map((cell, j) => (
                                                                <td key={j} className='p-4'>{cell}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                                
                                <div className='flex justify-between items-center gap-x-4'>
                                    <button onClick={() => setCurrentStep(1)} className='cursor-pointer rounded-[5px] px-5 py-2 bg-[#e5e7e9] text-[#454545] duration-200 hover:bg-[#cacfd2]'>กลับ</button>
                                    <button onClick={handleSubmit} className='cursor-pointer bg-[#1BC688] text-white rounded-[5px] px-4 py-2 hover:bg-[#03a96b]'>ยืนยันและเพิ่มนิสิต</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

