import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const formData = await req.formData();
        const faculty_id = formData.get('faculty_id');
        const major_id = formData.get('major_id');
        const csvFile = formData.get('csvFile');
        const bulkUploadUserApi = process.env.STAFF_BULK_UPLOAD_USER_API;
        const apiFormData = new FormData();
        apiFormData.append('faculty_id', faculty_id);
        apiFormData.append('major_id', major_id);
        if (csvFile) { apiFormData.append('csvFile', csvFile); }
        const response = await axios.post(bulkUploadUserApi, apiFormData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error('bulk upload user error:', error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}