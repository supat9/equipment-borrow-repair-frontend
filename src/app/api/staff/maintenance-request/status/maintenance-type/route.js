import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const maintenanceTypesApi = process.env.MAINTENANCE_TYPES_STATUS_API;
        const response = await axios.get(maintenanceTypesApi, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        return NextResponse.json(Array.isArray(result) ? result : (result.data ?? result.statuses ?? []), { status: 200 });
    } catch (error) {
        console.error("status maintenance types error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}