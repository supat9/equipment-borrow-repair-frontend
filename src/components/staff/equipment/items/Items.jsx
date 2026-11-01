"use client";
import React, { use, useRef } from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";
import { PiNewspaper, PiScan, PiScanLight, PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { IoLocationOutline, IoSearchOutline } from "react-icons/io5";
import { MdQrCode } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoPrint } from "react-icons/io5";
import { PiDownloadSimple } from "react-icons/pi";
import Select from "react-select";
import Image from "next/image";
import { SlArrowLeft } from "react-icons/sl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendar3, BsCart2 } from "react-icons/bs";
import Swal from "sweetalert2";
import Spinner from "@/components/users/loading/Spinner";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import JSZip from "jszip";
import DateTimePicker from "@/components/inputs/DateTimePicker";
import {
  DataLoading,
  SubmitLoading,
} from "@/components/users/loading/LoadingOverlay";
import ActiveSwitch from "@/components/inputs/ActiveSwitch";
import { FaLayerGroup } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { MdLocationOn } from "react-icons/md";
import { BsChatSquareTextFill } from "react-icons/bs";
import dayjs from "dayjs";
import Pagination from "@/components/staff/pagination/Pagination";
import { PiFileCsvLight } from "react-icons/pi";
import { SlArrowRight } from "react-icons/sl";
import { useRouter } from "next/navigation";
import { BsQrCodeScan } from "react-icons/bs";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiBarcode } from "react-icons/pi";
import { IoRefresh } from "react-icons/io5";
import { DateTime } from "luxon";
import DatePickerInput from "@/components/inputs/DatePicker";
// QR Code Modal for single item
export function PrintQrModal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const qrRef = useRef(null);

  const downloadImage = async (type) => {
    if (!qrRef.current) return;
    const dataUrl = await htmlToImage.toPng(qrRef.current);
    const link = document.createElement("a");
    link.download = `qr_${item.equipment_code || "NO-CODE"}.${type}`;
    if (type === "png") {
      link.href = dataUrl;
    } else if (type === "jpg" || type === "jpeg") {
      // Convert PNG to JPEG
      const img = new window.Image();
      img.src = dataUrl;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();
      };
      return;
    }
    link.click();
  };

  // 6cm x 4cm = 60mm x 40mm
  const downloadPDF = async () => {
    if (!qrRef.current) return;

    // 1. เพิ่ม Options object และกำหนด pixelRatio
    const options = {
      pixelRatio: 3, // เพิ่มความละเอียดเป็น 3 เท่า (คมชัดขึ้นมาก)
    };

    // 2. ส่ง options เข้าไปในฟังก์ชัน toPng
    const dataUrl = await htmlToImage.toPng(qrRef.current, options);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [60, 40],
    });
    pdf.addImage(dataUrl, "PNG", 0, 0, 60, 40);
    pdf.save(`qr_${item.equipment_code || "NO-CODE"}.pdf`);
  };

  return (
    <div id="qrItem-modal">
      <div className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
        <div className="tracking-[.5px] min-w-[226px] max-w-[226px] w-full bg-white rounded-[5px] py-6 shadow-xl relative print:rounded-none print:shadow-none print:min-w-0 print:max-w-none print:w-auto print:bg-white">
          <div className="flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4 print:hidden">
            {" "}
            {/* ซ่อนส่วนควบคุมการพิมพ์ */}
            <div className="flex items-center gap-x-2">
              <PiScanLight size={24} color="#4E5155" />
              <h2 className="text-[18px] font-bold text-[#4E5155]">
                QR Code ครุภัณฑ์
              </h2>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]"
            >
              <RxCross2 size={20} color="#454545" />
            </button>
          </div>
          <div className="px-6 print:px-0">
            <div className="flex flex-col gap-y-4 text-[#4E5155]">
              {/* ปรับขนาด div สำหรับสติ๊กเกอร์ 6cm x 4cm (ประมาณ 226px x 151px ที่ 96 DPI) */}
              <div
                ref={qrRef}
                className="border-2 border-dashed border-[#E0E0E0] rounded-[8px] p-2 bg-white print:border-none print:rounded-none print:p-0 print:bg-white flex justify-between items-center"
                style={{ width: "226px", height: "151px" }}
              >
                {/* Print-specific styles for 6x4cm sticker */}
                <style jsx global>{`
                  @media print {
                    @page {
                      size: 6cm 4cm landscape;
                      margin: 0;
                    }
                    body {
                      -webkit-print-color-adjust: exact;
                      print-color-adjust: exact;
                    }
                    #qrItem-modal {
                      position: absolute !important;
                      left: 0 !important;
                      top: 0 !important;
                      width: 60mm !important;
                      height: 40mm !important;
                      min-width: 0 !important;
                      max-width: none !important;
                      background: white !important;
                      box-shadow: none !important;
                      border-radius: 0 !important;
                      z-index: 1 !important;
                      display: block !important;
                    }
                    #qrItem-modal > div:first-child {
                      min-width: 0 !important;
                      max-width: none !important;
                      width: 60mm !important;
                      height: 40mm !important;
                      background: white !important;
                      box-shadow: none !important;
                      border-radius: 0 !important;
                      padding: 0 !important;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    }
                    #qrItem-modal .print\\:hidden,
                    #qrItem-modal .print\\:hidden * {
                      display: none !important;
                    }
                    .print\\:p-0 {
                      width: 100% !important;
                      height: 100% !important;
                      padding: 2mm !important;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    }
                    .print-header {
                      font-size: 9pt !important;
                      font-weight: bold !important;
                      color: black !important;
                      margin: 0;
                      line-height: 1.2;
                      overflow: hidden;
                      white-space: normal;
                      text-overflow: ellipsis;
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      -webkit-box-orient: vertical;
                      max-height: 2.4em;
                    }
                    .print-text {
                      font-size: 8pt !important;
                      font-weight: normal !important;
                      color: black !important;
                      margin: 0;
                      line-height: 1.2;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      max-width: 100%;
                    }
                    .print-qr-code {
                      width: 30mm !important;
                      height: 30mm !important;
                      padding: 0 !important;
                    }
                  }
                `}</style>
                {/* Layout: ข้อมูลซ้าย, QR Code ขวา */}
                <div className="flex-1 text-left pr-2 overflow-hidden">
                  <h3 className="text-[12px] font-bold text-black print-header">
                    {item.equipment_name}
                  </h3>
                  <p className="text-[10px] text-black print-text break-all">
                    S/N: {item.serial_number || "-"}
                  </p>
                  <p className="text-[10px] text-black print-text">
                    EQ: {item.equipment_code || "-"}
                  </p>
                  <p className="text-[10px] text-black print-text">
                    Major: {item.major_code || "-"}
                  </p>
                </div>

                <div className="flex justify-center items-center pl-1">
                  <div className="print-qr-code">
                    <QRCode
                      value={item.equipment_code || "NO-CODE"}
                      size={100}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Download Options Section */}
            <div className="space-y-4 border-t border-[#E0E0E0] pt-4 mt-4 print:hidden">
              <p className="text-[14px] text-[#6B7280] font-medium">
                ดาวน์โหลดไฟล์:
              </p>

              {/* Download Buttons Grid */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => downloadImage("png")}
                  className="flex items-center justify-center gap-x-2 cursor-pointer rounded-[8px] px-4 py-3 bg-blue-600 text-white duration-200 hover:bg-blue-700 text-[14px] font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <PiDownloadSimple size={18} />
                  PNG
                </button>

                <button
                  onClick={() => downloadImage("jpg")}
                  className="flex items-center justify-center gap-x-2 cursor-pointer rounded-[8px] px-4 py-3 bg-green-600 text-white duration-200 hover:bg-green-700 text-[14px] font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <PiDownloadSimple size={18} />
                  JPG
                </button>

                <button
                  onClick={() => downloadImage("jpeg")}
                  className="flex items-center justify-center gap-x-2 cursor-pointer rounded-[8px] px-4 py-3 bg-purple-600 text-white duration-200 hover:bg-purple-700 text-[14px] font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <PiDownloadSimple size={18} />
                  JPEG
                </button>

                <button
                  onClick={downloadPDF}
                  className="flex items-center justify-center gap-x-2 cursor-pointer rounded-[8px] px-4 py-3 bg-red-600 text-white duration-200 hover:bg-red-700 text-[14px] font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <PiDownloadSimple size={18} />
                  PDF
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="cursor-pointer rounded-[8px] px-6 py-2.5 bg-gray-100 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200 hover:border-gray-400 transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// QR Code Modal for multiple items
export function PrintMultipleQrModal({ equipments, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const qrRefs = useRef([]);

  const downloadAll = async (type) => {
    const zip = new JSZip();
    for (let i = 0; i < equipments.length; i++) {
      const ref = qrRefs.current[i];
      if (!ref) continue;
      const dataUrl = await htmlToImage.toPng(ref);
      let fileData = dataUrl;
      let ext = type;
      if (type === 'jpg' || type === 'jpeg') {
        // Convert PNG to JPEG
        const img = new window.Image();
        img.src = dataUrl;
        await new Promise(resolve => {
          img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            fileData = canvas.toDataURL('image/jpeg', 0.95);
            resolve();
          };
        });
      }
      zip.file(`qr_${equipments[i].equipment_code || 'NO-CODE'}.${ext}`, fileData.split(',')[1], { base64: true });
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.download = `qr_codes_${Date.now()}.zip`;
    link.href = URL.createObjectURL(content);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // 6cm x 4cm = 60mm x 40mm
  const downloadAllPDF = async () => {
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [60, 40] });

    // 1. เพิ่ม Options object และกำหนด pixelRatio
    const options = {
      pixelRatio: 3
    };

    for (let i = 0; i < equipments.length; i++) {
      const ref = qrRefs.current[i];
      if (!ref) continue;

      const dataUrl = await htmlToImage.toPng(ref, options);

      if (i > 0) pdf.addPage([60, 40], 'landscape'); // แก้ไขการเพิ่มหน้าให้ถูกต้อง
      pdf.addImage(dataUrl, 'PNG', 0, 0, 60, 40);
    }
    pdf.save(`qr_codes_${Date.now()}.pdf`);
  };

  return (
    <div id="printMultipleQr-modal">
      <div className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.4)] flex justify-center items-center print:bg-white print:relative print:inset-auto print:z-auto">
        <div className="tracking-[.5px] min-w-[900px] max-w-[1200px] w-fit bg-white rounded-[5px] py-6 shadow-xl relative max-h-[90vh] overflow-y-auto print:shadow-none print:rounded-none print:py-0 print:max-h-none print:overflow-visible print:min-w-full print:max-w-none">
          <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4 print:hidden'>
            <div className='flex items-center gap-x-2'>
              <PiScanLight size={24} color='#4E5155' />
              <h2 className='text-[18px] font-bold text-[#4E5155]'>ปริ้นท์ QR Code หลายรายการ ({equipments.length} รายการ)</h2>
            </div>
            <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
              <RxCross2 size={20} color='#454545' />
            </button>
          </div>
          <div className='px-6 print:px-4'>
            <div className='mb-6 print:hidden'>
              <p className='text-[#6B7280] text-[14px]'>รายการครุภัณฑ์ที่เลือกไว้สำหรับการปริ้นท์ QR Code</p>
            </div>
            {/* ⬇️⬇️⬇️ จุดที่แก้ไข ⬇️⬇️⬇️ */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-[320px] overflow-y-auto pr-3 print:grid print:grid-cols-2 print:gap-4'>
              {equipments.map((equipment, idx) => (
                <div key={equipment.id} ref={el => qrRefs.current[idx] = el} className='border border-[#E0E0E0] rounded-[8px] p-2 bg-white print:border-none print:rounded-none print:p-0 print:bg-white flex justify-between items-center' style={{ width: '226px', height: '151px' }}>
                  <style jsx global>{`
                    @media print {
                      @page {
                        size: 6cm 4cm landscape;
                        margin: 0;
                      }
                      body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                      }
                      .print-container {
                        width: 60mm !important;
                        height: 40mm !important;
                        padding: 2mm !important;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      }
                      .print-header-multi {
                        font-size: 9pt !important;
                        font-weight: bold !important;
                        color: black !important;
                        margin: 0;
                        line-height: 1.2;
                        overflow: hidden;
                        white-space: normal;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        max-height: 2.4em;
                      }
                      .print-text-multi {
                        font-size: 8pt !important;
                        font-weight: normal !important;
                        color: black !important;
                        margin: 0;
                        line-height: 1.2;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        max-width: 100%;
                      }
                      .print-qr-code-multi {
                        width: 30mm !important;
                        height: 30mm !important;
                        padding: 0 !important;
                      }
                    }
                  `}</style>
                  <div className="flex-1 text-left pr-2 overflow-hidden">
                    <h3 className='text-[12px] font-bold text-black print-header-multi'>{equipment.equipment_name}</h3>
                    <p className='text-[10px] text-black print-text-multi break-all'>S/N: {equipment.serial_number || '-'}</p>
                    <p className='text-[10px] text-black print-text-multi'>EQ: {equipment.equipment_code || '-'}</p>
                    <p className='text-[10px] text-black print-text-multi'>Major: {equipment.major_code || '-'}</p>
                  </div>
                  <div className='flex justify-center items-center pl-1'>
                    <div className='print-qr-code-multi'>
                      <QRCode
                        value={equipment.equipment_code || 'NO-CODE'}
                        size={100}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        viewBox={`0 0 256 256`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='space-y-3 border-t border-[#E0E0E0] pt-4 mt-6 print:hidden'>
              <p className='text-[14px] text-[#6B7280] text-center'>ดาวน์โหลดทั้งหมด (ZIP/PDF):</p>
              <div className='grid grid-cols-4 gap-2 max-w-lg mx-auto'>
                <button onClick={() => downloadAll('png')} className='flex items-center justify-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-blue-600 text-white duration-200 hover:bg-blue-700 text-[14px]'><PiDownloadSimple size={18} />PNG</button>
                <button onClick={() => downloadAll('jpg')} className='flex items-center justify-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-green-600 text-white duration-200 hover:bg-green-700 text-[14px]'><PiDownloadSimple size={18} />JPG</button>
                <button onClick={() => downloadAll('jpeg')} className='flex items-center justify-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-purple-600 text-white duration-200 hover:bg-purple-700 text-[14px]'><PiDownloadSimple size={18} />JPEG</button>
                <button onClick={downloadAllPDF} className='flex items-center justify-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 bg-red-600 text-white duration-200 hover:bg-red-700 text-[14px]'><PiDownloadSimple size={18} />PDF</button>
              </div>
            </div>
          </div>
          <div className='flex justify-end gap-x-4 px-6 mt-6 print:hidden'>
            <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ยกเลิก</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Items() {
  const router = useRouter();
  const [addEquipmentTypeModal, setAddEquipmentTypeModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");

  const [addItemModal, setAddItemModal] = useState(false);
  const [editItemModal, setEditItemModal] = useState(null);
  const [printQrModal, setPrintQrModal] = useState(null);
  const [printMultipleQrModal, setPrintMultipleQrModal] = useState(false);
  const [itemDetailModal, setItemDetailModal] = useState(false);
  const [equipmentsList, setEquipmentsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [equipment_name, setEquipment_name] = useState("");
  const [equipment_code, setEquipment_code] = useState("");

  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const fetchEquipments = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/staff/equipment", {
        params: {
          equipment_code: equipment_code.trim(),
          equipment_name: equipment_name.trim(),
          category_name: selectedCategory ? selectedCategory.value : null,
          page,
          limit: itemsPerPage,
        },
      });

      setEquipmentsList(response.data.data);
      // setCurrentPage(response.data.pagination?.currentPage || 1);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalItems(response.data.pagination?.totalItems || 0);
      setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
      // ถ้าฟิก itemsPerPage เป็น 10 ไม่ต้อง set ก็ได้
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/staff/equipment-category");
      const options = response.data.map((category) => ({
        value: category.categoryName,
        label: category.categoryName,
      }));
      setCategoriesList(options);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEquipments(currentPage);
  }, [currentPage, equipment_code, equipment_name, selectedCategory]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setEquipment_name(searchName);
      setEquipment_code(searchCode);
      setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
    }, 500); // 500ms หลังหยุดพิมพ์

    return () => clearTimeout(handler);
  }, [searchName, searchCode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const statusMap = {
    borrowed: {
      bg: "bg-orange-50 border border-orange-200",
      dot: "bg-orange-500",
      text: "text-orange-700",
      label: "กำลังยืม",
    },
    available: {
      bg: "bg-green-50 border border-green-200",
      dot: "bg-green-500",
      text: "text-green-700",
      label: "ว่าง",
    },
    repair: {
      bg: "bg-yellow-50 border border-yellow-200",
      dot: "bg-yellow-500",
      text: "text-yellow-700",
      label: "ซ่อมแซม",
    },
    retired: {
      bg: "bg-red-50 border border-red-200",
      dot: "bg-red-500",
      text: "text-red-700",
      label: "นำออก",
    },
    active: {
      bg: "bg-blue-50 border border-blue-200",
      dot: "bg-blue-500",
      text: "text-blue-700",
      label: "ใช้งานปกติ",
    },
    cancelled: {
      bg: "bg-gray-50 border border-gray-300",
      dot: "bg-gray-500",
      text: "text-gray-700",
      label: "ยกเลิก",
    },
    selled: {
      bg: "bg-purple-50 border border-purple-200",
      dot: "bg-purple-500",
      text: "text-purple-700",
      label: "ขายแล้ว",
    },
  };
  const statusColor = {
    1: {
      bg: "bg-green-50 border border-green-200",
      dot: "bg-green-500",
      text: "text-green-700",
      label: "ใช้งาน",
    },
    0: {
      bg: "bg-red-50 border border-red-200",
      dot: "bg-red-500",
      text: "text-red-700",
      label: "ไม่ได้ใช้งาน",
    },
  };
  const showAlertByStatus = async (status, message) => {
    let icon = "error";
    let color = "#d33";
    let text = message || "เกิดข้อผิดพลาด";

    if (status === 404) {
      icon = "info";
      color = "#2196F3"; // blue
      text = message || "ไม่พบข้อมูลที่ต้องการ";
    } else if (status === 500) {
      icon = "error";
      color = "#d33"; // red
      text = message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
    }

    await Swal.fire({
      title: "ไม่สามารถลบอุปกรณ์ได้",
      text,
      icon,
      confirmButtonText: "ตกลง",
      confirmButtonColor: color,
    });
  };
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleDelete = async (id) => {
    try {
      const confirmed = await Swal.fire({
        title: "ยืนยันการลบครุภัณฑ์",
        text: `การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
        icon: "warning",
        confirmButtonText: "ยืนยัน",
        confirmButtonColor: "#d9534f",
        showCancelButton: true,
        cancelButtonColor: "#6B7280",
        cancelButtonText: "ยกเลิก",
        customClass: {
          container: "z-[10000]",
        },
      });
      if (!confirmed.isConfirmed) return;
      setSubmitLoading(true);
      const response = await axios.delete(
        `/api/staff/equipment/${encodeURIComponent(id)}`
      );
      const result = response.data;
      setSubmitLoading(false);
      await Swal.fire({
        icon: "success",
        title: result?.message || "ลบครุภัณฑ์สำเร็จ",
        confirmButtonText: "ตกลง",
      });
      await fetchEquipments();
    } catch (error) {
      console.error(
        "Error deleting equipment:",
        error.response?.data?.message || error.message
      );
      await showAlertByStatus(
        error.response?.status,
        error.response?.data?.message
      );
    } finally {
      setSubmitLoading(false);
    }
  };
  // const handleSearch = async (e) => {
  //     setLoading(true);
  //     try {
  //         e.preventDefault();
  //         setCurrentPage(1); // รีเซ็ตไปหน้าแรก
  //     } catch (error) {
  //         console.error('Error searching equipment:', error);
  //     } finally {
  //         setLoading(false);
  //     }
  // }

  // Selection handling functions
  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(equipmentsList.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  // Update selectAll state when individual items are selected
  useEffect(() => {
    if (equipmentsList.length > 0) {
      setSelectAll(selectedItems.length === equipmentsList.length);
    }
  }, [selectedItems, equipmentsList]);

  const handlePrintSelected = () => {
    if (selectedItems.length > 0) {
      const selectedEquipments = equipmentsList.filter((item) =>
        selectedItems.includes(item.id)
      );
      setPrintMultipleQrModal(selectedEquipments);
    }
  };
  const handleClear = async () => {
    try {
      setEquipment_code("");
      setEquipment_name("");
      setSelectedCategory(null);
      setSearchCode("");
      setSearchName("");
      setCurrentPage(1);
      // await fetchEquipments(1); // รีเฟรชข้อมูลที่หน้า 1
    } catch (error) {
      console.error("Clear search errors:", error);
    }
  };
  return (
    <div id="items">
      {addItemModal ? (
        <AddItemModal
          refresh={fetchEquipments}
          onClose={() => setAddItemModal(false)}
        />
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-[18px] font-bold text-[#4E5155]">
              รายการครุภัณฑ์
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-start items-center gap-x-4">
              <button
                type="button"
                onClick={() => setAddEquipmentTypeModal(true)}
                className="flex items-center gap-x-1 cursor-pointer rounded-[5px] px-3.5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]"
              >
                <HiOutlinePlusSmall size={22} /> <span>เพิ่มครุภัณฑ์</span>
              </button>
            </div>
            <form className="mb-6 flex justify-between items-center" action="">
              <div className="flex items-center gap-x-4">
                <div className="flex items-center w-[250px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none">
                  <PiScanLight size={25} color="#4E5155" />
                  <input
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="w-full text-[#4E5155] duration-300 focus:outline-none"
                    type="text"
                    placeholder="ค้นหาด้วยรหัส"
                  />
                </div>
                <div className="flex items-center w-[250px] gap-x-4 border border-gray-300 rounded-[5px] px-3 py-2 duration-300 focus-within:outline-1 outline-green-300 focus-within:ring-2 ring-[#1BC688] focus-within:border-none">
                  <IoSearchOutline size={20} color="#4E5155" />
                  <input
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full text-[#4E5155] duration-300 focus:outline-none"
                    type="text"
                    placeholder="ค้นหาด้วยชื่อ"
                  />
                </div>

                <Select
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      width: "250px",
                      minHeight: "40px",
                      height: "40px",
                      borderRadius: "5px",
                      borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                      boxShadow: state.isFocused
                        ? "0 0 0 1.5px #1BC688"
                        : "none",
                      fontSize: "15px",
                      color: "#4E5155",
                      transition: "border-color 0.2s",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#868686",
                    }),
                  }}
                  options={categoriesList}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="เลือกหมวดหมู่"
                />
                {/* <Select styles={{
                            control: (base) => ({
                                ...base,
                                width: '180px',
                                minHeight: '44px',
                                height: '44px',
                                borderRadius: '5px',
                                borderColor: '#D1D5DB',
                                fontSize: '16px',
                                color: '#4E5155',
                            }),
                        }} options={optionStatus} placeholder="เลือกสถานะ" /> */}
              </div>
              <div className="flex items-stretch gap-x-4">
                <button
                  onClick={handleClear}
                  type="button"
                  className="flex items-center justify-center gap-x-2 h-[40px] text-[14px] px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-[5px] font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                >
                  <span><IoRefresh size={20} className='text-gray-500' /></span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintSelected}
                  disabled={selectedItems.length === 0}
                  className={`flex items-center gap-x-2 cursor-pointer rounded-[5px] px-4 py-2 text-gray-600 duration-200 ${selectedItems.length === 0
                    ? "bg-slate-50 border border-gray-300 cursor-not-allowed"
                    : "bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                    }`}
                >
                  <PiScanLight size={20} />
                  <span className="text-sm">QR Code ({selectedItems.length})</span>
                </button>
              </div>
            </form>
          </div>
          <div>
            {loading ? (
              <DataLoading />
            ) : equipmentsList.length === 0 ? (
              <div className="h-[180px] flex flex-col justify-center items-center tracking-[.5px]">
                <div className="mb-3">
                  <FaLayerGroup size={48} className="mx-auto text-[#E5E7EB]" />
                </div>
                <p className="text-[16px] text-[#6B7280] mb-2">
                  ยังไม่มีครุภัณฑ์ในระบบขณะนี้
                </p>
                <p className="text-[14px] text-[#9CA3AF]">
                  กรุณาเพิ่มข้อมูลครุภัณฑ์ใหม่
                </p>
              </div>
            ) : (
              <div>
                <table className="w-full tracking-[.5px] text-left border-collapse">
                  <thead className="bg-slate-50 border border-gray-300">
                    <tr className="text-sm text-gray-700">
                      <th className="font-light px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="size-4 accent-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="font-light px-4 py-3">
                        <span className="cursor-pointer inline-flex items-center gap-x-2">
                          รหัสครุภัณฑ์
                        </span>
                      </th>
                      <th className="font-light px-4 py-3">
                        <span className="cursor-pointer inline-flex items-center gap-x-2">
                          หมายเลขซีเรียล
                        </span>
                      </th>
                      <th className="font-light px-4 py-3">
                        <span className="cursor-pointer inline-flex items-center gap-x-2">
                          ชื่อครุภัณฑ์
                        </span>
                      </th>
                      <th className="font-light px-4 py-3">
                        <span className="cursor-pointer inline-flex items-center gap-x-2">
                          หมวดหมู่
                        </span>
                      </th>
                      {/* <th className='font-light px-4 py-3'><span className='cursor-pointer inline-flex items-center gap-x-2'>
                                    ที่จัดเก็บ
                                </span></th> */}
                      <th className="font-light px-4 py-3">
                        <span className="cursor-pointer inline-flex items-center gap-x-2">
                          สถานะ
                        </span>
                      </th>
                      {/* <th className="font-light px-4 py-3">
                        <span className="cursor-pointer inline-flex items-center gap-x-2">
                          การใช้งาน
                        </span>
                      </th> */}
                      <th className="text-center font-light px-4 py-3 rounded-r-[3px]">
                        จัดการครุภัณฑ์
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentsList.map((equipment) => (
                      <tr
                        key={equipment.id}
                        className="border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(equipment.id)}
                            onChange={() => handleSelectItem(equipment.id)}
                            className="size-4 accent-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-4">{equipment.equipment_code}</td>
                        <td className="p-4">
                          {equipment.serial_number || "-"}
                        </td>
                        <td className="p-4">{equipment.equipment_name}</td>
                        <td className="p-4">{equipment.category_name}</td>
                        {/* <td className='p-4'>{equipment.building_name} ห้อง {equipment.room_number}</td> */}
                        <td className="p-4">
                          {statusMap[equipment.usage_name] && (
                            <div
                              className={`inline-flex items-center w-[100px] gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${statusMap[equipment.usage_name].bg
                                } ${statusMap[equipment.usage_name].text}`}
                            >
                              <div
                                className={`size-2 rounded-full ${statusMap[equipment.usage_name].dot
                                  }`}
                              ></div>
                              <span className="text-xs font-medium tracking-wide">
                                {statusMap[equipment.usage_name].label}
                              </span>
                            </div>
                          )}
                        </td>
                        {/* <td className="p-4">
                          {statusColor[equipment.is_active] && (
                            <div
                              className={`inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${statusColor[equipment.is_active].bg
                                } ${statusColor[equipment.is_active].text}`}
                            >
                              <div
                                className={`size-2 rounded-full ${statusColor[equipment.is_active].dot
                                  }`}
                              ></div>
                              <span className="text-xs font-medium tracking-wide">
                                {statusColor[equipment.is_active].label}
                              </span>
                            </div>
                          )}
                        </td> */}
                        <td className="p-4">
                          <div className="flex items-center gap-x-4">
                            <button
                              onClick={() => setItemDetailModal(equipment)}
                              className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]"
                            >
                              <IoIosInformationCircleOutline className="text-gray-600" size={20} />
                            </button>
                            <button
                              onClick={() => setEditItemModal(equipment)}
                              className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]"
                            >
                              <CiEdit className="text-gray-600" size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(equipment.id)}
                              className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014]"
                            >
                              <PiTrashLight className="text-gray-600" size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {equipmentsList.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-gray-600 space-x-1 text-sm">
                      <span>แสดง</span>{" "}
                      <span>{(currentPage - 1) * itemsPerPage + 1}</span>
                      <span>ถึง</span>{" "}
                      <span>
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                      </span>
                      <span>จาก</span> <span>{totalItems}</span>{" "}
                      <span>รายการ</span>
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {editItemModal && (
        <EditItemModal
          refresh={fetchEquipments}
          equipment={editItemModal}
          onClose={() => setEditItemModal(null)}
        />
      )}
      {printQrModal && (
        <PrintQrModal
          item={printQrModal}
          onClose={() => setPrintQrModal(null)}
        />
      )}
      {printMultipleQrModal && (
        <PrintMultipleQrModal
          equipments={printMultipleQrModal}
          onClose={() => setPrintMultipleQrModal(false)}
        />
      )}
      {itemDetailModal && (
        <ItemDetailModal
          equipment={itemDetailModal}
          onClose={() => setItemDetailModal(null)}
        />
      )}
      {submitLoading && <SubmitLoading />}
      {addEquipmentTypeModal && (
        <AddEquipmentTypeModal
          addOneEquipment={() => setAddItemModal(true)}
          addBulkEquipment={() => router.push("/staff/equipment/bulk-upload")}
          onClose={() => setAddEquipmentTypeModal(false)}
        />
      )}
    </div>
  );
}

export function AddEquipmentTypeModal({
  onClose,
  addOneEquipment,
  addBulkEquipment,
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ตัวอย่างฟังก์ชันสำหรับแต่ละตัวเลือก (ต้องไปเชื่อมต่อกับ modal จริง)
  const handleAddSingle = () => {
    addOneEquipment();
    onClose();
  };
  const handleAddBulk = () => {
    addBulkEquipment();
    onClose();
    // ไปหน้าอัปโหลดไฟล์ หรือเปิด modal สำหรับ bulk
    // router.push('/staff/manage-students/add-students') หรือฟังก์ชันที่เหมาะสม
  };

  return (
    <div id="type-add-equipment-modal">
      <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
        <div className="tracking-[.5px] min-w-[400px] max-w-[500px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
          <div className="flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4">
            <div className="flex items-center gap-x-2">
              <h2 className="text-[18px] font-bold text-[#4E5155]">
                เลือกวิธีการเพิ่มครุภัณฑ์
              </h2>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]"
            >
              <RxCross2 size={20} color="#454545" />
            </button>
          </div>
          <div className="px-6">
            <div className="flex flex-col gap-y-4 mt-2">
              <button
                onClick={handleAddSingle}
                className="cursor-pointer flex items-center gap-x-3 w-full px-4 py-3 border border-gray-300 rounded-[5px]  hover:border-[#1bc688]  transition group"
              >
                <HiOutlinePlusSmall
                  size={30}
                  className="text-[#1BC688] duration-300 group-hover:scale-125"
                />
                <div className="flex flex-col items-start text-left">
                  <span className="text-base text-[#1BC688]">
                    เพิ่มทีละชิ้น
                  </span>
                  <span className="text-gray-600 text-sm">
                    กรอกข้อมูลครุภัณฑ์ทีละรายการ
                  </span>
                </div>
                <SlArrowRight className="ml-auto text-gray-400 group-hover:text-[#1BC688]" />
              </button>
              <button
                onClick={handleAddBulk}
                className="cursor-pointer flex items-center gap-x-3 w-full px-4 py-3 border border-gray-300 rounded-[5px]  hover:border-[#1bc688]  transition group"
              >
                <PiFileCsvLight
                  size={30}
                  className="text-[#1BC688] duration-300 group-hover:scale-125"
                />
                <div className="flex flex-col items-start text-left">
                  <span className="text-base text-[#1BC688]">
                    เพิ่มแบบกลุ่ม (CSV)
                  </span>
                  <span className="text-gray-600 text-sm">
                    นำเข้าไฟล์ .csv เพื่อเพิ่มครุภัณฑ์หลายรายการ
                  </span>
                </div>
                <SlArrowRight className="ml-auto text-gray-400 group-hover:text-[#1BC688]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddItemModal({ onClose, refresh }) {
  const [equipment_name, setEquipment_name] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial_number, setSerial_number] = useState("");
  const [purchase_date, setPurchase_date] = useState(null);
  const [purchase_price, setPurchase_price] = useState("");
  const [vendor, setVendor] = useState("");
  const [warranty_period, setWarranty_period] = useState("");
  const [warranty_end_date, setWarranty_end_date] = useState(null);
  const [depreciation_rate, setDepreciation_rate] = useState("");
  const [current_value, setCurrent_value] = useState("");
  const [asset_group, setAsset_group] = useState("");
  const [description, setDescription] = useState("");
  const [is_active, setIsActive] = useState(1);
  const [conditionOptions, setConditionOptions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const fetchConditionStatus = async () => {
    try {
      const response = await axios.get(
        "/api/staff/equipment/status/condition-status"
      );
      const conditionNameTH = {
        excellent: "ดีมาก",
        good: "ดี",
        fair: "พอใช้",
        poor: "ชำรุด",
        broken: "เสีย",
      };
      const options = response.data.map((status) => ({
        value: status.condition_name,
        label: conditionNameTH[status.condition_name] || status.condition_name,
      }));
      setConditionOptions(options);
    } catch (error) {
      console.error("Fetch condition status error:", error);
    }
  };
  const [usageOptions, setUsageOptions] = useState([]);
  const [selectedUsage, setSelectedUsage] = useState(null);
  const fetchUsageStatus = async () => {
    try {
      const response = await axios.get(
        "/api/staff/equipment/status/usage-status"
      );
      const usageNameTH = {
        available: "ว่าง",
        borrowed: "กำลังยืม",
        repair: "ซ่อมแซม",
        retired: "นำออก",
        active: "ใช้งาน",
        cancelled: "ยกเลิก",
        selled: "ขายแล้ว",
      };
      const options = response.data.map((status) => ({
        value: status.usage_name,
        label: usageNameTH[status.usage_name] || status.usage_name,
      }));
      setUsageOptions(options);
    } catch (error) {
      console.error("Fetch usage status error:", error);
    }
  };
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get("/api/staff/equipment-category");
      setCategoriesOptions(
        response.data.map((category) => ({
          value: category.id,
          label: category.categoryName,
        }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const fetchFacultyOptions = async () => {
    try {
      const response = await axios.get("/api/staff/faculty");
      setFacultyOptions(
        response.data.map((faculty) => ({
          value: faculty.id,
          label: faculty.faculty_name,
        }))
      );
    } catch (error) {
      console.error("Fetch faculty options error:", error);
    }
  };
  const [majorOptions, setMajorOptions] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const fetchMajorByFacultyId = useCallback(async (facultyId) => {
    try {
      const response = await axios.get(
        `/api/staff/major/${encodeURIComponent(facultyId)}`
      );
      const options = response.data.map((major) => ({
        value: major.id,
        label: major.major_name,
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
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const fetchBuildingOptions = async () => {
    try {
      const response = await axios.get("/api/staff/building");
      const result = response.data;
      setBuildingOptions(
        result.map((building) => ({
          value: building.id,
          label: building.building_code,
        }))
      );
    } catch (error) {
      console.error("Fetch building options error:", error);
    }
  };
  const [floorOptions, setFloorOptions] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const fetchFloorListByBuildingId = async (buildingId) => {
    try {
      const response = await axios.get(
        `/api/staff/floor/building/${encodeURIComponent(buildingId)}`
      );
      setFloorOptions(
        response.data.map((floor) => ({
          value: floor.id,
          label: `ชั้น ${floor.floor_number} - ${floor.description}`,
        }))
      );
    } catch (error) {
      console.error("Fetch floor list by building error:", error);
    }
  };
  const [roomOptions, setRoomOptions] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const fetchRoomListByFloorId = async (floorId) => {
    try {
      const response = await axios.get(
        `/api/staff/room/floor/${encodeURIComponent(floorId)}`
      );
      setRoomOptions(
        response.data.map((room) => ({
          value: room.id,
          label: `${room.room_number} - ${room.room_name}`,
        }))
      );
    } catch (error) {
      console.error("Fetch room list by floor error:", error);
    }
  };
  // useEffect สำหรับเมื่อ selectedBuilding เปลี่ยน
  useEffect(() => {
    if (selectedBuilding?.value) {
      setFloorOptions([]);
      setSelectedFloor(null);
      fetchFloorListByBuildingId(selectedBuilding.value);
    } else {
      setFloorOptions([]);
      setSelectedFloor(null);
    }
  }, [selectedBuilding]);
  useEffect(() => {
    if (selectedFloor?.value) {
      setRoomOptions([]);
      setSelectedRoom(null);
      fetchRoomListByFloorId(selectedFloor.value);
    } else {
      setRoomOptions([]);
      setSelectedRoom(null);
    }
  }, [selectedFloor]);
  useEffect(() => {
    fetchCategories();
    fetchBuildingOptions();
    fetchFacultyOptions();
    fetchConditionStatus();
    fetchUsageStatus();
  }, []);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
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
      text = message || "ไม่พบข้อมูลที่ต้องการในระบบ";
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
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (
        equipment_name &&
        selectedCategory &&
        selectedBuilding &&
        selectedFloor &&
        selectedRoom &&
        selectedCondition &&
        selectedUsage &&
        purchase_date &&
        purchase_price &&
        vendor &&
        depreciation_rate &&
        asset_group &&
        description &&
        brand &&
        model &&
        serial_number &&
        warranty_end_date &&
        warranty_period &&
        current_value &&
        selectedFaculty &&
        selectedMajor &&
        is_active !== null
      ) {
        const confirmed = await Swal.fire({
          title: "ยืนยันการเพิ่มครุภัณฑ์",
          text: `การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
          icon: "warning",
          confirmButtonText: "ยืนยัน",
          confirmButtonColor: "#d9534f",
          showCancelButton: true,
          cancelButtonColor: "#6B7280",
          cancelButtonText: "ยกเลิก",
          customClass: {
            container: "z-[10000]",
          },
        });
        if (!confirmed.isConfirmed) return;
      }
      const formData = new FormData();
      formData.append("equipment_name", equipment_name);
      formData.append("brand", brand);
      formData.append("model", model);
      formData.append("serial_number", serial_number);
      formData.append(
        "category_id",
        selectedCategory ? selectedCategory.value : ""
      );
      formData.append("room_id", selectedRoom ? selectedRoom.value : "");
      // formData.append(
      //   "purchase_date",
      //   purchase_date ? purchase_date.toISOString().split("T")[0] : ""
      // );
      formData.append(
        "purchase_date",
        purchase_date ? DateTime.fromJSDate(purchase_date).toFormat('yyyy-MM-dd') : ""
      );
      formData.append("purchase_price", parseFloat(purchase_price));
      formData.append("vendor", vendor);
      formData.append("warranty_period", Number(warranty_period));
      // formData.append(
      //   "warranty_end_date",
      //   warranty_end_date ? warranty_end_date.toISOString().split("T")[0] : ""
      // );
      formData.append(
        "warranty_end_date",
        warranty_end_date ? DateTime.fromJSDate(warranty_end_date).toFormat('yyyy-MM-dd') : ""
      );
      formData.append("depreciation_rate", parseFloat(depreciation_rate));
      formData.append("current_value", parseFloat(current_value));
      formData.append(
        "condition_status",
        selectedCondition ? selectedCondition.value : ""
      );
      formData.append("usage_status", selectedUsage ? selectedUsage.value : "");
      formData.append("asset_group", asset_group);
      formData.append("description", description);
      formData.append("major_id", selectedMajor ? selectedMajor.value : "");
      /* 3 อันนี้รอก่อน */
      formData.append("requires_approval", true);
      formData.append("is_active", is_active);
      // formData.append('set_id', null);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      setSubmitLoading(true);
      const response = await axios.post("/api/staff/equipment", formData);
      const result = response.data;
      setSubmitLoading(false);
      await Swal.fire({
        icon: "success",
        title: result?.message || "เพิ่มอุปกรณ์สำเร็จ",
        confirmButtonText: "ตกลง",
      });
      onClose();
      refresh();
    } catch (error) {
      console.error(
        "Error adding equipment:",
        error.response?.data?.message || error.message
      );
      await showAlertByStatus(
        error.response?.status,
        error.response?.data?.message
      );
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <div id="addItem-modal">
      <div className="mb-6">
        <div className="flex items-center gap-x-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-[5px] px-3 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200"
          >
            <span className="flex items-center gap-x-2">
              <SlArrowLeft color="#4E5155" /> ย้อนกลับ
            </span>
          </button>
          <h2 className="text-[18px] font-bold text-[#4E5155]">
            เพิ่มครุภัณฑ์
          </h2>
        </div>
      </div>
      <div className="">
        <form onSubmit={handleSubmit} action="">
          <div className="mb-6 p-4 border border-[#E0E0E0] rounded-[5px] shadow-[0px_5px_10px_#00000014]">
            <div className="mb-4 ">
              <h2 className="text-[18px] font-bold text-[#4E5155]">
                1. ข้อมูลหลัก
              </h2>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-x-6">
                <div className="flex flex-col gap-y-2 mb-4">
                  <label className="text-gray-600" htmlFor="equipmentName">
                    ชื่อครุภัณฑ์
                  </label>
                  <input
                    className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                    placeholder="ชื่อครุภัณฑ์"
                    type="text"
                    id="equipmentName"
                    name="equipmentName"
                    autoFocus
                    onChange={(e) => setEquipment_name(e.target.value)}
                    value={equipment_name}
                  />
                </div>
                {/* <div className='flex flex-col gap-y-2 mb-4'>
                                    <label className='text-gray-600' htmlFor="equipmentId">รหัสครุภัณฑ์</label>
                                    <input
                                        className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
                                        placeholder='รหัสครุภัณฑ์'
                                        type="text"
                                        id="equipmentId"
                                        name="equipmentId"
                                    />
                                </div> */}
                <div className="flex flex-col gap-y-2 mb-4">
                  <label className="text-gray-600" htmlFor="equipmentBrand">
                    ยี่ห้อ
                  </label>
                  <input
                    className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                    placeholder="ยี่ห้อ"
                    type="text"
                    id="equipmentBrand"
                    name="equipmentBrand"
                    onChange={(e) => setBrand(e.target.value)}
                    value={brand}
                  />
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                  <label className="text-gray-600" htmlFor="equipmentModel">
                    รุ่น
                  </label>
                  <input
                    className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                    placeholder="รุ่น"
                    type="text"
                    id="equipmentModel"
                    name="equipmentModel"
                    onChange={(e) => setModel(e.target.value)}
                    value={model}
                  />
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                  <label className="text-gray-600" htmlFor="equipmentSerial">
                    Serial Number
                  </label>
                  <input
                    className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                    placeholder="Serial Number"
                    type="text"
                    id="equipmentSerial"
                    name="equipmentSerial"
                    onChange={(e) => setSerial_number(e.target.value)}
                    value={serial_number}
                  />
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                  <label className="text-gray-600" htmlFor="asset_group">
                    กลุ่มครุภัณฑ์
                  </label>
                  <input
                    className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                    placeholder="กลุ่มครุภัณฑ์"
                    type="text"
                    id="asset_group"
                    name="asset_group"
                    onChange={(e) => setAsset_group(e.target.value)}
                    value={asset_group}
                  />
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                  <label className="text-gray-600" htmlFor="category">
                    หมวดหมู่
                  </label>
                  <Select
                    inputId="category"
                    name="category"
                    options={categoriesOptions}
                    onChange={setSelectedCategory}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: "40px",
                        height: "40px",
                        borderRadius: "5px",
                        borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                        boxShadow: state.isFocused
                          ? "0 0 0 1.5px #1BC688"
                          : "none",
                        fontSize: "15px",
                        color: "#4E5155",
                        transition: "border-color 0.2s",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#868686",
                      }),
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-y-2 mb-4">
                <label className="text-gray-600" htmlFor="equipmentDescription">
                  รายละเอียด
                </label>
                <textarea
                  className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                  placeholder="รายละเอียด"
                  type="text"
                  id="equipmentDescription"
                  name="equipmentDescription"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </div>
            </div>
          </div>
          <div className="mb-6 p-4 border border-[#E0E0E0] rounded-[5px] shadow-[0px_5px_10px_#00000014]">
            <div className="mb-4 ">
              <h2 className="text-[18px] font-bold text-[#4E5155]">
                2. ข้อมูลการจัดซื้อ
              </h2>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-x-6">
                <div className="flex flex-col gap-y-2 mb-4">
                  <label className="text-gray-600" htmlFor="">
                    วันที่จัดซื้อ
                  </label>
                  {/* <DateTimePicker
                    value={purchase_date}
                    onChange={setPurchase_date}
                    placeholderText="เลือกวันและเวลา"
                  /> */}
                  <DatePickerInput
                    value={purchase_date}
                    dateFormat="dd/MM/yyyy"
                    onChange={setPurchase_date}
                    placeholderText="เลือกวันและเวลา"
                  />
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                  <label className="text-gray-600" htmlFor="">
                    วันที่สิ้นสุดประกัน
                  </label>
                  {/* <DateTimePicker
                    value={warranty_end_date}
                    onChange={setWarranty_end_date}
                    placeholderText="เลือกวันและเวลา"
                  /> */}
                  <DatePickerInput
                    value={warranty_end_date}
                    dateFormat="dd/MM/yyyy"
                    onChange={setWarranty_end_date}
                    placeholderText="เลือกวันและเวลา"
                  />
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                  <label className="text-gray-600" htmlFor="equipmentBrand">
                    ผู้ขายหรือบริษัท
                  </label>
                  <input
                    className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                    placeholder="ผู้ขายหรือบริษัท"
                    type="text"
                    id="equipmentBrand"
                    name="equipmentBrand"
                    onChange={(e) => setVendor(e.target.value)}
                    value={vendor}
                  />
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                  <label className="text-gray-600" htmlFor="equipmentPrice">
                    ราคาครุภัณฑ์
                  </label>
                  <input
                    className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                    placeholder="ราคาครุภัณฑ์"
                    type="text"
                    id="equipmentPrice"
                    name="equipmentPrice"
                    onChange={(e) => setPurchase_price(e.target.value)}
                    value={purchase_price}
                  />
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                  <label
                    className="text-gray-600"
                    htmlFor="equipmentCurrentValue"
                  >
                    มูลค่าปัจจุบัน
                  </label>
                  <input
                    className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                    placeholder="มูลค่าปัจจุบัน"
                    type="text"
                    id="equipmentCurrentValue"
                    name="equipmentCurrentValue"
                    onChange={(e) => setCurrent_value(e.target.value)}
                    value={current_value}
                  />
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                  <label className="text-gray-600" htmlFor="equipmentWarranty">
                    ระยะประกัน (เดือน)
                  </label>
                  <input
                    className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                    placeholder="ระยะประกัน (เดือน)"
                    type="text"
                    id="equipmentWarranty"
                    name="equipmentWarranty"
                    onChange={(e) => setWarranty_period(e.target.value)}
                    value={warranty_period}
                  />
                </div>
                <div className="flex flex-col gap-y-2 mb-4">
                  <label
                    className="text-gray-600"
                    htmlFor="equipmentDepreciation"
                  >
                    อัตราค่าเสื่อมราคา (% ต่อปี)
                  </label>
                  <input
                    className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                    placeholder="อัตราค่าเสื่อมราคา"
                    type="text"
                    id="equipmentDepreciation"
                    name="equipmentDepreciation"
                    onChange={(e) => setDepreciation_rate(e.target.value)}
                    value={depreciation_rate}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 p-4 border border-[#E0E0E0] rounded-[5px] shadow-[0px_5px_10px_#00000014]">
            <div className="mb-4 ">
              <h2 className="text-[18px] font-bold text-[#4E5155]">
                3. สถานะและที่จัดเก็บ
              </h2>
            </div>
            <div>
              <div className="grid grid-cols-4 gap-x-6">
                <div className="flex flex-col gap-y-3 mb-6">
                  <label>เลือกอาคาร</label>
                  <Select
                    options={buildingOptions}
                    value={selectedBuilding}
                    onChange={setSelectedBuilding}
                    className="flex-1 text-[15px]"
                    placeholder="เลือกอาคาร"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: "40px",
                        height: "40px",
                        borderRadius: "5px",
                        borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                        boxShadow: state.isFocused
                          ? "0 0 0 1.5px #1BC688"
                          : "none",
                        fontSize: "15px",
                        color: "#4E5155",
                        transition: "border-color 0.2s",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#868686",
                      }),
                    }}
                  />
                </div>
                <div className="flex flex-col gap-y-3 mb-6">
                  <label>เลือกชั้น</label>
                  <Select
                    options={floorOptions}
                    value={selectedFloor}
                    onChange={setSelectedFloor}
                    isDisabled={!selectedBuilding}
                    className="flex-1 text-[15px]"
                    placeholder="เลือกชั้น"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: "40px",
                        height: "40px",
                        borderRadius: "5px",
                        borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                        boxShadow: state.isFocused
                          ? "0 0 0 1.5px #1BC688"
                          : "none",
                        fontSize: "15px",
                        color: "#4E5155",
                        transition: "border-color 0.2s",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#868686",
                      }),
                    }}
                  />
                </div>
                <div className="flex flex-col gap-y-3 mb-6">
                  <label className="text-gray-600" htmlFor="">
                    ห้องที่จัดเก็บ
                  </label>
                  <div>
                    <Select
                      options={roomOptions}
                      onChange={setSelectedRoom}
                      value={selectedRoom}
                      isDisabled={!selectedFloor}
                      className="w-full"
                      placeholder="เลือกห้องที่จัดเก็บ"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: "40px",
                          height: "40px",
                          borderRadius: "5px",
                          borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                          boxShadow: state.isFocused
                            ? "0 0 0 1.5px #1BC688"
                            : "none",
                          fontSize: "15px",
                          color: "#4E5155",
                          transition: "border-color 0.2s",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#868686",
                        }),
                      }}
                    />
                  </div>
                </div>
                {/* <div className='flex flex-col gap-y-3 mb-6'>
                                    <label className='text-gray-600' htmlFor="">จัดเป็นชุดเซต (ถ้ามี)</label>
                                    <div>
                                        <Select
                                            className='w-full'
                                            placeholder='เลือกชุดเซต (ถ้ามี)'
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
                                </div> */}
                <div className="flex flex-col gap-y-3 mb-6">
                  <label className="text-gray-600" htmlFor="conditionStatus">
                    สภาพครุภัณฑ์
                  </label>
                  <div>
                    <Select
                      className="w-full"
                      options={conditionOptions}
                      onChange={setSelectedCondition}
                      value={selectedCondition}
                      id="conditionStatus"
                      name="conditionStatus"
                      placeholder="เลือกสภาพครุภัณฑ์"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: "40px",
                          height: "40px",
                          borderRadius: "5px",
                          borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                          boxShadow: state.isFocused
                            ? "0 0 0 1.5px #1BC688"
                            : "none",
                          fontSize: "15px",
                          color: "#4E5155",
                          transition: "border-color 0.2s",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#868686",
                        }),
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-y-3 mb-6">
                  <label className="text-gray-600" htmlFor="usageStatus">
                    สถานะการใช้งาน
                  </label>
                  <div>
                    <Select
                      className="w-full"
                      options={usageOptions}
                      onChange={setSelectedUsage}
                      value={selectedUsage}
                      id="usageStatus"
                      name="usageStatus"
                      placeholder="เลือกสถานะการใช้งาน"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: "40px",
                          height: "40px",
                          borderRadius: "5px",
                          borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                          boxShadow: state.isFocused
                            ? "0 0 0 1.5px #1BC688"
                            : "none",
                          fontSize: "15px",
                          color: "#4E5155",
                          transition: "border-color 0.2s",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#868686",
                        }),
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-y-3 mb-6">
                  <label htmlFor="faculty">คณะ</label>
                  <div>
                    <Select
                      options={facultyOptions}
                      onChange={setSelectedFaculty}
                      value={selectedFaculty}
                      className="w-full"
                      id="faculty"
                      name="faculty"
                      placeholder="เลือกคณะ"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: "40px",
                          height: "40px",
                          borderRadius: "5px",
                          borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                          boxShadow: state.isFocused
                            ? "0 0 0 1.5px #1BC688"
                            : "none",
                          fontSize: "15px",
                          color: "#4E5155",
                          transition: "border-color 0.2s",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#868686",
                        }),
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-y-3 mb-6">
                  <label htmlFor="major">สาขาวิชา</label>
                  <div>
                    <Select
                      options={majorOptions}
                      onChange={setSelectedMajor}
                      value={selectedMajor}
                      className="w-full"
                      id="major"
                      name="major"
                      placeholder="เลือกสาขาวิชา"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: "40px",
                          height: "40px",
                          borderRadius: "5px",
                          borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                          boxShadow: state.isFocused
                            ? "0 0 0 1.5px #1BC688"
                            : "none",
                          fontSize: "15px",
                          color: "#4E5155",
                          transition: "border-color 0.2s",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#868686",
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 p-4 border border-[#E0E0E0] rounded-[5px] shadow-[0px_5px_10px_#00000014]">
            <div className="mb-4 ">
              <h2 className="text-[18px] font-bold text-[#4E5155]">
                4. ข้อมูลอื่นๆ
              </h2>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-x-6">
                <div className="flex flex-col gap-y-6 mb-6">
                  <label className="text-gray-600" htmlFor="">
                    แนบรูปภาพครุภัณฑ์
                  </label>
                  <div>
                    <label
                      htmlFor="equipmentImgFile"
                      className=" px-4 py-2 bg-[#F3F4F6] text-gray-600 rounded-[5px] border border-[#E0E0E0] cursor-pointer hover:bg-[#e5e7eb] transition"
                    >
                      {imageFileName ? imageFileName : "เลือกไฟล์รูปภาพ"}
                    </label>
                    <input
                      id="equipmentImgFile"
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-x-4 mb-2">
                  <label className="text-gray-600" htmlFor="">
                    สถานะการใช้งาน
                  </label>
                  <ActiveSwitch
                    checked={is_active}
                    onChange={setIsActive}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] "
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
      {submitLoading && <SubmitLoading />}
    </div>
  );
}

export function ItemDetailModal({ equipment, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const [equipmentById, setEquipmentById] = useState(null);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const fetchEquipmentById = async (id) => {
    try {
      setEquipmentLoading(true);
      const response = await axios.get(
        `/api/staff/equipment/${encodeURIComponent(id)}`
      );
      setEquipmentById(response.data);
      setEquipmentLoading(false);
    } catch (error) {
      console.error("Fetch equipment by ID error:", error);
    } finally {
      setEquipmentLoading(false);
    }
  };
  useEffect(() => {
    fetchEquipmentById(equipment.id);
  }, []);
  const fmt = (time) => dayjs(time).format("DD/MM/YYYY");
  const conditionNameTH = {
    excellent: "สมบูรณ์",
    good: "ดี",
    fair: "พอใช้",
    poor: "ชำรุด",
    broken: "เสียหาย",
  };
  const usageNameTH = {
    available: "พร้อมใช้งาน",
    borrowed: "ถูกยืม",
    repair: "กำลังซ่อม",
    retired: "นำออก",
    active: "ใช้งานอยู่",
    cancelled: "ยกเลิก",
    selled: "ขายแล้ว",
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const openPreview = (src) => {
    setPreviewSrc(src);
    setPreviewOpen(true);
  };
  const closePreview = () => {
    setPreviewSrc(null);
    setPreviewOpen(false);
  };
  return (
    <div id="itemDetail-modal">
      <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
        <div className="tracking-[.5px] min-w-[600px] max-w-[800px] w-full bg-white rounded-[5px] pt-6 shadow-xl relative">
          <div className="flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-6 mb-6">
            <div className="flex items-center gap-x-2">
              <h2 className="text-[18px] font-bold text-[#4E5155]">
                รายละเอียดครุภัณฑ์
              </h2>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]"
            >
              <RxCross2 size={20} color="#454545" />
            </button>
          </div>
          <div className="px-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <div className="mb-6 bg-white border border-gray-300 p-6 rounded-[5px] shadow-sm transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-x-4 mb-6">
                  <div className="size-10 border  border-green-400 rounded-full flex items-center justify-center">
                    <PiNewspaper size={20} className='text-green-600' />

                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-[.5px] text-gray-700 mb-1">
                      ข้อมูลหลัก
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      ชื่อครุภัณฑ์
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.equipment_name || "ไม่มีชื่อครุภัณฑ์"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      รหัสครุภัณฑ์
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.equipment_code || "ไม่มีรหัสครุภัณฑ์"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      หมายเลขซีเรียล
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.serial_number || "ไม่มีหมายเลขซีเรียล"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      ยี่ห้อ
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.brand || "ยังไม่ระบุยี่ห้อ"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      รุ่น
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.model || "ยังไม่ระบุรุ่น"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      กลุ่มครุภัณฑ์
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.asset_group || "ยังไม่ระบุกลุ่มครุภัณฑ์"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      รายละเอียด
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.description || "ยังไม่ระบุรายละเอียด"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      หมวดหมู่
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.category_name || "ยังไม่ระบุหมวดหมู่"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-6 bg-white border border-gray-300 p-6 rounded-[5px] shadow-sm transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-x-4 mb-6">
                  <div className="size-10 border  border-green-400 rounded-full flex items-center justify-center">
                    <BsCart2 size={20} className='text-green-600' />

                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-[.5px] text-gray-700 mb-1">
                      ข้อมูลการจัดซื้อ
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      วันที่จัดซื้อ
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.purchase_date
                        ? fmt(equipmentById?.purchase_date)
                        : "ยังไม่ระบุวันที่จัดซื้อ"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      วันที่สิ้นสุดประกัน
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.warranty_end_date
                        ? fmt(equipmentById?.warranty_end_date)
                        : "ยังไม่ระบุวันที่สิ้นสุดประกัน"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      ผู้ขายหรือบริษัท
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.vendor || "ยังไม่ระบุผู้ขายหรือบริษัท"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      ราคาครุภัณฑ์
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.purchase_price ||
                        "ยังไม่ระบุราคาครุภัณฑ์"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      มูลค่าปัจจุบัน
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.current_value ||
                        "ยังไม่ระบุมูลค่าปัจจุบัน"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      ระยะประกัน (เดือน)
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.warranty_period || "ยังไม่ระบุระยะประกัน"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      อัตราค่าเสื่อมราคา (% ต่อปี)
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.depreciation_rate ||
                        "ยังไม่ระบุอัตราค่าเสื่อมราคา"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-6 bg-white border border-gray-300 p-6 rounded-[5px] shadow-sm transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-x-4 mb-6">
                  <div className="size-10 border  border-green-400 rounded-full flex items-center justify-center">
                    <IoLocationOutline size={20} className='text-green-600' />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-[.5px] text-gray-700 mb-1">
                      สถานะและที่จัดเก็บ
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      อาคาร
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.building_name || "ยังไม่ระบุอาคาร"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      ชั้น
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.floor_number || "ยังไม่ระบุชั้น"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      ห้อง
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.room_number || "ยังไม่ระบุห้อง"}
                    </p>
                  </div>
                  {/* <div className='flex flex-col gap-y-1'>
                                        <label className='text-gray-500 text-sm' htmlFor="">จัดเป็นชุดเซต (ถ้ามี)</label>
                                        <p className='text-slate-700 text-base'>{equipmentById?.asset_group || 'ยังไม่ระบุชุดเซต'}</p>
                                    </div> */}
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      สภาพครุภัณฑ์
                    </label>
                    <p className="text-slate-700 text-base">
                      {conditionNameTH[equipmentById?.condition_name] ||
                        "ยังไม่ระบุสภาพครุภัณฑ์"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      สถานะการใช้งาน
                    </label>
                    <p className="text-slate-700 text-base">
                      {usageNameTH[equipmentById?.usage_name] ||
                        "ยังไม่ระบุสถานะการใช้งาน"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      คณะ
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.faculty_name || "ยังไม่ระบุคณะ"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      สาขาวิชา
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.major_name || "ยังไม่ระบุสาขาวิชา"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-6 bg-white border border-gray-300 p-6 rounded-[5px] shadow-sm transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-x-4 mb-6">
                  <div className="size-10 border  border-green-400 rounded-full flex items-center justify-center">
                    <PiNewspaper size={20} className='text-green-600' />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-[.5px] text-gray-700 mb-1">
                      ข้อมูลอื่นๆ
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      สถานะการใช้งาน
                    </label>
                    <p className="text-slate-700 text-base">
                      {equipmentById?.is_active ? "ใช้งาน" : "ไม่ใช้งาน"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-gray-500 text-sm" htmlFor="">
                      รูปภาพ
                    </label>
                    <p
                      onClick={() => openPreview(equipmentById?.image_path)}
                      className={`${equipmentById?.image_path
                        ? "text-blue-500 cursor-pointer"
                        : "text-slate-700"
                        }`}
                    >
                      {equipmentById?.image_path
                        ? "ดูรูปภาพ"
                        : "ไม่ได้ระบุรูปภาพ"}
                    </p>
                  </div>
                </div>
              </div>
              <div className='mb-6 flex justify-end'>
                <button type='button' onClick={onClose} className='cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center bg-[rgba(0,0,0,0.4)]"
          onClick={closePreview}
        >
          <div className="relative max-w-[60vw] max-h-[80vh]">
            <button
              onClick={closePreview}
              className="cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB] absolute top-5 right-5"
            >
              <RxCross2 size={20} color="#454545" />
            </button>
            <img
              src={previewSrc}
              alt="preview"
              className="max-w-full max-h-[80vh] rounded"
            />
          </div>
        </div>
      )}
      {equipmentLoading && <SubmitLoading />}
    </div>
  );
}

export function EditItemModal({ equipment, onClose, refresh }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [equipmentData, setEquipmentData] = useState(null);
  const [equipment_name, setEquipment_name] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial_number, setSerial_number] = useState("");
  const [purchase_date, setPurchase_date] = useState(null);
  const [purchase_price, setPurchase_price] = useState("");
  const [vendor, setVendor] = useState("");
  const [warranty_period, setWarranty_period] = useState("");
  const [warranty_end_date, setWarranty_end_date] = useState(null);
  const [depreciation_rate, setDepreciation_rate] = useState("");
  const [current_value, setCurrent_value] = useState("");
  const [asset_group, setAsset_group] = useState("");
  const [description, setDescription] = useState("");
  const [conditionOptions, setConditionOptions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [is_active, setIsActive] = useState(1);

  const fetchConditionStatus = async () => {
    try {
      const response = await axios.get(
        "/api/staff/equipment/status/condition-status"
      );
      const result = response.data;
      const conditionNameTH = {
        excellent: "ดีมาก",
        good: "ดี",
        fair: "พอใช้",
        poor: "ชำรุด",
        broken: "เสีย",
      };
      const options = result.map((status) => ({
        value: status.condition_name,
        label: conditionNameTH[status.condition_name] || status.condition_name,
      }));
      const foundCondition = options.find(
        (c) => c.value === equipmentData?.condition_name
      );
      setConditionOptions(options);
      setSelectedCondition(foundCondition || null);
    } catch (error) {
      console.error("Fetch condition status error:", error);
    }
  };
  const [usageOptions, setUsageOptions] = useState([]);
  const [selectedUsage, setSelectedUsage] = useState(null);

  const fetchUsageStatus = async () => {
    try {
      const response = await axios.get(
        "/api/staff/equipment/status/usage-status"
      );
      const result = response.data;
      const usageNameTH = {
        available: "ว่าง",
        borrowed: "กำลังยืม",
        repair: "ซ่อมแซม",
        retired: "นำออก",
        active: "ใช้งาน",
        cancelled: "ยกเลิก",
        selled: "ขายแล้ว",
      };
      const options = result.map((status) => ({
        value: status.usage_name,
        label: usageNameTH[status.usage_name] || status.usage_name,
      }));
      const foundUsage = options.find(
        (u) => u.value === equipmentData?.usage_name
      );
      setUsageOptions(options);
      setSelectedUsage(foundUsage || null);
    } catch (error) {
      console.error("Fetch usage status error:", error);
    }
  };
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/staff/equipment-category");
      // setCategoriesOptions(response.data.map(category => ({
      //     value: category.id,
      //     label: category.categoryName
      // })));
      const result = response.data;
      const options = result.map((category) => ({
        value: category.id,
        label: category.categoryName,
      }));
      const foundCategory = options.find(
        (cat) => cat.value === equipmentData?.category_id
      );
      setCategoriesOptions(options);
      setSelectedCategory(foundCategory || null);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchEquipmentById = async () => {
    try {
      const response = await axios.get(
        `/api/staff/equipment/${encodeURIComponent(equipment.id)}`
      );
      setEquipmentData(response.data);
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const fetchBuildingOptions = async () => {
    try {
      const response = await axios.get("/api/staff/building");
      const result = response.data;
      // setBuildingOptions(result.map((building) => ({
      //     value: building.id,
      //     label: building.building_code
      // })));
      const options = result.map((building) => ({
        value: building.id,
        label: building.building_code,
      }));
      const foundBuilding = options.find(
        (b) => b.value === equipmentData?.building_id
      );
      setBuildingOptions(options);
      setSelectedBuilding(foundBuilding || null);
    } catch (error) {
      console.error("Fetch building options error:", error);
    }
  };
  const [floorOptions, setFloorOptions] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const fetchFloorListByBuildingId = async (buildingId) => {
    try {
      const response = await axios.get(
        `/api/staff/floor/building/${encodeURIComponent(buildingId)}`
      );
      // setFloorOptions(response.data.map((floor) => ({
      //     value: floor.id,
      //     label: `ชั้น ${floor.floor_number} - ${floor.description}`
      // })));
      const result = response.data;
      const options = result.map((floor) => ({
        value: floor.id,
        label: `ชั้น ${floor.floor_number} - ${floor.description}`,
      }));
      const foundFloor = options.find(
        (f) => f.value === equipmentData?.floor_id
      );
      setFloorOptions(options);
      setSelectedFloor(foundFloor || null);
    } catch (error) {
      console.error("Fetch floor list by building error:", error);
    }
  };
  const [roomOptions, setRoomOptions] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const fetchRoomListByFloorId = async (floorId) => {
    try {
      const response = await axios.get(
        `/api/staff/room/floor/${encodeURIComponent(floorId)}`
      );
      // setRoomOptions(response.data.map((room) => ({
      //     value: room.id,
      //     label: `${room.room_number} - ${room.room_name}`
      // })));
      const result = response.data;
      const options = result.map((room) => ({
        value: room.id,
        label: `${room.room_number} - ${room.room_name}`,
      }));
      const foundRoom = options.find((r) => r.value === equipmentData?.room_id);
      setRoomOptions(options);
      setSelectedRoom(foundRoom || null);
    } catch (error) {
      console.error("Fetch room list by floor error:", error);
    }
  };
  // useEffect สำหรับเมื่อ selectedBuilding เปลี่ยน
  useEffect(() => {
    if (selectedBuilding?.value) {
      setFloorOptions([]);
      setSelectedFloor(null);
      fetchFloorListByBuildingId(selectedBuilding.value);
    } else {
      setFloorOptions([]);
      setSelectedFloor(null);
    }
  }, [selectedBuilding]);

  useEffect(() => {
    if (selectedFloor?.value) {
      setRoomOptions([]);
      setSelectedRoom(null);
      fetchRoomListByFloorId(selectedFloor.value);
    } else {
      setRoomOptions([]);
      setSelectedRoom(null);
    }
  }, [selectedFloor]);

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const fetchFacultyOptions = async () => {
    try {
      const response = await axios.get("/api/staff/faculty");
      const options = response.data.map((faculty) => ({
        value: faculty.id,
        label: faculty.faculty_name,
      }));
      // หา selectedFaculty หลังจากที่ได้ข้อมูลแล้ว
      const foundFaculty = options.find(
        (faculty) => faculty.value === equipmentData?.faculty_id
      );
      setFacultyOptions(options);
      setSelectedFaculty(foundFaculty || null);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  const [majorOptions, setMajorOptions] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const fetchMajorByFacultyId = async (facultyId) => {
    try {
      const response = await axios.get(
        `/api/staff/major/${encodeURIComponent(facultyId)}`
      );
      const options = response.data.map((major) => ({
        value: major.id,
        label: major.major_name,
      }));
      // หา selectedMajor หลังจากที่ได้ข้อมูลแล้ว
      const foundMajor = options.find(
        (major) => major.value === equipmentData?.major_id
      );
      setMajorOptions(options);
      setSelectedMajor(foundMajor || null);
    } catch (error) {
      console.error("Fetch major list by faculty error:", error);
    }
  };

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

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
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

  useEffect(() => {
    fetchEquipmentById();
  }, [equipment.id]);

  // เพิ่ม useEffect เพื่อ update state เมื่อ equipmentData เปลี่ยน
  useEffect(() => {
    if (equipmentData) {
      fetchCategories();
      fetchUsageStatus();
      fetchConditionStatus();
      fetchBuildingOptions();
      fetchFacultyOptions();
      setEquipment_name(equipmentData.equipment_name || "");
      setBrand(equipmentData.brand || "");
      setModel(equipmentData.model || "");
      setSerial_number(equipmentData.serial_number || "");
      setPurchase_date(
        equipmentData.purchase_date
          ? new Date(equipmentData.purchase_date)
          : null
      );
      setPurchase_price(equipmentData.purchase_price || "");
      setVendor(equipmentData.vendor || "");
      setWarranty_period(equipmentData.warranty_period || "");
      setWarranty_end_date(
        equipmentData.warranty_end_date
          ? new Date(equipmentData.warranty_end_date)
          : null
      );
      setDepreciation_rate(equipmentData.depreciation_rate || "");
      setCurrent_value(equipmentData.current_value || "");
      setAsset_group(equipmentData.asset_group || "");
      setDescription(equipmentData.description || "");
      setSelectedImage(equipmentData.image_path);
    }
  }, [equipmentData]);
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
      text = message || "ไม่พบข้อมูลที่ต้องการในระบบ";
    } else if (status === 500) {
      icon = "error";
      color = "#d33"; // red
      text = message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
    }

    await Swal.fire({
      title: "ไม่สามารถแก้ไขครุภัณฑ์ได้",
      text,
      icon,
      confirmButtonText: "ตกลง",
      confirmButtonColor: color,
    });
  };
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const confirmed = await Swal.fire({
        title: "ยืนยันการแก้ไขครุภัณฑ์",
        text: `การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
        icon: "warning",
        confirmButtonText: "ยืนยัน",
        confirmButtonColor: "#d9534f",
        showCancelButton: true,
        cancelButtonColor: "#6B7280",
        cancelButtonText: "ยกเลิก",
        customClass: {
          container: "z-[10000]",
        },
      });
      if (!confirmed.isConfirmed) return;

      // สร้าง FormData แทน JSON object
      const formData = new FormData();
      formData.append('equipment_name', equipment_name);
      formData.append('brand', brand);
      formData.append('model', model);
      formData.append('serial_number', serial_number);
      formData.append('category_id', selectedCategory ? selectedCategory.value : '');
      formData.append('room_id', selectedRoom ? selectedRoom.value : '');
      // formData.append('purchase_date', purchase_date ? purchase_date.toISOString().split("T")[0] : '');
      formData.append('purchase_date', purchase_date ? DateTime.fromJSDate(purchase_date).toFormat('yyyy-MM-dd') : '');
      formData.append('purchase_price', purchase_price);
      formData.append('vendor', vendor);
      formData.append('warranty_period', warranty_period);
      // formData.append('warranty_end_date', warranty_end_date ? warranty_end_date.toISOString().split("T")[0] : '');
      formData.append('warranty_end_date', warranty_end_date ? DateTime.fromJSDate(warranty_end_date).toFormat('yyyy-MM-dd') : '');
      formData.append('depreciation_rate', depreciation_rate);
      formData.append('current_value', current_value);
      formData.append('condition_status', selectedCondition ? selectedCondition.value : '');
      formData.append('usage_status', selectedUsage ? selectedUsage.value : '');
      formData.append('asset_group', asset_group);
      formData.append('description', description);
      formData.append('major_id', selectedMajor ? selectedMajor.value : '');
      formData.append('requires_approval', 'true');
      formData.append('is_active', is_active);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      setSubmitLoading(true);
      const response = await axios.put(
        `/api/staff/equipment/${encodeURIComponent(equipmentData.id)}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const result = response.data;
      setSubmitLoading(false);
      await Swal.fire({
        icon: "success",
        title: result?.message || "แก้ไขครุภัณฑ์สำเร็จ",
        confirmButtonText: "ตกลง",
      });
      onClose();
      refresh();
    } catch (error) {
      console.error(
        "Error updating equipment:",
        error.response?.data?.message || error.message
      );
      await showAlertByStatus(
        error.response?.status,
        error.response?.data?.message
      );
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <div id="editItem-modal">
      <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
        <div className="tracking-[.5px] min-w-[700px] max-w-[1100px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
          <div className="flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4">
            <div className="flex items-center gap-x-2">
              <h2 className="text-[18px] font-bold text-[#4E5155]">
                แก้ไขครุภัณฑ์
              </h2>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]"
            >
              <RxCross2 size={20} color="#454545" />
            </button>
          </div>
          <div className="px-6 max-h-[70vh] overflow-y-auto">
            <div>
              <form onSubmit={handleSubmit} action="">
                <div className="mb-6 border-b border-[#E0E0E0] pb-3">
                  <div className="mb-4 ">
                    <h2 className="text-[18px] font-bold text-[#4E5155]">
                      1. ข้อมูลหลัก
                    </h2>
                  </div>
                  <div>
                    <div className="grid grid-cols-3 gap-x-6">
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label
                          className="text-gray-600"
                          htmlFor="equipmentName"
                        >
                          ชื่อครุภัณฑ์
                        </label>
                        <input
                          className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                          placeholder="ชื่อครุภัณฑ์"
                          type="text"
                          id="equipmentName"
                          name="equipmentName"
                          onChange={(e) => setEquipment_name(e.target.value)}
                          value={equipment_name}
                        />
                      </div>
                      {/* <div className='flex flex-col gap-y-2 mb-4'>
                                    <label className='text-gray-600' htmlFor="equipmentId">รหัสครุภัณฑ์</label>
                                    <input
                                        className='text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none'
                                        placeholder='รหัสครุภัณฑ์'
                                        type="text"
                                        id="equipmentId"
                                        name="equipmentId"
                                    />
                                </div> */}
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label
                          className="text-gray-600"
                          htmlFor="equipmentBrand"
                        >
                          ยี่ห้อ
                        </label>
                        <input
                          className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                          placeholder="ยี่ห้อ"
                          type="text"
                          id="equipmentBrand"
                          name="equipmentBrand"
                          onChange={(e) => setBrand(e.target.value)}
                          value={brand}
                        />
                      </div>
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label
                          className="text-gray-600"
                          htmlFor="equipmentModel"
                        >
                          รุ่น
                        </label>
                        <input
                          className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                          placeholder="รุ่น"
                          type="text"
                          id="equipmentModel"
                          name="equipmentModel"
                          onChange={(e) => setModel(e.target.value)}
                          value={model}
                        />
                      </div>
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label
                          className="text-gray-600"
                          htmlFor="equipmentSerial"
                        >
                          Serial Number
                        </label>
                        <input
                          className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                          placeholder="Serial Number"
                          type="text"
                          id="equipmentSerial"
                          name="equipmentSerial"
                          onChange={(e) => setSerial_number(e.target.value)}
                          value={serial_number}
                        />
                      </div>
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label className="text-gray-600" htmlFor="asset_group">
                          กลุ่มครุภัณฑ์
                        </label>
                        <input
                          className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                          placeholder="กลุ่มครุภัณฑ์"
                          type="text"
                          id="asset_group"
                          name="asset_group"
                          onChange={(e) => setAsset_group(e.target.value)}
                          value={asset_group}
                        />
                      </div>
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label className="text-gray-600" htmlFor="category">
                          หมวดหมู่
                        </label>
                        <Select
                          inputId="category"
                          name="category"
                          options={categoriesOptions}
                          onChange={setSelectedCategory}
                          value={selectedCategory}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              minHeight: "40px",
                              height: "40px",
                              borderRadius: "5px",
                              borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                              boxShadow: state.isFocused
                                ? "0 0 0 1.5px #1BC688"
                                : "none",
                              fontSize: "15px",
                              color: "#4E5155",
                              transition: "border-color 0.2s",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: "#868686",
                            }),
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-2 mb-4">
                      <label
                        className="text-gray-600"
                        htmlFor="equipmentDescription"
                      >
                        รายละเอียด
                      </label>
                      <textarea
                        className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                        placeholder="รายละเอียด"
                        type="text"
                        id="equipmentDescription"
                        name="equipmentDescription"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-6 border-b border-[#E0E0E0] pb-3">
                  <div className="mb-4 ">
                    <h2 className="text-[18px] font-bold text-[#4E5155]">
                      2. ข้อมูลการจัดซื้อ
                    </h2>
                  </div>
                  <div>
                    <div className="grid grid-cols-3 gap-x-6">
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label className="text-gray-600" htmlFor="">
                          วันที่จัดซื้อ
                        </label>
                        {/* <DateTimePicker
                          // selected={purchase_date}
                          value={purchase_date}
                          onChange={(date) => setPurchase_date(date)}
                          placeholderText="เลือกวันและเวลา"
                        /> */}
                        <DatePickerInput
                          // selected={purchase_date}
                          value={purchase_date}
                          dateFormat="dd/MM/yyyy"
                          onChange={(date) => setPurchase_date(date)}
                          placeholderText="เลือกวันและเวลา"
                        />
                      </div>
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label className="text-gray-600" htmlFor="">
                          วันที่สิ้นสุดประกัน
                        </label>
                        {/* <DateTimePicker
                          // selected={warranty_end_date}
                          value={warranty_end_date}
                          onChange={(date) => setWarranty_end_date(date)}
                          placeholderText="เลือกวันและเวลา"
                        /> */}
                        <DatePickerInput
                          // selected={warranty_end_date}
                          value={warranty_end_date}
                          dateFormat="dd/MM/yyyy"
                          onChange={(date) => setWarranty_end_date(date)}
                          placeholderText="เลือกวันและเวลา"
                        />
                      </div>
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label
                          className="text-gray-600"
                          htmlFor="equipmentVendor"
                        >
                          ผู้ขายหรือบริษัท
                        </label>
                        <input
                          className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                          placeholder="ผู้ขายหรือบริษัท"
                          type="text"
                          id="equipmentVendor"
                          name="equipmentVendor"
                          onChange={(e) => setVendor(e.target.value)}
                          value={vendor}
                        />
                      </div>
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label htmlFor="equipmentPrice">ราคาครุภัณฑ์</label>
                        <input
                          className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                          placeholder="ราคาครุภัณฑ์"
                          type="text"
                          id="equipmentPrice"
                          name="equipmentPrice"
                          onChange={(e) => setPurchase_price(e.target.value)}
                          value={purchase_price}
                        />
                      </div>
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label htmlFor="equipmentCurrentValue">
                          มูลค่าปัจจุบัน
                        </label>
                        <input
                          className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                          placeholder="มูลค่าปัจจุบัน"
                          type="text"
                          id="equipmentCurrentValue"
                          name="equipmentCurrentValue"
                          onChange={(e) => setCurrent_value(e.target.value)}
                          value={current_value}
                        />
                      </div>
                      <div className="flex flex-col gap-y-2 mb-4">
                        <label htmlFor="equipmentWarranty">
                          ระยะประกัน (เดือน)
                        </label>
                        <input
                          className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                          placeholder="ระยะประกัน (เดือน)"
                          type="text"
                          id="equipmentWarranty"
                          name="equipmentWarranty"
                          onChange={(e) => setWarranty_period(e.target.value)}
                          value={warranty_period}
                        />
                      </div>

                      <div className="flex flex-col gap-y-2 mb-4">
                        <label htmlFor="equipmentDepreciation">
                          อัตราค่าเสื่อมราคา (% ต่อปี)
                        </label>
                        <input
                          className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                          placeholder="อัตราค่าเสื่อมราคา"
                          type="text"
                          id="equipmentDepreciation"
                          name="equipmentDepreciation"
                          onChange={(e) => setDepreciation_rate(e.target.value)}
                          value={depreciation_rate}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-6 border-b border-[#E0E0E0] pb-3">
                  <div className="mb-4 ">
                    <h2 className="text-[18px] font-bold text-[#4E5155]">
                      3. สถานะและที่จัดเก็บ
                    </h2>
                  </div>
                  <div>
                    <div className="grid grid-cols-4 gap-x-6">
                      <div className="flex flex-col gap-y-3 mb-6">
                        <label>เลือกอาคาร</label>
                        <Select
                          options={buildingOptions}
                          onChange={setSelectedBuilding}
                          value={selectedBuilding}
                          className="flex-1 text-[15px]"
                          placeholder="เลือกอาคาร"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              minHeight: "40px",
                              height: "40px",
                              borderRadius: "5px",
                              borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                              boxShadow: state.isFocused
                                ? "0 0 0 1.5px #1BC688"
                                : "none",
                              fontSize: "15px",
                              color: "#4E5155",
                              transition: "border-color 0.2s",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: "#868686",
                            }),
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-y-3 mb-6">
                        <label>เลือกชั้น</label>
                        <Select
                          options={floorOptions}
                          onChange={setSelectedFloor}
                          value={selectedFloor}
                          className="flex-1 text-[15px]"
                          placeholder="เลือกชั้น"
                          isDisabled={!selectedBuilding}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              minHeight: "40px",
                              height: "40px",
                              borderRadius: "5px",
                              borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                              boxShadow: state.isFocused
                                ? "0 0 0 1.5px #1BC688"
                                : "none",
                              fontSize: "15px",
                              color: "#4E5155",
                              transition: "border-color 0.2s",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: "#868686",
                            }),
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-y-3 mb-6">
                        <label htmlFor="">ห้องที่จัดเก็บ</label>
                        <div>
                          <Select
                            options={roomOptions}
                            onChange={setSelectedRoom}
                            value={selectedRoom}
                            id="roomStorage"
                            name="roomStorage"
                            className="w-full"
                            placeholder="เลือกห้องที่จัดเก็บ"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                minHeight: "40px",
                                height: "40px",
                                borderRadius: "5px",
                                borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                                boxShadow: state.isFocused
                                  ? "0 0 0 1.5px #1BC688"
                                  : "none",
                                fontSize: "15px",
                                color: "#4E5155",
                                transition: "border-color 0.2s",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "#868686",
                              }),
                            }}
                          />
                        </div>
                      </div>
                      {/* <div className='flex flex-col gap-y-3 mb-6'>
                                                <label htmlFor="">จัดเป็นชุดเซต (ถ้ามี)</label>
                                                <div>
                                                    <Select
                                                        className='w-full'
                                                        placeholder='เลือกชุดเซต (ถ้ามี)'
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
                                            </div> */}
                      <div className="flex flex-col gap-y-3 mb-6">
                        <label htmlFor="conditionStatus">สภาพครุภัณฑ์</label>
                        <div>
                          <Select
                            options={conditionOptions}
                            onChange={setSelectedCondition}
                            value={selectedCondition}
                            className="w-full"
                            id="conditionStatus"
                            name="conditionStatus"
                            placeholder="เลือกสภาพครุภัณฑ์"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                minHeight: "40px",
                                height: "40px",
                                borderRadius: "5px",
                                borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                                boxShadow: state.isFocused
                                  ? "0 0 0 1.5px #1BC688"
                                  : "none",
                                fontSize: "15px",
                                color: "#4E5155",
                                transition: "border-color 0.2s",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "#868686",
                              }),
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-3 mb-6">
                        <label htmlFor="usageStatus">สถานะการใช้งาน</label>
                        <div>
                          <Select
                            options={usageOptions}
                            onChange={setSelectedUsage}
                            value={selectedUsage}
                            className="w-full"
                            id="usageStatus"
                            name="usageStatus"
                            placeholder="เลือกสถานะการใช้งาน"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                minHeight: "40px",
                                height: "40px",
                                borderRadius: "5px",
                                borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                                boxShadow: state.isFocused
                                  ? "0 0 0 1.5px #1BC688"
                                  : "none",
                                fontSize: "15px",
                                color: "#4E5155",
                                transition: "border-color 0.2s",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "#868686",
                              }),
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-y-3 mb-6">
                        <label htmlFor="faculty">คณะ</label>
                        <div>
                          <Select
                            options={facultyOptions}
                            onChange={setSelectedFaculty}
                            value={selectedFaculty}
                            className="w-full"
                            id="faculty"
                            name="faculty"
                            placeholder="เลือกคณะ"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                minHeight: "40px",
                                height: "40px",
                                borderRadius: "5px",
                                borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                                boxShadow: state.isFocused
                                  ? "0 0 0 1.5px #1BC688"
                                  : "none",
                                fontSize: "15px",
                                color: "#4E5155",
                                transition: "border-color 0.2s",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "#868686",
                              }),
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-3 mb-6">
                        <label htmlFor="major">สาขาวิชา</label>
                        <div>
                          <Select
                            options={majorOptions}
                            onChange={setSelectedMajor}
                            value={selectedMajor}
                            className="w-full"
                            id="major"
                            name="major"
                            placeholder="เลือกสาขาวิชา"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                minHeight: "40px",
                                height: "40px",
                                borderRadius: "5px",
                                borderColor: state.isFocused ? "#1BC688" : "#D1D5DB",
                                boxShadow: state.isFocused
                                  ? "0 0 0 1.5px #1BC688"
                                  : "none",
                                fontSize: "15px",
                                color: "#4E5155",
                                transition: "border-color 0.2s",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "#868686",
                              }),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="mb-4 ">
                    <h2 className="text-[18px] font-bold text-[#4E5155]">
                      4. ข้อมูลอื่นๆ
                    </h2>
                  </div>
                  <div>
                    <div className="grid grid-cols-1 gap-x-6">
                      <div className="flex flex-col gap-y-6 mb-6">
                        <label className="text-gray-600" htmlFor="">
                          แนบรูปภาพครุภัณฑ์
                        </label>
                        <div>
                          <label
                            htmlFor="equipmentImgFile"
                            className=" px-4 py-2 bg-[#F3F4F6] text-gray-600 rounded-[5px] border border-[#E0E0E0] cursor-pointer hover:bg-[#e5e7eb] transition"
                          >
                            {imageFileName ? imageFileName : "เลือกไฟล์รูปภาพ"}
                          </label>
                          <input
                            id="equipmentImgFile"
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>

                      </div>
                      <div className="flex items-center justify-end gap-x-4 mb-2">
                        <label className="text-gray-600" htmlFor="">
                          สถานะการใช้งาน
                        </label>
                        <ActiveSwitch
                          checked={is_active}
                          onChange={setIsActive}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-x-4 ">
                  <button type='button' onClick={onClose} className='text-sm md:text-base cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200'>ปิด</button>
                  <button
                    type="submit"
                    className="cursor-pointer rounded-[5px] text-base px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] "
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {submitLoading && <SubmitLoading />}
    </div>
  );
}
