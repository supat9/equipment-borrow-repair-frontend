import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function PUT(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const userId = params?.id;
        const { formData } = await req.json();
        const updateUserApi = process.env.STAFF_UPDATE_USER_API;
        const apiUrl = updateUserApi.replace('{id}', encodeURIComponent(userId));
        const response = await axios.put(apiUrl, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Update user error:', error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const userId = params?.id;
        const deleteUserApi = process.env.STAFF_DELETE_USER_API;
        const apiUrl = deleteUserApi.replace('{id}', encodeURIComponent(userId));
        const response = await axios.delete(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('delete user error:', error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}