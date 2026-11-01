import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const token = req.cookies.get('token')?.value;

        // ดึงข้อมูลจาก formData แทน req.json()
        const formData = await req.formData();
        const equipment_code = formData.get('equipment_code');
        // แปลงเครื่องหมาย / เป็น - ใน equipment_code เพราะเครื่อง scanner อาจส่งค่าที่มี / มา
        const formattedEquipmentCode = equipment_code ? equipment_code.replace(/\//g, '-') : equipment_code;
        const issue_description = formData.get('issue_description');
        const urgency_level_id = formData.get('urgency_level_id');
        const imageFile = formData.get('image'); // 'image' คือ key ของไฟล์ภาพ
        const maintenanceRequestApi = process.env.MAINTENANCE_REQUEST_API;

        // สร้าง FormData ใหม่เพื่อส่งไปยัง API ปลายทาง
        const apiFormData = new FormData();
        // apiFormData.append('equipment_code', equipment_code);
        apiFormData.append('equipment_code', formattedEquipmentCode);

        apiFormData.append('issue_description', issue_description);
        apiFormData.append('urgency_level_id', urgency_level_id);

        // ตรวจสอบว่ามีไฟล์ภาพหรือไม่ก่อนจะ append
        if (imageFile) {
            apiFormData.append('image', imageFile);
        }

        const response = await axios.post(maintenanceRequestApi, apiFormData, {
            headers: {
                Authorization: `Bearer ${token}`,
                // ไม่ต้องกำหนด Content-Type เพราะ axios จะจัดการให้เองสำหรับ FormData
            },
        });

        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Maintenance request error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
