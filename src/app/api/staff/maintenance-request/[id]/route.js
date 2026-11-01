import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function PUT(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const maintenanceId = params.id;
        const { maintenance_type, usage_status } = await req.json();
        const staffMaintenanceUpdateApi = process.env.STAFF_MAINTENANCE_REQUEST_UPDATE_API;
        const apiUrl = staffMaintenanceUpdateApi.replace("{id}", encodeURIComponent(maintenanceId));
        const response = await axios.put(apiUrl,
            { maintenance_type, usage_status },
            { headers: { Authorization: `Bearer ${token}` } });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("maintenance update error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}