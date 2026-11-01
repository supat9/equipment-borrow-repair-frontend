"use client";
import React from "react";
import { useState, useEffect } from "react";
import { HiPlus } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { FaUniversity } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { DataLoading, SubmitLoading } from "@/components/users/loading/LoadingOverlay";

export function Faculty({ facultyData, onRefresh }) {
  const [addFacultyModal, setAddFacultyModal] = useState(false);
  const [editFacultyModal, setEditFacultyModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setEditFacultyModal(true);
  };

  const [submitLoadingState, setSubmitLoadingState] = useState(false);
  // Function to handle delete
  const handleDelete = async (faculty) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ",
      text: `คุณต้องการลบคณะ "${faculty.faculty_name}" หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    // Resolve an id to use in the url
    const id = faculty?.id ?? faculty?.faculty_id ?? faculty?.faculty_code;
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "ไม่พบรหัสคณะ",
        text: "ไม่สามารถลบได้ เนื่องจากไม่พบรหัสคณะ",
        confirmButtonColor: "#dc3545",
      });
      return;
    }

    // Show a small loading state on the button by temporarily disabling interactions
    try {
      setSubmitLoadingState(true);
      await axios.delete(`/api/admin/faculty/${encodeURIComponent(id)}`);
      setSubmitLoadingState(false);
      await Swal.fire({
        icon: "success",
        title: "ลบคณะสำเร็จ!",
        text: `ลบคณะ "${faculty.faculty_name}" เรียบร้อยแล้ว`,
        confirmButtonColor: "#1BC688",
      });

      // Refresh list after successful delete
      onRefresh?.();
    } catch (error) {
      console.error("Error deleting faculty:", error);

      // Give user a helpful message for 404/409/other
      let errorMessage = "เกิดข้อผิดพลาดในการลบคณะ";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "ไม่พบคณะที่ต้องการลบ (404)";
        } else if (error.response.status === 409) {
          errorMessage = "ไม่สามารถลบคณะได้ เนื่องจากมีสาขาที่เชื่อมโยงอยู่";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: errorMessage,
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setSubmitLoadingState(false);
    }
  };

  return (
    <div id="faculty">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[18px] font-bold text-[#4E5155]">รายการคณะ</h2>
        <button
          onClick={() => setAddFacultyModal(true)}
          className="flex items-center gap-x-1 cursor-pointer rounded-[5px] px-4 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b]"
        >
          <HiPlus size={23} />
          <span>เพิ่มคณะ</span>
        </button>
      </div>
      <div>
        {facultyData && facultyData.length > 0 ? (
          <table className="w-full tracking-[.5px] text-left border-collapse">
            <thead className="bg-slate-50 border border-gray-300">
              <tr className="text-[16px]">
                <th className="font-light text-[#606060] px-4 py-3 rounded-l-[3px]">
                  รหัสคณะ
                </th>
                <th className="font-light text-[#606060] px-4 py-3">
                  <span className="cursor-pointer inline-flex items-center gap-x-2">
                    ชื่อคณะ
                  </span>
                </th>
                <th className="font-light text-[#606060] px-4 py-3">
                  <span className="cursor-pointer inline-flex items-center gap-x-2">
                    จำนวนสาขา
                  </span>
                </th>
                <th className="font-light text-[#606060] px-4 py-3 rounded-r-[3px]">
                  จัดการคณะ
                </th>
              </tr>
            </thead>
            <tbody>
              {facultyData.map((faculty) => (
                <tr
                  key={faculty.id}
                  className="border-b border-[#e5e7eb] text-[16px] text-[#4E5155]"
                >
                  <td className="p-4">{faculty.faculty_code || faculty.id}</td>
                  <td className="p-4">{faculty.faculty_name}</td>
                  <td className="p-4">{faculty.major_count || 0} สาขา</td>
                  <td className="p-4">
                    <div className="flex items-center gap-x-4">
                      <button
                        onClick={() => handleEdit(faculty)}
                        className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014] hover:bg-blue-50"
                        title="แก้ไขคณะ"
                      >
                        <CiEdit className="text-gray-600" size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(faculty)}
                        className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:shadow-[0px_0px_10px_#00000014] hover:bg-red-50"
                        title="ลบคณะ"
                      >
                        <PiTrashLight className="text-gray-600" size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center tracking-[.5px]">
            <div className="mb-3">
              <FaUniversity size={48} className="mx-auto text-[#E5E7EB]" />
            </div>
            <p className="text-[16px] text-[#6B7280] mb-2">ยังไม่มีข้อมูลคณะ</p>
          </div>
        )}
      </div>
      {addFacultyModal && (
        <AddFacultyModal
          onClose={() => setAddFacultyModal(false)}
          onRefresh={onRefresh}
        />
      )}
      {editFacultyModal && selectedFaculty && (
        <EditFacultyModal
          faculty={selectedFaculty}
          onClose={() => {
            setEditFacultyModal(false);
            setSelectedFaculty(null);
          }}
          onRefresh={onRefresh}
        />
      )}
      {submitLoadingState && <SubmitLoading />}
    </div>
  );
}

export function AddFacultyModal({ onClose, onRefresh }) {
  const [facultyCode, setFacultyCode] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    if (!isSubmitting) {
      setFacultyCode("");
      setFacultyName("");
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!facultyCode.trim() || !facultyName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "โปรดใส่รหัสคณะและชื่อคณะ",
        confirmButtonColor: "#1BC688",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("/api/admin/faculty", {
        facultyCode: facultyCode.trim(),
        facultyName: facultyName.trim(),
      });

      setIsSubmitting(false);
      onClose();
      onRefresh?.();

      Swal.fire({
        icon: "success",
        title: "เพิ่มคณะสำเร็จ!",
        text: `เพิ่มคณะ "${facultyName}" เรียบร้อยแล้ว`,
        confirmButtonColor: "#1BC688",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ??
        (error?.response?.status === 409
          ? "รหัสคณะนี้มีอยู่ในระบบแล้ว"
          : "เกิดข้อผิดพลาดในการเพิ่มคณะ");

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: errorMessage,
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div id="add-Faculty-model">
      <div
        className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.4)] flex justify-center items-center"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isSubmitting) {
            handleClose();
          }
        }}
      >
        <div className="tracking-[.5px] min-w-[400px] max-w-[400px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
          <div className="flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4">
            <div className="flex items-center gap-x-2">
              <FaUniversity size={25} color="#4E5155" />
              <h2 className="text-[18px] font-bold text-[#4E5155]">เพิ่มคณะ</h2>
            </div>
            <button
              onClick={handleClose}
              className="cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]"
            >
              <RxCross2 size={20} color="#454545" />
            </button>
          </div>
          <div className="px-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-y-2 mb-4">
                <label htmlFor="facultyCode">รหัสคณะ</label>
                <input
                  autoFocus
                  className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                  placeholder="A01"
                  type="text"
                  id="facultyCode"
                  name="facultyCode"
                  value={facultyCode}
                  onChange={(e) => setFacultyCode(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex flex-col gap-y-2 mb-4">
                <label htmlFor="facultyName">ชื่อคณะ</label>
                <input
                  className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                  placeholder="ศิลปศาสตร์และวิทยาศาสตร์"
                  type="text"
                  id="facultyName"
                  name="facultyName"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex justify-end gap-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  ปิด
                </button>


                <button
                  type="submit"
                  className="cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-x-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditFacultyModal({ faculty, onClose, onRefresh }) {
  const [facultyCode, setFacultyCode] = useState(faculty?.faculty_code || "");
  const [facultyName, setFacultyName] = useState(faculty?.faculty_name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!facultyCode.trim() || !facultyName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "โปรดใส่รหัสคณะและชื่อคณะ",
        confirmButtonColor: "#1BC688",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.put(`/api/admin/faculty/${faculty.id}`, {
        facultyCode: facultyCode.trim(),
        facultyName: facultyName.trim(),
      });

      setIsSubmitting(false);
      onClose();
      onRefresh?.();

      Swal.fire({
        icon: "success",
        title: "แก้ไขคณะสำเร็จ!",
        text: `แก้ไขคณะ "${facultyName}" เรียบร้อยแล้ว`,
        confirmButtonColor: "#1BC688",
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ??
        (error?.response?.status === 409
          ? "รหัสคณะนี้มีอยู่ในระบบแล้ว"
          : "เกิดข้อผิดพลาดในการแก้ไขคณะ");

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: errorMessage,
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="edit-Faculty-modal">
      <div
        className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.4)] flex justify-center items-center"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isSubmitting) {
            handleClose();
          }
        }}
      >
        <div className="tracking-[.5px] min-w-[400px] max-w-[400px] w-full bg-white rounded-[5px] py-6 shadow-xl relative">
          <div className="flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-4">
            <div className="flex items-center gap-x-2">
              <FaUniversity size={25} color="#4E5155" />
              <h2 className="text-[18px] font-bold text-[#4E5155]">แก้ไขคณะ</h2>
            </div>
            <button
              onClick={handleClose}
              className="cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]"
            >
              <RxCross2 size={20} color="#454545" />
            </button>
          </div>
          <div className="px-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-y-2 mb-4">
                <label htmlFor="editFacultyCode">รหัสคณะ</label>
                <input
                  className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                  placeholder="Q"
                  type="text"
                  id="editFacultyCode"
                  name="editFacultyCode"
                  value={facultyCode}
                  onChange={(e) => setFacultyCode(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex flex-col gap-y-2 mb-4">
                <label htmlFor="editFacultyName">ชื่อคณะ</label>
                <input
                  className="text-[#4E5155] border border-[#E0E0E0] rounded-[5px] px-3 py-2 duration-300 focus:outline-1 outline-green-300 focus:ring-2 ring-[#1BC688] focus:border-none"
                  placeholder="ศิลปศาสตร์และวิทยาศาสตร์"
                  type="text"
                  id="editFacultyName"
                  name="editFacultyName"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex justify-end gap-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="cursor-pointer rounded-[5px] px-5 py-2 bg-gray-50 text-gray-700 font-medium border border-gray-300 duration-200 hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  ปิด
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-[5px] px-5 py-2 bg-[#1BC688] text-white duration-200 hover:bg-[#03a96b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-x-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
