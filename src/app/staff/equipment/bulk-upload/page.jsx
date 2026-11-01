'use client';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { PiFileCsvLight } from "react-icons/pi";
import { SlArrowRight } from "react-icons/sl";
import { FaSort } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';
import Header from '@/components/staff/layout/Header';
import { SubmitLoading, DataLoading } from '@/components/users/loading/LoadingOverlay';
import Papa from 'papaparse';


export default function page() {
  const [currentStep, setCurrentStep] = useState(1); // 1 = upload, 2 = preview
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [csvHeader, setCsvHeader] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/staff/equipment-category');
      const options = response.data.map(cat => ({
        value: cat.id,
        label: cat.categoryName
      }));
      setCategoryOptions(options);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const parseCsv = (text) => {
    const result = Papa.parse(text, { skipEmptyLines: true });
    // result.data เป็น array ของ row
    // result.data[0] คือ header (ถ้าใช้ header จากไฟล์)
    // คุณใช้ header เองอยู่แล้ว
    const header = ['กลุ่มสินทรัพย์ถาวร', 'หมายเลขสินทรัพย์ถาวร', 'ชื่อ', 'ต้นทุนต่อหน่วย', 'วันที่ซื้อสินทรัพย์', 'สถานที่เก็บ', 'สภาพของสินทรัพย์'];
    return { header, rows: result.data.slice(1) }; // ข้าม header
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
    if (!selectedCategory) {
      Swal.fire({
        icon: 'warning',
        title: 'ไม่สามารถดำเนินการได้',
        text: 'กรุณาเลือกหมวดหมู่ก่อนดำเนินการต่อ',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#03a96b',
      });
      return;
    }
    setCurrentStep(2);
  };

  const showAlertByStatus = async (status, message) => {
    let icon = "error";
    let color = "#d33";
    let text = message || "เกิดข้อผิดพลาด";
    if (status === 400) {
      icon = "warning";
      color = "#FFC107"; // yellow
      text = message || "กรุณากรอกข้อมูลให้ครบถ้วน";
    } else if (status === 404) {
      icon = "warning";
      color = "#FFC107"; // yellow
      text = message || "ไม่พบข้อมูลที่ต้องการ";
    } else if (status === 500) {
      icon = "error";
      color = "#d33"; // red
      text = message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
    }

    await Swal.fire({
      title: "ไม่สามารถเพิ่มครุภัณฑ์ได้",
      text,
      icon,
      confirmButtonText: "ตกลง",
      confirmButtonColor: color,
    });
  };
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category_id', selectedCategory ? selectedCategory.value : '');
      const confirmed = await Swal.fire({
        title: 'ยืนยันการเพิ่มครุภัณฑ์',
        text: `การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
        icon: 'warning',
        confirmButtonText: 'ยืนยัน',
        confirmButtonColor: '#d9534f',
        showCancelButton: true,
        cancelButtonColor: '#6B7280',
        cancelButtonText: 'ยกเลิก',
        customClass: {
          container: 'z-[10000]'
        }
      });
      if (!confirmed.isConfirmed) return;
      setSubmitLoading(true);
      const response = await axios.post('/api/staff/equipment/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const result = response.data;
      setSubmitLoading(false);
      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: result?.message || `ระบบจะพาท่านไปยังหน้าจัดการครุภัณฑ์`,
        confirmButtonText: 'ตกลง',
      });
      router.push('/staff/equipment');
    } catch (error) {
      console.error('Error uploading file:', error.response?.data?.message || error.message);
      await showAlertByStatus(error.response?.status, error.response?.data?.message);
    } finally {
      setSubmitLoading(false);
    }
  }
  return (
    <div className='m-6' id="add-bulk-equipment">
      <Header title='จัดการข้อมูลครุภัณฑ์ในระบบ' text='ดูและจัดการครุภัณฑ์และหมวดหมู่ในระบบ' />
      <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-[18px] font-bold text-[#4E5155]'>จัดการข้อมูลครุภัณฑ์</h2>
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
                <h2 className='text-[18px] font-bold text-[#4E5155] mb-2'>2. เลือกหมวดหมู่</h2>
              </div>
              <div className='flex flex-col gap-y-6'>
                <div className='flex items-center justify-end gap-x-4'>
                  <div className='flex items-center gap-x-2 mb-4'>
                    <label htmlFor="category">หมวดหมู่</label>
                    <Select
                      className='w-[250px]'
                      inputId="category"
                      name="category"
                      options={categoryOptions}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      placeholder="เลือกหมวดหมู่"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: '40px',
                          height: '40px',
                          borderRadius: '5px',
                          borderColor: state.isFocused ? '#1BC688' : '#D1D5DB',
                          boxShadow: state.isFocused ? '0 0 0 1.5px #1BC688' : 'none',
                          fontSize: '15px',
                          color: '#4E5155',
                          transition: 'border-color 0.2s',
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#868686',
                        }),
                      }}
                    />
                  </div>
                </div>
                <div
                  className={`flex flex-col items-center justify-center border-3 border-dashed rounded-[5px] h-[250px] shadow-[0px_5px_15px_#00000014] cursor-pointer transition-colors ${selectedFile
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
                <div className='flex justify-end gap-x-4'>
                  <button onClick={() => router.push('/staff/equipment')} type='button' className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>กลับ</button>
                  <button onClick={handleNext} className='cursor-pointer flex items-center gap-x-2 bg-[#1BC688] text-white rounded-[5px] px-4 py-2 hover:bg-[#03a96b]'>ตรวจสอบข้อมูล <SlArrowRight color='white' size={15} /></button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Step 2: Preview Data
          <div>
            <div className=''>
              <h2 className='text-[18px] font-bold text-[#4E5155] mb-2'>3. ตรวจสอบและยืนยันข้อมูลครุภัณฑ์</h2>
              <p className='tracking-[.5px] text-[#4E5155] mb-6'>ระบบได้สร้าง Username อัติโนมัติ กรุณาตรวจสอบความถูกต้องของข้อมูลทั้งหมดก่อนทำการบันทึก</p>
              <div className='flex flex-col gap-y-6'>
                <div className='mb-4'>
                  <h3 className='text-[16px] font-semibold mb-2 text-[#4E5155]'>ข้อมูลที่เลือก:</h3>
                  <p className='text-[#4E5155]'>ไฟล์: {selectedFile?.name}</p>
                  <p className='text-[#4E5155]'>หมวดหมู่: {selectedCategory?.label}</p>
                  <p className='text-[#4E5155]'>จำนวนข้อมูล: {csvPreview.length} แถว</p>
                </div>

                {/* CSV Preview Table */}
                {csvPreview.length > 0 && (
                  <div>
                    <h3 className='text-[16px] font-semibold mb-2 text-[#4E5155]'>ข้อมูลครุภัณฑ์ที่จะเพิ่มเข้าระบบ</h3>
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

                <div className='flex justify-end items-center gap-x-4'>
                  <button onClick={() => setCurrentStep(1)} type='button' className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ยกเลิก</button>
                  <button onClick={handleSubmit} className='cursor-pointer bg-[#1BC688] text-white rounded-[5px] px-4 py-2 hover:bg-[#03a96b]'>ยืนยันและเพิ่มครุภัณฑ์</button>
                </div>
              </div>
            </div>
            {submitLoading && <SubmitLoading />}
          </div>
        )}
      </div>
    </div>
  )
}
