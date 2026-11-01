import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const requestListApi = process.env.REQUEST_LIST_API;
        const response = await axios.get(requestListApi, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("Request list error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const { computer, description, appointmentDate } = await req.json();
        const requestCreateApi = process.env.REQUEST_CREATE_API;
        const response = await axios.post(requestCreateApi, {
            appointmentDate,
            description,
            computer
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Create install error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
