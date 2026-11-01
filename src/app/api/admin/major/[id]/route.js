import { NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(req, context) {
    try{
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const majorId = params?.id;
        const deleteMajorApi = process.env.DELETE_MAJOR_API;

        if(!token){
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }
        if (!majorId) {
            return NextResponse.json({ error: "Major ID is required" }, { status: 400 });
        }  

        const apiUrl = deleteMajorApi.replace('{id}', encodeURIComponent(majorId));

        const response = await axios.delete(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Major error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req, context) {
    try{
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const majorId = params?.id;

        if (!token) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }

        if (!majorId) {
            return NextResponse.json({ error: "Major ID is required" }, { status: 400 });
        }

        const body = await req.json();
        const updateMajorApi = process.env.UPDATE_MAJOR_API;

        const requestData = {
            ...body,
            majorId: majorId,
        };

        const apiUrl = updateMajorApi.replace('{id}', encodeURIComponent(majorId));

        const response = await axios.put(apiUrl, requestData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Update major error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}