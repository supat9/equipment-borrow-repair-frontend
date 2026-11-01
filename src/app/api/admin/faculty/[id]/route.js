import { NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(req, context) {
  try {
    const token = req.cookies.get("token")?.value;
    const params = await context.params;
    const facultyId = params?.id;
    const deleteFacultyApi = process.env.DELETE_FACULTY_API;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    if (!facultyId) {
      return NextResponse.json({ error: "Faculty ID is required" }, { status: 400 });
    }

    const apiUrl = deleteFacultyApi.replace('{id}', encodeURIComponent(facultyId));

    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = response.data;
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Delete faculty error:", error);
    if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const token = req.cookies.get("token")?.value;
    const params = await context.params;
    const facultyId = params?.id;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    if (!facultyId) {
      return NextResponse.json({ error: "Faculty ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const updateFacultyApi = process.env.UPDATE_FACULTY_API;

    const requestData = {
      ...body,
      facultyId: facultyId,
    };

    const apiUrl = updateFacultyApi.replace('{id}', encodeURIComponent(facultyId));

    const response = await axios.put(apiUrl, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = response.data;
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Update faculty error:", error);
    if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}