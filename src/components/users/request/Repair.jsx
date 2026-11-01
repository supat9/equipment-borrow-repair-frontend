'use client';
import React, { use, useRef } from 'react';
import { useState, useEffect } from 'react';
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { AiOutlineScan, AiOutlineSearch } from "react-icons/ai";
import Select from 'react-select'
import axios from 'axios';
import Swal from 'sweetalert2';
import { MdAssignment } from "react-icons/md";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { AiFillInfoCircle } from "react-icons/ai";
import dayjs from 'dayjs';
import { FaCartShopping } from "react-icons/fa6";
import { MdLocationOn } from "react-icons/md";
import Spinner from '@/components/users/loading/Spinner.jsx';
import { Html5Qrcode } from 'html5-qrcode';
import { PiScanLight } from 'react-icons/pi';


/* Modal แจ้งซ่อม */
export function RepairModal({ onClose }) {

    // const maintenanceType = [
    //     { value: '1', label: 'Repair' },
    //     { value: '2', label: 'Maintenance' },
    //     { value: '3', label: 'Inspection' },
    //     { value: '4', label: 'Replacement' }
    // ];
    const showSubmitAlert = () => {
        return Swal.fire({
            title: 'ยืนยันคำขอแจ้งซ่อม?',
            text: 'การดำเนินการนี้ไม่สามารถย้อนกลับได้',
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
    };
    const showSuccessAlert = () => {
        return Swal.fire({
            title: 'สำเร็จ!',
            text: 'ส่งคำขอแจ้งซ่อมครุภัณฑ์เรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#1BC688',
            customClass: {
                container: 'z-[10000]'
            }
        });
    };
    const showWarningAlert = () => {
        return Swal.fire({
            title: 'ไม่สามารถส่งคำขอแจ้งซ่อมได้',
            text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            icon: 'warning',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#FFC107',
            customClass: {
                container: 'z-[10000]',
            }
        });
    }
    const showErrorAlert = () => {
        return Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: 'ไม่สามารถส่งคำขอได้ กรุณาลองใหม่อีกครั้ง',
            icon: 'error',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#d33'
        });
    };
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [equipment_code, setEquipmentCode] = useState('');
    const [issue_description, setIssueDescription] = useState('');
    const [urgencyLevel, setUrgencyLevel] = useState([]);
    const [urgency_level_id, setUrgencyLevelId] = useState(null);
    // const [maintenance_type_id, setMaintenanceTypeId] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFileName, setImageFileName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [equipmentModal, setEquipmentModal] = useState(null);
    const [showQrScanner, setShowQrScanner] = useState(false);
    const qrScannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    const fetchUrgencyLevels = async () => {
        try {
            const response = await axios.get('/api/users/maintenance-request/status/urgency-levels');
            const urgencyLevelNameTH = {
                low: "ต่ำ",
                medium: "ปานกลาง",
                high: "สูง",
                critical: "เร่งด่วน"
            };
            const options = response.data.map((status) => ({
                value: status.id,
                label: urgencyLevelNameTH[status.level] || status.level
            }));
            setUrgencyLevel(options);
        } catch (error) {
            console.error('Error fetching urgency levels:', error);
        }
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImageFileName(file.name);

            // สร้าง preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
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
            icon = "info";
            color = "#2196F3"; // blue
            text = message || "ไม่พบข้อมูลที่ต้องการ";
        } else if (status === 500) {
            icon = "error";
            color = "#d33"; // red
            text = message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
        }

        await Swal.fire({
            title: "ไม่สามารถส่งคำขอได้",
            text,
            icon,
            confirmButtonText: "ตกลง",
            confirmButtonColor: color,
        });
    };
    useEffect(() => {
        fetchUrgencyLevels();
    }, []);

    // ฟังก์ชันสำหรับเปิด QR Scanner
    // ฟังก์ชันสำหรับเปิด QR Scanner
    const startQrScanner = async () => {
        try {
            // ขอสิทธิ์กล้องก่อนเปิด Scanner
            try {
                // ขอสิทธิ์โดยระบุ facingMode เป็น "environment" เพื่อให้ได้กล้องหลังก่อน
                await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });
            } catch (permissionErr) {
                console.error("Camera permission denied:", permissionErr);

                let errorMessage = "กรุณาอนุญาตให้เข้าถึงกล้องในการตั้งค่าเบราว์เซอร์";

                // ตรวจสอบประเภทของ error
                if (permissionErr.name === 'NotAllowedError') {
                    errorMessage = "คุณได้ปฏิเสธการเข้าถึงกล้อง กรุณาอนุญาตในการตั้งค่าเบราว์เซอร์";
                } else if (permissionErr.name === 'NotFoundError') {
                    errorMessage = "ไม่พบกล้องในอุปกรณ์ของคุณ";
                } else if (permissionErr.name === 'NotReadableError') {
                    errorMessage = "กล้องกำลังถูกใช้งานโดยแอปพลิเคชันอื่น กรุณาปิดแอปอื่นแล้วลองใหม่";
                } else if (permissionErr.name === 'OverconstrainedError') {
                    errorMessage = "ไม่พบกล้องที่รองรับการตั้งค่านี้";
                } else if (permissionErr.name === 'SecurityError') {
                    errorMessage = "ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบว่าเว็บไซต์ใช้ HTTPS";
                }

                throw new Error(errorMessage);
            }

            // ถ้าได้สิทธิ์แล้ว เปิด QR Scanner
            setShowQrScanner(true);

            // รอให้ DOM โหลดก่อน
            setTimeout(async () => {
                try {
                    const html5QrCode = new Html5Qrcode("qr-reader");
                    html5QrCodeRef.current = html5QrCode;

                    const config = {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        disableFlip: false
                    };

                    // ลองหา camera devices
                    const devices = await Html5Qrcode.getCameras();
                    if (!devices || devices.length === 0) {
                        throw new Error("ไม่พบกล้องในอุปกรณ์");
                    }

                    // *** ส่วนที่ปรับปรุง: การเลือกกล้องหลัง ***
                    // หากล้องหลังก่อน (ใช้ facingMode: "environment" หรือ label ที่สื่อถึงกล้องหลัง)
                    const backCamera = devices.find(device =>
                        device.label.toLowerCase().includes('back') ||
                        device.label.toLowerCase().includes('rear') ||
                        device.label.toLowerCase().includes('environment') || // เพิ่ม 'environment' ใน label
                        device.label.toLowerCase().includes('หลัง')
                    );

                    // ใช้กล้องหลังถ้าเจอ หรือใช้กล้องแรกในรายการ (ซึ่งมักจะเป็นกล้องที่เข้าถึงได้)
                    const cameraId = backCamera ? backCamera.id : devices[0].id; // เปลี่ยนจาก devices[devices.length - 1] เป็น devices[0]

                    await html5QrCode.start(
                        cameraId, // ใช้ camera ID ที่เลือก
                        config,
                        async (decodedText, decodedResult) => {
                            // เมื่อสแกนสำเร็จ
                            // console.log(`QR Code detected: ${decodedText}`);

                            // หยุดสแกน
                            await stopQrScanner();

                            // ตั้งค่ารหัสครุภัณฑ์
                            setEquipmentCode(decodedText);

                            // เรียกข้อมูลครุภัณฑ์
                            await fetchEquipmentByCode(decodedText);
                        },
                        (errorMessage) => {
                            // ไม่ต้องทำอะไรถ้ายังไม่พบ QR code
                        }
                    );
                } catch (err) {
                    console.error("Error starting QR scanner:", err);

                    // แสดง Alert พร้อมคำแนะนำ
                    const isHttps = window.location.protocol === 'https:';
                    const instructionText = !isHttps
                        ? 'เว็บไซต์ต้องใช้ HTTPS เพื่อเข้าถึงกล้อง'
                        : 'วิธีแก้ไข:\n\n• Android: คลิกไอคอน 🔒 ข้าง URL → Site Settings → Camera → Allow\n\n• iPhone: Settings → Safari → Camera → Allow\n\n• คอมพิวเตอร์: คลิกไอคอน 🔒 ข้าง URL → Site Settings → Camera → Allow';

                    await Swal.fire({
                        title: 'ไม่สามารถเปิดกล้องได้',
                        html: `<div style="text-align: left;">
                            <p style="margin-bottom: 10px;"><strong>สาเหตุ:</strong> ${err.message}</p>
                            <hr style="margin: 15px 0;">
                            <p style="margin-bottom: 8px;"><strong>${!isHttps ? '⚠️ คำเตือน' : '💡 คำแนะนำ'}:</strong></p>
                            <p style="white-space: pre-line; font-size: 14px;">${instructionText}</p>
                        </div>`,
                        icon: 'error',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#d33',
                        customClass: {
                            container: 'z-[10000]',
                            popup: 'text-left'
                        },
                        width: '90%',
                        maxWidth: '500px'
                    });
                    setShowQrScanner(false);
                }
            }, 100);
        } catch (err) {
            console.error("Permission error:", err);

            // แสดง Alert พร้อมคำแนะนำ
            const isHttps = window.location.protocol === 'http:'; // แก้ไขเป็นตรวจสอบ HTTPS
            const instructionText = !isHttps
                ? 'เว็บไซต์ต้องใช้ HTTPS เพื่อเข้าถึงกล้อง'
                : 'วิธีแก้ไข:\n\n• Android: คลิกไอคอน 🔒 ข้าง URL → Site Settings → Camera → Allow\n\n• iPhone: Settings → Safari → Camera → Allow\n\n• คอมพิวเตอร์: คลิกไอคอน 🔒 ข้าง URL → Site Settings → Camera → Allow';

            await Swal.fire({
                title: 'ไม่สามารถเข้าถึงกล้องได้',
                html: `<div style="text-align: left;">
                    <p style="margin-bottom: 10px;"><strong>สาเหตุ:</strong> ${err.message}</p>
                    <hr style="margin: 15px 0;">
                    <p style="margin-bottom: 8px;"><strong>${!isHttps ? '⚠️ คำเตือน' : '💡 คำแนะนำ'}:</strong></p>
                    <p style="white-space: pre-line; font-size: 14px;">${instructionText}</p>
                </div>`,
                icon: 'error',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#d33',
                customClass: {
                    container: 'z-[10000]',
                    popup: 'text-left'
                },
                width: '70%',
                maxWidth: '500px'
            });
        }
    };

    // ฟังก์ชันสำหรับหยุด QR Scanner
    const stopQrScanner = async () => {
        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current = null;
            } catch (err) {
                console.error("Error stopping QR scanner:", err);
            }
        }
        setShowQrScanner(false);
    };

    // ฟังก์ชันสำหรับดึงข้อมูลครุภัณฑ์ตามรหัส
    const fetchEquipmentByCode = async (code) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/maintenance-request/get-equipment', {
                params: { equipment_code: code.trim() }
            });
            const result = response.data;
            setEquipmentModal(result.data);
        } catch (error) {
            console.error('get equipment failed:', error.response?.data?.message || error.message);
            const statusIcon = {
                400: {
                    icon: 'warning',
                    color: '#FFC107'
                },
                404: {
                    icon: 'info',
                    color: '#17A2B8'
                },
                500: {
                    icon: 'error',
                    color: '#DC3545'
                }
            }
            await Swal.fire({
                title: error.response?.data?.message || 'ไม่พบข้อมูลครุภัณฑ์',
                icon: statusIcon[error.response?.status]?.icon || 'error',
                confirmButtonText: "ตกลง",
                confirmButtonColor: statusIcon[error.response?.status]?.color || '#FFC107',
            });
        } finally {
            setLoading(false);
        }
    };

    // ทำความสะอาดเมื่อ component unmount
    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch(err => console.error(err));
            }
        };
    }, []);
    // const openImageModal = () => {
    //     if (imagePreview) {
    //         setShowImageModal(true);
    //     }
    // };

    // const closeImageModal = () => {
    //     setShowImageModal(false);
    // };

    // const removeImage = () => {
    //     setSelectedImage(null);
    //     setImageFileName('');
    //     setImagePreview(null);
    //     // Reset input file
    //     const fileInput = document.getElementById('repairFile');
    //     if (fileInput) fileInput.value = '';
    // };
    const handleSubmit = async (e) => {
        setSubmitLoading(true);
        try {
            e.preventDefault();
            // if (!equipment_code || !issue_description || !urgency_level_id) return await showWarningAlert();
            if (equipment_code && issue_description && urgency_level_id) {
                const result = await showSubmitAlert();
                if (!result.isConfirmed) return;
            }

            // สร้าง FormData สำหรับส่งข้อมูล
            const formData = new FormData();
            formData.append('equipment_code', equipment_code.trim());
            formData.append('issue_description', issue_description.trim());
            formData.append('urgency_level_id', urgency_level_id ? urgency_level_id : '');

            // เพิ่มไฟล์ถ้ามี
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await axios.post('/api/users/maintenance-request', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const result = response.data;
            await Swal.fire({
                title: 'สำเร็จ!',
                text: result?.message || 'ส่งคำขอแจ้งซ่อมครุภัณฑ์เรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1BC688',
                customClass: {
                    container: 'z-[10000]'
                }
            });
            onClose();
        } catch (error) {
            console.error('Maintenance request failed:', error.response?.data?.message || error.message);
            await showAlertByStatus(error.response?.status, error.response?.data?.message);
        } finally {
            setSubmitLoading(false);
        }
    }
    const handleGetEquipment = async (e) => {
        e.preventDefault();

        // เปิด QR Scanner แทนการค้นหาด้วย input
        await startQrScanner();
    }

    const handleSearchEquipment = async (e) => {
        e.preventDefault();
        await fetchEquipmentByCode(equipment_code);
    };

    return (
        <div id="repair-modal">
            <div className="px-4 sm:px-0 fixed inset-0 z-30 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[300px] max-w-[600px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className='text-base sm:text-lg font-bold text-[#4E5155]'>แบบฟอร์มแจ้งซ่อมครุภัณฑ์</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6'>
                        <form onSubmit={handleSearchEquipment} action="" className='tracking-[.5px]'>
                            <div className='flex flex-col gap-y-3 mb-6'>
                                <label className='text-gray-700 text-sm md:text-base' htmlFor="equipment_code">ค้นหาครุภัณฑ์</label>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                                    <input onChange={(e) => setEquipmentCode(e.target.value)} value={equipment_code} id='equipment_code' className='text-[#4E5155] text-sm md:text-base w-full border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-[#1BC688]' type="text" placeholder='พิมพ์รหัสหรือชื่อครุภัณฑ์' autoFocus />
                                    <button type='submit' className='flex justify-center sm:justify-start items-center gap-x-2 px-3 py-2 cursor-pointer bg-[#1BC688] text-white rounded-[3px] shadow-[0px_0px_10px_#00000014] duration-200 hover:bg-[#03a96b] whitespace-nowrap'>
                                        <AiOutlineSearch color='#fff' size={20} />
                                        <span className='text-[16px]'>ค้นหา</span>
                                    </button>
                                    <button type='button' onClick={handleGetEquipment} className='flex justify-center sm:justify-start items-center gap-x-2 px-3 py-2 cursor-pointer bg-[#28c3d7] text-white rounded-[3px] shadow-[0px_0px_10px_#00000014] duration-200 hover:bg-[#189ab3] whitespace-nowrap'>
                                        <PiScanLight color='#fff' size={20} />
                                        <span className='text-[16px]'>สแกน QR</span>
                                    </button>
                                </div>
                            </div>
                            <div className='flex flex-col gap-y-3 mb-6'>
                                <label className='text-gray-700 text-sm md:text-base' htmlFor="issue_description">รายละเอียดปัญหา</label>
                                <div className='flex items-center gap-x-2'>
                                    <textarea onChange={(e) => setIssueDescription(e.target.value)} value={issue_description} id='issue_description' className='text-[#4E5155] text-sm md:text-base w-full border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-[#1BC688]' type="text" placeholder='รายละเอียดปัญหา' />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-x-4'>
                                <div className='flex flex-col gap-y-3 mb-6'>
                                    <label className='text-gray-700 text-sm md:text-base' htmlFor="maintenance_type_id">ระดับความเร่งด่วน</label>
                                    <div>
                                        <Select
                                            className='text-sm md:text-base'
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    width: '250px',
                                                    minHeight: '40px',
                                                    height: '40px',
                                                    borderRadius: '5px',
                                                    borderColor: state.isFocused ? '#1BC688' : '#D1D5DB',
                                                    boxShadow: state.isFocused ? '0 0 0 1.5px #1BC688' : 'none',
                                                    color: '#4E5155',
                                                    transition: 'border-color 0.2s',
                                                }),
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: '#868686',
                                                }),
                                            }}
                                            options={urgencyLevel}
                                            placeholder='เลือกประเภทการแจ้ง'
                                            onChange={option => setUrgencyLevelId(option?.value || '')}
                                            value={urgencyLevel.find(opt => opt.value === urgency_level_id) || null}
                                        />
                                    </div>
                                </div>
                                {/* <div className='flex flex-col gap-y-3 mb-6'>
                                    <label htmlFor="urgency_level_id">4. ประเภทการแจ้ง</label>
                                    <div>
                                        <Select
                                            options={maintenanceType}
                                            className='w-full'
                                            placeholder='เลือกระดับความเร่งด่วน'
                                            onChange={(option) => setMaintenanceTypeId(option?.value || '')}
                                            value={maintenanceType.find(opt => opt.value === maintenance_type_id) || null}
                                        />
                                    </div>
                                </div> */}
                            </div>
                            <div className='flex flex-col gap-y-6 mb-6'>
                                <label htmlFor="" className='text-gray-700 text-sm md:text-base'>แนบรูปภาพประกอบ (Option)</label>
                                <div>
                                    <label htmlFor="repairFile" className="px-4 py-2 text-sm md:text-base bg-[#F3F4F6] text-gray-700 rounded-[5px] border border-[#E0E0E0] cursor-pointer hover:bg-[#e5e7eb] transition">
                                        {imageFileName || 'เลือกรูปภาพ...'}
                                    </label>
                                    <input
                                        id="repairFile"
                                        className="hidden"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button type='button' onClick={onClose} className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ยกเลิก</button>
                                <button type='button' onClick={handleSubmit} className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] '>ส่งเรื่องแจ้งซ่อม</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {loading ? <div className='fixed inset-0 z-50  flex justify-center items-center'>
                <div className="relative w-20 h-20 flex items-center justify-center">
                    <Spinner />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                </div>
            </div> : (
                equipmentModal && <GetEquipmentModal equipment={equipmentModal} onClose={() => setEquipmentModal(null)} />
            )}
            {submitLoading && (
                <div className='fixed inset-0 z-50 bg-[rgba(0,0,0,0.1)]  flex justify-center items-center'>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <Spinner />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
                    </div>
                </div>
            )}
            {showQrScanner && (
                <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.9)] flex flex-col justify-center items-center">
                    <div className="w-full max-w-md p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white text-lg font-semibold">สแกน QR Code</h3>
                            <button
                                onClick={stopQrScanner}
                                className='cursor-pointer p-2 bg-white rounded-full hover:bg-gray-200'
                            >
                                <RxCross2 size={24} color='#454545' />
                            </button>
                        </div>
                        <div
                            id="qr-reader"
                            className="w-full rounded-lg overflow-hidden border-4 border-[#1BC688]"
                        ></div>
                        <p className="text-white text-center mt-4 text-sm">
                            วางกล้องให้ตรงกับ QR Code บนครุภัณฑ์
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

/* Modal เรียกดูครุภัณฑ์ */
export function GetEquipmentModal({ equipment, onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const fmt = (time) => dayjs(time).format('DD/MM/YYYY');
    const [showImageModal, setShowImageModal] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState(null);
    const openPreview = (src) => {
        setPreviewSrc(src);
        setPreviewOpen(true);
    }
    const closePreview = () => {
        setPreviewSrc(null);
        setPreviewOpen(false);
    }
    return (
        <div id="user-get-equipment-modal">
            <div className="px-4 lg:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.3)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-[300px] max-w-[900px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-6'>
                        <div className='flex items-center gap-x-4'>
                            <h2 className='text-[18px] font-bold text-gray-600'>รายละเอียดครุภัณฑ์</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6 max-h-[70vh] overflow-y-auto'>
                        <div className='space-y-6'>
                            <div className='mb-6 bg-white border border-gray-300 shadow-sm p-6 rounded-[5px] transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='p-2 rounded-full bg-[#1BC688] shadow-xl transform transition-all duration-200'>
                                        <MdAssignment size={20} color='white' />
                                    </div>
                                    <div>
                                        <h2 className='text-lg sm:text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลครุภัณฑ์</h2>
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">รหัสครุภัณฑ์</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.equipment_code || 'ไม่มีรหัสครุภัณฑ์'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ชื่อครุภัณฑ์</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.equipment_name || 'ไม่ระบุชื่อครุภัณฑ์'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ยี่ห้อ</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.brand || 'ยังไม่ระบุยี่ห้อ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">รุ่น</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.model || 'ยังไม่ระบุรุ่น'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">Serial Number</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.serial_number || 'ยังไม่ระบุ Serial Number'}</p>
                                    </div>
                                    {/* <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">กลุ่มครุภัณฑ์</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.asset_group || 'ยังไม่ระบุบาร์โค้ด'}</p>
                                    </div> */}
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">คำอธิบาย</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.description || 'ยังไม่ได้ระบุ'}</p>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='mb-6 bg-slate-50 border border-slate-300 p-7 rounded-[5px]  hover:shadow-lg transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='p-2 rounded-full bg-[#1BC688] shadow-xl transform transition-all duration-200'>
                                        <FaCartShopping size={20} color='white' />
                                    </div>
                                    <div>
                                        <h2 className='text-lg sm:text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลการเงินและการซื้อ</h2>
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">วันที่ซื้อ</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.purchase_date ? fmt(equipment.purchase_date) : 'ไม่ระบุวันที่ซื้อ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ราคาซื้อ</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.purchase_price ? `${Number(equipment.purchase_price).toLocaleString()} บาท` : 'ไม่ระบุราคาซื้อ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ผู้ขาย</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.vendor || 'ไม่ระบุผู้ขาย'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">การรับประกัน</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.warranty_period ? `${equipment.warranty_period} เดือน` : 'ไม่ระบุการรับประกัน'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">วันสิ้นสุดการรับประกัน</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.warranty_end_date ? fmt(equipment.warranty_end_date) : 'ไม่ระบุวันสิ้นสุดการรับประกัน'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ค่าเสื่อมราคา</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.depreciation_rate ? `${equipment.depreciation_rate}%` : 'ไม่ระบุค่าเสื่อมราคา'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">มูลค่าปัจจุบัน</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.current_value ? `${Number(equipment.current_value).toLocaleString()} บาท` : 'ไม่ระบุมูลค่าปัจจุบัน'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-6 bg-slate-50 border border-slate-300 p-7 rounded-[5px]  hover:shadow-lg transition-all duration-300 backdrop-blur-sm'>
                                <div className='flex items-center gap-x-4 mb-6'>
                                    <div className='p-2 rounded-full bg-[#1BC688] shadow-xl transform transition-all duration-200'>
                                        <MdLocationOn size={20} color='white' />
                                    </div>
                                    <div>
                                        <h2 className='text-lg sm:text-xl font-bold tracking-[.5px] text-gray-700 mb-1'>ข้อมูลสถานะและตำแหน่ง</h2>
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ห้อง</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.room_id || 'ไม่ระบุห้อง'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">สถานะสภาพ</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.condition_status_id || 'ไม่ระบุสถานะสภาพ'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">สถานะการใช้งาน</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.usage_status_id || 'ไม่ระบุสถานะการใช้งาน'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">ต้องการการอนุมัติ</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>{equipment?.requires_approval === 1 ? 'ใช่' : 'ไม่'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">สถานะการทำงาน</label>
                                        <p className={`${equipment?.is_active === 1 ? 'text-green-600' : 'text-red-600'} text-base`}>{equipment?.is_active === 1 ? 'ใช้งานอยู่' : 'ไม่ได้ใช้งาน'}</p>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">รูปภาพ</label>
                                        <p className='text-slate-700 text-sm sm:text-base'>
                                            {equipment?.image_path?.includes('https://res.cloudinary.com') ? (
                                                <span onClick={() => openPreview(equipment.image_path)} className='text-blue-500 hover:underline cursor-pointer'>
                                                    ดูรูปภาพ
                                                </span>
                                            ) : 'ไม่มีรูปภาพ'}
                                        </p>
                                    </div>
                                </div>
                            </div> */}
                            <div className='flex justify-end'>
                                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {previewOpen && (
                <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center " onClick={closePreview}>
                    <div className="relative max-w-[60vw] max-h-[80vh]">
                        <button onClick={closePreview} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB] absolute top-5 right-5'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                        <img src={previewSrc} alt="preview" className="max-w-full max-h-[80vh] rounded" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default RepairModal