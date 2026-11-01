import { NextResponse, NextRequest } from "next/server";
import axios from "axios";


export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const { searchParams } = new URL(req.url);
        const equipment_code = searchParams.get('equipment_code');
        
        // แปลงเครื่องหมาย / เป็น - ใน equipment_code เพราะเครื่อง scanner อาจส่งค่าที่มี / มา
        const formattedEquipmentCode = equipment_code ? equipment_code.replace(/\//g, '-') : equipment_code;

        const getEquipmentApi = process.env.MAINTENANCE_REQUEST_GET_EQUIPMENT_API;
        const response = await axios.get(getEquipmentApi, {
            params: { equipment_code: formattedEquipmentCode },
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("get equipment error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}