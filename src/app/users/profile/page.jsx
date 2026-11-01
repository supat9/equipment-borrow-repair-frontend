'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { AiFillInfoCircle } from "react-icons/ai";
import { GeneralInfo, EducationInfo } from '@/components/users/profile/Profile';
import axios from 'axios';
import Cookies from 'js-cookie';
import Header from '@/components/users/layout/Header';

export default function page() {
  const [selected, setSelected] = useState('general');
  const menuManage = [
    { name: "ข้อมูลทั่วไป", value: "general" },
    { name: "ข้อมูลการศึกษา", value: "education" },
  ];
  const [user, setUser] = useState(null);
  const fetchUserData = async () => {
    try {
      /* 1 */
      const response = await axios.get('/api/users/profile');
      /* 2 */
      // const token = Cookies.get('token');
      // const response = await axios.get('/api/users/profile', {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      setUser(response.data);
    } catch (error) {
      console.error("Fetch user error:", error);
    }
  }
  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div className='m-4 md:m-6' id="profile">
      <Header title='ประวัตินิสิตในระบบ' text='ดูข้อมูลส่วนตัวและประวัติ' />
      <div className='bg-white rounded-[5px] shadow-[0px_5px_15px_#00000014] p-6 mb-6'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-xl font-bold text-[#4E5155]'>โปรไฟล์นิสิต</h2>
          <AiFillInfoCircle className='cursor-pointer' color='#d7dbdd' size={25} />
        </div>
        {/* <div className='flex justify-between px-4 py-4 mb-8 shadow-[0px_5px_15px_#00000014] rounded-[5px] border border-[#E0E0E0]'>
          <div className='flex items-stretch'>
            <div className='border-r border-[#E0E0E0] pr-4 mr-4'>
              <div className='w-[120px] h-full relative'>
                <Image alt='student' fill className='object-cover shadow-[0px_2px_5px_#00000014] rounded-[3px] ' src={'/myku/images/student.jpeg'}></Image>
              </div>
            </div>
            <div className='text-[#4E5155] text-[15px]'>
              <p className='text-[18px] font-bold'>{mockUser.student_id}</p>
              <div className='flex items-center gap-x-1 text-[18px] font-bold'>
                <p>{mockUser.prefix}</p>
                <p>{mockUser.first_name}</p>
                <p>{mockUser.last_name}</p>
              </div>
              <div className='mb-2 text-[#868686]'>
                <p>คณะ {mockUser.faculty} (Q)</p>
                <p>สาขา {mockUser.major} (Q05)</p>
              </div>
              <div className='flex items-center gap-x-3'>
                <p className='bg-[#32CEB0] cursor-default text-white text-[13px] rounded-2xl px-2.5 py-1 hover:bg-[#03a96b] w-fit'>นิสิตปัจจุบัน</p>
                <p className='bg-[#8690FA] cursor-default text-white text-[13px] rounded-2xl px-2.5 py-1 hover:bg-[#5B6ED6] w-fit'>ภาคปกติ</p>
              </div>
            </div>
          </div>
          <div>
            <div className='flex items-center gap-x-2 bg-[#DCFCE7] w-fit rounded-[5px] px-3 py-1 border border-[#22C55E]'>
              <div className='size-[7px] rounded-[50%] bg-[#16A34A]'></div>
              <span className='cursor-default text-[#15803D] text-[13px]'>กำลังใช้งาน</span>
            </div>
          </div>
        </div> */}
        <div>
          <div className='flex items-center gap-x-4 border-b border-[#E0E0E0] pb-4 mb-6'>
            {menuManage.map((value, index) => {
              return (
                <div key={index}>
                  <button className={`text-sm sm:text-base cursor-pointer px-4 py-1.5 duration-300 ${selected === value.value ? 'bg-[#28c3d7] text-white rounded-[3px] shadow-[0px_0px_10px_#00000014]' : 'text-[#868686] rounded-[3px] hover:bg-[#C7F3F7]'}`} onClick={() => setSelected(value.value)}>{value.name}</button>
                </div>
              );
            })}
          </div>
          <div>
            {selected === 'general' && <GeneralInfo data={user} />}
            {selected === 'education' && <EducationInfo data={user} />}
          </div>
        </div>
      </div>
    </div>
  )
}
