'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoMdArrowDropdown } from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai";
import { BsClock } from "react-icons/bs";
import Link from 'next/link';
import { IoIosArrowBack } from "react-icons/io";
import { TfiLock } from "react-icons/tfi";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Spinner from '@/components/users/loading/Spinner';
import { SubmitLoading } from '@/components/users/loading/LoadingOverlay';
import { IoIosEye } from "react-icons/io";
import { PiEyeClosed } from "react-icons/pi";

export default function page() {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const handleOptSuccess = (email) => {
    setEmail(email);
    setStep('reset');
  };
  const handleBackToRequest = () => {
    setStep('request');
    setEmail('');
  }
  return (
    <div id="forgot-password">
      <ToastContainer />
      <div className='h-screen'>
        <div className='relative lg:grid grid-cols-[2fr_1fr] h-full'>
          <div className='relative w-full h-full'>
            <Image fill className='object-cover shadow-[5px_0px_20px_#868686]' priority src="/myku/images/bg-login5.avif" alt="Login Image" />
          </div>
          <div className='p-8 flex flex-col justify-center
            absolute top-0 right-0 h-full w-full
            sm:h-fit sm:w-2/3 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-md
            lg:static lg:translate-x-0 lg:translate-y-0 lg:w-full lg:h-full lg:rounded-none
            z-10 bg-white/90'>
            {/* <div className='flex justify-end mb-6'>
              <p className=' tracking-[1px] flex items-center gap-x-1 px-4 py-2 border border-[#E0E0E0] rounded-[3px] shadow-[2px_2px_10px_#00000014]'><span>TH</span> <IoMdArrowDropdown color='#868686' size={20} /></p>
            </div> */}
            <div className='flex flex-col items-center gap-y-4 mb-6'>
              <Image src="/myku/images/KU_Logo_PNG.png" alt="Logo" width={120} height={120} className='' />
              <h1 className='text-base tracking-[1px] lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-[#006C68]'>รีเซ็ตรหัสผ่าน</h1>
            </div>
            {step === 'request' ? (
              <OtpForm onSuccess={handleOptSuccess} setLoading={setLoading} />
            ) : (
              <ResetPasswordForm setLoading={setLoading} email={email} onBack={handleBackToRequest} />
            )}
            <div>
              <Link href="/login" className='w-fit flex items-center gap-x-1 tracking-[.5px] text-[14px] text-[#1E70CD]'>
                <IoIosArrowBack size={20} />
                <span>กลับไปหน้าเข้าสู่ระบบ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {loading && <SubmitLoading />}
    </div>
  )
}

export function OtpForm({ onSuccess, setLoading }) {

  const showAuthAlert = async (status, serverText) => {
    let icon = "error";
    let title = "ไม่สามารถส่งรหัส OTP ได้";
    let text = serverText || "กรุณาลองใหม่อีกครั้ง";
    if (status === 400) {
      // กรอกไม่ครบ/รูปแบบไม่ถูกต้อง
      icon = "warning";
      text = serverText || "กรุณากรอกอีเมลให้ถูกต้อง";
    } else if (status === 500) {
      // เซิร์ฟเวอร์พัง
      icon = "error";
      text = serverText || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
    }
    await Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: "ตกลง",
      confirmButtonColor: icon === "warning" ? "#FFC107" : "#d33",
      customClass: { container: "z-[10000]" },
    });
  }
  const [email, setEmail] = useState('');
  // const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      // if (!email) return await showWarningAlert();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        await Swal.fire({
          title: 'ไม่สามารถส่ง OTP ได้',
          text: 'กรุณากรอกอีเมลให้ถูกต้อง',
          icon: 'warning',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#FFC107',
          customClass: {
            container: 'z-[10000]',
          }
        });
        return;
      }
      setLoading(true);
      const response = await axios.post('/api/auth/forgot-password', { email: email.trim() });
      const result = response.data;
      await Swal.fire({
        title: 'สำเร็จ!',
        text: result.message || `รหัส OTP ถูกส่งไปที่อีเมลของคุณเรียบร้อยแล้ว`,
        icon: 'success',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#1BC688'
      });
      onSuccess(email);
    } catch (error) {
      console.error("Forgot password error:", error.response?.data?.message || error.message);
      await showAuthAlert(error.response?.status, error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div id="opt-form">
      <div>
        <form onSubmit={handleSubmit} className='tracking-[.5px] space-y-6 mb-6'>
          <div className='flex flex-col gap-y-3'>
            <label htmlFor="" className='text-[#333333] text-sm md:text-base'>อีเมลผู้ใช้</label>
            <div className='flex flex-col gap-y-4 items-end 
          sm:gap-x-4 sm:items-end
          md:flex-row md:items-center
          lg:flex-col lg:items-end
          2xl:flex-row 2xl:items-center'>
              <div className='flex items-center w-full flex-1 gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2.5 duration-300 focus-within:border-[#1BC688] focus-within:ring-1 focus-within:ring-[#1BC688]'>
                <AiOutlineMail size={20} color='#868686' />
                <input onChange={(e) => setEmail(e.target.value)} type="text" className='w-full focus:outline-none text-sm md:text-base text-[#4E5155]' placeholder='เช่น example@mail.com' autoFocus />
              </div>
              <div>
                <button type='submit' className='cursor-pointer px-3 py-2.5 rounded-[5px] border border-[#1BC688] text-[#03a96b] text-xs sm:text-sm duration-300 hover:bg-[#02BC77] hover:text-white active:bg-[#059669] focus:outline-none'>ส่งรหัส OTP</button>
              </div>
            </div>
          </div>
        </form>
        {/* <div className='mb-6'>
        <button onClick={(e) => { e.preventDefault(), setToggle(true) }} type='submit' className='py-2.5 w-full text-white bg-[#02BC77] rounded-[5px] cursor-pointer hover:bg-[#03a96b] focus:outline-none'>ไปหน้ารีเซ็ตรหัสผ่าน</button>
      </div> */}
      </div>
      {/* {loading && <div className='fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] flex justify-center items-center'>
        <SubmitLoading />
      </div>} */}
    </div>
  )
}

export function ResetPasswordForm({ email, onBack, setLoading }) {
  const showAuthAlert = async (status, serverText) => {
    let icon = "error";
    let title = "ไม่สามารถรีเซ็ตรหัสผ่านได้";
    let text = serverText || "กรุณาลองใหม่อีกครั้ง";
    if (status === 400) {
      // กรอกไม่ครบ/รูปแบบไม่ถูกต้อง
      icon = "warning";
      text = serverText || "ตรวจสอบข้อมูลที่กรอกอีกครั้ง";
    } else if (status === 500) {
      // เซิร์ฟเวอร์พัง
      icon = "error";
      text = serverText || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
    }
    await Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: "ตกลง",
      confirmButtonColor: icon === "warning" ? "#FFC107" : "#d33",
      customClass: { container: "z-[10000]" },
    });
  }
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      // if (!otp || !newPassword) return await showWarningAlert();
      setLoading(true);
      const response = await axios.post('/api/auth/reset-password',
        {
          email: email.trim(),
          otp: otp.trim(),
          newPassword: newPassword.trim()
        });
      const result = response.data;
      await Swal.fire({
        title: 'สำเร็จ!',
        text: result.message || `เปลี่ยนรหัสผ่านสำเร็จ`,
        icon: 'success',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#1BC688'
      });
      router.push('/login');
    } catch (error) {
      console.error("Reset password error:", error.response?.data?.message || error.message);
      await showAuthAlert(error.response?.status, error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div id="reset-password-form">
      <div>
        <form onSubmit={handleSubmit} className='tracking-[.5px] space-y-6'>
          <div className='flex flex-col gap-y-3'>
            <label htmlFor="" className='text-[#333333] text-[16px]'>หมายเลข OTP</label>
            <div className='flex items-center gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2.5 duration-300 focus-within:border-[#1BC688] focus-within:ring-1 focus-within:ring-[#1BC688]'>
              <BsClock size={20} color='#868686' />
              <input onChange={(e) => setOtp(e.target.value)} type="text" className='w-full focus:outline-none text-[16px] text-[#4E5155]' placeholder='เช่น 123456' autoFocus />
            </div>
            {/* <p className='text-[14px] text-[#1E70CD] cursor-pointer'>ลืมรหัสผ่าน</p> */}
          </div>
          <div className='flex flex-col gap-y-3'>
            <label htmlFor="" className='text-[#333333] text-[16px]'>รหัสผ่านใหม่</label>
            <div className='flex items-center gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2.5 duration-300 focus-within:border-[#1BC688] focus-within:ring-1 focus-within:ring-[#1BC688]'>
              <TfiLock size={20} color='#868686' />
              <input onChange={(e) => setNewPassword(e.target.value)} type={showPassword ? "text" : "password"} name='password' className='w-full focus:outline-none text-[16px] text-[#4E5155]' placeholder='รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)' />
              <PiEyeClosed size={25} color='#868686' className={`cursor-pointer ${showPassword ? 'hidden' : 'block'}`} onClick={() => setShowPassword(!showPassword)} />
              <IoIosEye size={25} color='#868686' className={`cursor-pointer ${showPassword ? 'block' : 'hidden'}`} onClick={() => setShowPassword(!showPassword)} />
            </div>
          </div>
          {/* <div className='flex flex-col gap-y-3'>
          <label htmlFor="" className='text-[#333333] text-[16px]'>ยืนยันรหัสผ่านใหม่</label>
          <div className='flex items-center gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2.5 focus-within:outline outline-[#03A96B] focus-within:border-none'>
            <TfiLock size={20} color='#868686' />
            <input type="password" className='focus:outline-none text-[16px] text-[#4E5155]' placeholder='กรอกรหัสผ่านใหม่อีกครั้ง' />
          </div>
        </div> */}
          <div className='mb-3'>
            <button className='py-2.5 w-full text-white bg-[#02BC77] rounded-[5px] cursor-pointer hover:bg-[#03a96b] active:bg-[#059669] focus:outline-none'>ยืนยันเปลี่ยนรหัสผ่าน</button>
          </div>
        </form>
        <div className='mb-3'>
          <button className='py-2.5 w-full text-[#454545] bg-white border border-[#E0E0E0] rounded-[5px] cursor-pointer hover:bg-[#F2F2F2] active:bg-[#E5E7EB] focus:outline-none' onClick={onBack}>ขอ OTP อีกครั้ง</button>
        </div>
      </div>
      {/* {loading && <div className='fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] flex justify-center items-center'>
        <SubmitLoading />
      </div>} */}
    </div>
  )
}