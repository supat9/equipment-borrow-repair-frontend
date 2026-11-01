import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const getUsersListApi = process.env.ADMIN_GET_USER_LIST_API;
        const response = await axios.get(getUsersListApi, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error('Get users list error:', error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const { formData } = await req.json();
        const createUserApi = process.env.ADMIN_CREATE_USER_API;
        const response = await axios.post(createUserApi, formData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error('Create user error:', error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}