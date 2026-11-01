import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const facultyApi = process.env.GET_FACULTY_API;

    const response = await axios.get(facultyApi, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = response.data;
    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Faculty error:", error.message);
    if (error.response)
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const { facultyName, facultyCode } = await req.json();
    const createFacultyApi = process.env.CREATE_FACULTY_API;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    const response = await axios.post(
      createFacultyApi,
      {
        facultyName,
        facultyCode,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    const result = response.data;
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Create faculty error:", error);
    if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
