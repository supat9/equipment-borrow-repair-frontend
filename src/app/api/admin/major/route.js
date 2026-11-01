import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }
        
        const majorApi = process.env.GET_MAJOR_API;
             
        const response = await axios.get(majorApi, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("Major error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }

        // Parse body from the incoming request
        const { facultyId, majorCode, majorName } = await req.json();

        const majorApi = process.env.CREATE_MAJOR_API;
        const response = await axios.post(majorApi, {
            facultyId,
            majorCode,
            majorName
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = response.data;
        // forward backend response
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Major error:", error.message || error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}