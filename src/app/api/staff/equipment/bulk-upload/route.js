import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const formData = await req.formData();
        const category_id = formData.get('category_id');
        const file = formData.get('file');
        const bulkUploadEquipmentApi = process.env.STAFF_EQUIPMENT_BULK_UPLOAD_API;
        const apiFormData = new FormData();
        apiFormData.append('category_id', category_id);
        if (file) { apiFormData.append('file', file); }
        const response = await axios.post(bulkUploadEquipmentApi, apiFormData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('bulk upload user error:', error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}