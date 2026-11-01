import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const maintenance_request_code = searchParams.get('maintenance_request_code');
        const urgency_level = searchParams.get('urgency_level');
        const staffMaintenanceRequestListApi = process.env.STAFF_MAINTENANCE_REQUEST_LIST_API;
        const response = await axios.get(staffMaintenanceRequestListApi, {
            params: {
                page, limit,
                maintenance_type: 'maintenance',
                maintenance_request_code,
                urgency_level
            },
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("maintenance maintenance list error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}