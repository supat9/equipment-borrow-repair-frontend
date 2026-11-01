'use client';
import React from 'react';
import { useState } from 'react';
import { BsTools } from "react-icons/bs";
import { MdInstallDesktop } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { RepairModal } from '@/components/users/request/Repair';
import { InstallModal } from '@/components/users/request/Install';
import { MdHomeRepairService } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { AiFillInfoCircle } from "react-icons/ai";
import Header from '@/components/users/layout/Header';
import { PiToolbox } from 'react-icons/pi';


export default function page() {
    const [repairModal, setRepairModal] = useState(false);
    const [installModal, setInstallModal] = useState(false);
    return (
        <div id="request" className='m-4 md:m-6'>
            <Header title='ติดต่อเจ้าหน้าที่' text='ติดต่อเจ้าหน้าที่ขอนัดหมายติดตั้งโปรแกรม' />
            <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 my-8'>
                <div className='mb-6'>
                    <h2 className='text-xl font-bold text-[#4E5155]'>แจ้งซ่อมครุภัณฑ์และนัดหมายเจ้าหน้าที่</h2>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='h-[350px] sm:h-[330px] group border border-gray-300 bg-gray-50 rounded-[5px] shadow-sm pt-4 pb-8 px-4 duration-300 hover:-translate-y-2'>
                        <div className='flex justify-end'>
                            <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                        </div>
                        <div className='flex flex-col justify-center items-center gap-y-6'>
                            <div className='duration-300 group-hover:scale-110 shadow-md bg-white p-4 rounded-full border-2 border-[#28c3d7] w-fit'>
                                <MdInstallDesktop color='#28c3d7' size={55} />
                            </div>
                            <div className='flex flex-col gap-y-2 justify-center items-center'>
                                <h2 className='text-[18px] text-gray-600 font-semibold tracking-[.5px]'>ขอติดตั้งโปรแกรม</h2>
                                <p className='text-[#868686] text-xs sm:text-sm'>สำหรับนัดหมายเจ้าหน้าที่เพื่อติดตั้งโปรแกรมที่จำเป็นสำหรับการทำงานหรือการเรียน</p>

                            </div>
                            <div>
                                <button
                                    onClick={() => setInstallModal(true)}
                                    className='cursor-pointer group/btn flex items-center gap-x-2 text-[#28c3d7] hover:text-[#20a8bb] bg-transparent hover:bg-[#28c3d7]/5 px-4 py-2 rounded-lg border-2 border-[#28c3d7]/20 hover:border-[#28c3d7]/40 transition-all duration-200 ease-out'
                                >
                                    <span className='text-[15px] font-medium'>ทำการนัดหมาย</span>
                                    <GoArrowRight size={20} className='group-hover/btn:translate-x-1 transition-transform duration-200' />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='h-[350px] sm:h-[330px] group border border-gray-300 bg-gray-50 rounded-[5px] shadow-sm pt-4 pb-8 px-4 duration-300 hover:-translate-y-2'>
                        <div className='flex justify-end'>
                            <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
                        </div>
                        <div className='flex flex-col justify-center items-center gap-y-6'>
                            <div className='duration-300 group-hover:scale-110 shadow-md bg-white p-4 rounded-full border-2 border-[#F59E42] w-fit'>
                                <PiToolbox color='#F59E42' size={55} />
                            </div>
                            <div className='flex flex-col gap-y-2 justify-center items-center'>
                                <h2 className='text-[18px] text-gray-600 font-semibold tracking-[.5px]'>แจ้งซ่อมครุภัณฑ์</h2>
                                <p className='text-[#868686] text-xs sm:text-sm'>สำหรับแจ้งปัญหาการใช้งานหรือการชำรุดของอุปกรณ์ที่มีในระบบ</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => setRepairModal(true)}
                                    className='cursor-pointer group/btn flex items-center gap-x-2 text-[#F59E42] hover:text-[#e8864a] bg-transparent hover:bg-[#F59E42]/5 px-4 py-2 rounded-lg border-2 border-[#F59E42]/20 hover:border-[#F59E42]/40 transition-all duration-200 ease-out'
                                >
                                    <span className='text-[15px] font-medium'>แจ้งซ่อมทันที</span>
                                    <GoArrowRight size={20} className='group-hover/btn:translate-x-1 transition-transform duration-200' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {repairModal && <RepairModal onClose={() => setRepairModal(false)} />}
            {installModal && <InstallModal onClose={() => setInstallModal(false)} />}
        </div>
    )
}



