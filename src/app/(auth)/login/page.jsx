'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { set, useForm } from 'react-hook-form';
import Image from 'next/image';
import { IoMdArrowDropdown } from "react-icons/io";
import { PiUser } from "react-icons/pi";
import { TfiLock } from "react-icons/tfi";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Spinner from '@/components/users/loading/Spinner';
import { IoIosEye } from "react-icons/io";
import { PiEyeClosed } from "react-icons/pi";
import { SubmitLoading } from '@/components/users/loading/LoadingOverlay';

export default function page() {
    const showSuccessAlert = () => {
        return Swal.fire({
            title: 'สำเร็จ!',
            text: 'ล็อกอินสำเร็จ',
            icon: 'success',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#1BC688',
            customClass: {
                container: 'z-[10000]'
            }
        });
    };
    const showErrorAlert = () => {
        return Swal.fire({
            title: 'ไม่สามารถเข้าสู่ระบบได้',
            text: 'กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน',
            icon: 'error',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#d33',
            customClass: {
                container: 'z-[10000]',
            }
        });
    };
    const showWarningAlert = () => {
        return Swal.fire({
            title: 'ไม่สามารถเข้าสู่ระบบได้',
            text: 'กรุณากรอกบัญชีผู้ใช้งานและรหัสผ่าน',
            icon: 'warning',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#FFC107',
            customClass: {
                container: 'z-[10000]',
            }
        });
    }
    const showAuthAlert = async (status, serverText) => {
        let icon = "error";
        let title = "ไม่สามารถเข้าสู่ระบบได้";
        let text = serverText || "กรุณาลองใหม่อีกครั้ง";
        if (status === 400) {
            // กรอกไม่ครบ/รูปแบบไม่ถูกต้อง
            icon = "warning";
            text = serverText || "กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน";
        } else if (status === 401) {
            // ยืนยันตัวตนไม่ผ่าน
            icon = "error";
            text = serverText || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
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
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            // if (!formData.username || !formData.password) return await Swal.fire({
            //     title: 'ไม่สามารถเข้าสู่ระบบได้',
            //     text: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน',
            //     icon: 'warning',
            //     confirmButtonText: 'ตกลง',
            //     confirmButtonColor: '#FFC107',
            //     customClass: {
            //         container: 'z-[10000]',
            //     }
            // });

            /* Format Password */
            // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_\-+=])[A-Za-z\d@$!%*#?&^()_\-+=]{8,}$/;
            // if (!passwordRegex.test(password)) {
            //     await Swal.fire({
            //         title: 'รหัสผ่านไม่ถูกต้อง',
            //         text: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวอักษร ตัวเลข และอักษรพิเศษ',
            //         icon: 'warning',
            //         confirmButtonText: 'ตกลง',
            //         confirmButtonColor: '#FFC107',
            //         customClass: { container: 'z-[10000]' }
            //     });
            //     return;
            // }
            setLoading(true);
            const response = await axios.post('/api/auth/login',
                { username: username.trim(), password: password.trim() }
            );
            const result = response.data;
            function getRoleFromToken(token) {
                const payload = token.split('.')[1];
                const decoded = JSON.parse(atob(payload));
                return decoded.role;
            }
            const role = getRoleFromToken(result.access_token);

            if (role === 'student') {
                router.push('/users/');
            } else if (role === 'staff') {
                router.push('/staff/dashboard');
            } else if (role === 'admin') {
                router.push('/admin/');
            }
            // localStorage.setItem('accessToken', result.access_token);
            // Cookies.set('token', result.access_token, { expires: 1 });
        } catch (error) {
            console.error("Login error:", error.response.data.message);
            await showAuthAlert(error.response.status, error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div id="login">
            {loading && <div className='fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] flex justify-center items-center'>
                <SubmitLoading />
            </div>}
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
                        <div className='flex flex-col items-center gap-y-4 mb-6'>
                            <Image src="/myku/images/KU_Logo_PNG.png" alt="Logo" width={120} height={120} className='' />
                            <h1 className='text-base tracking-[1px] lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-[#006C68]'>เข้าใช้งานระบบยืมคืน - ครุภัณฑ์</h1>
                        </div>
                        <div>
                            <form action="" onSubmit={handleSubmit} className='tracking-[.5px] space-y-6'>
                                <div className='flex flex-col gap-y-3'>
                                    <label htmlFor="" className='text-[#333333] text-sm md:text-base'>บัญชีผู้ใช้</label>
                                    <div className='flex items-center gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2.5 duration-300 focus-within:border-[#1BC688] focus-within:ring-1 focus-within:ring-[#1BC688]'>
                                        <PiUser size={20} color='#868686' />
                                        <input value={username} onChange={(e) => setUsername(e.target.value)} name='username' type="text" className='w-full focus:outline-none text-sm md:text-base text-[#4E5155]' placeholder='เช่น b63xxxxxxx หรือ regxxx' autoFocus />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-y-3'>
                                    <label htmlFor="" className='text-[#333333] text-sm md:text-base'>รหัสผ่าน</label>
                                    <div className='flex items-center gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2.5 duration-300 focus-within:border-[#1BC688] focus-within:ring-1 focus-within:ring-[#1BC688]'>
                                        <TfiLock size={20} color='#868686' />
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} name='password' type={showPassword ? "text" : "password"} className='w-full focus:outline-none text-sm md:text-base text-[#4E5155]' placeholder='รหัสผ่าน' />
                                        <PiEyeClosed size={25} color='#868686' className={`cursor-pointer ${showPassword ? 'hidden' : 'block'}`} onClick={() => setShowPassword(!showPassword)} />
                                        <IoIosEye size={25} color='#868686' className={`cursor-pointer ${showPassword ? 'block' : 'hidden'}`} onClick={() => setShowPassword(!showPassword)} />
                                    </div>
                                    <Link href="/forgot-password" className=' text-sm md:text-sm text-[#1E70CD] cursor-pointer w-fit'>
                                        ลืมรหัสผ่าน
                                    </Link>
                                </div>
                                <div className='mb-6'>
                                    <button type='submit' className='py-2.5 w-full text-white bg-[#02BC77] rounded-[5px] cursor-pointer hover:bg-[#03a96b] active:bg-[#059669] focus:outline-none'>เข้าสู่ระบบ</button>
                                </div>
                            </form>
                        </div>
                        <div>
                            <p className='tracking-[.5px] text-sm md:text-sm text-center'>หากท่านมีข้อสงสัย หรือต้องการสอบถามรายละเอียดข้อมูล <span onClick={() => router.push('staff/borrow-return')} className='text-[#1E70CD] cursor-pointer'>ติดต่อเรา</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
