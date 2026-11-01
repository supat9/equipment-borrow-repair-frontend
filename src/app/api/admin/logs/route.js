import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: "No token provided" }, { status: 401 });
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const start_date = searchParams.get('start_date') || '';
        const end_date = searchParams.get('end_date') || '';
        const type = searchParams.get('type') || '';
        const borrow_id = searchParams.get('borrow_id') || '';
        const equipment_id = searchParams.get('equipment_id') || '';
        const getLogsApi = process.env.ADMIN_GET_LOGS_API;
        const response = await axios.get(getLogsApi, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, limit, start_date, end_date, type, borrow_id, equipment_id }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('get logs errors :', error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}