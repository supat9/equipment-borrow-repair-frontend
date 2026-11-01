import { NextResponse } from "next/server";

function getRoleFromToken(token) {
    try {
        const payload = token.value.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());

        // ตรวจสอบ token expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
            // token หมดอายุแล้ว
            return null;
        }

        return decoded.role;
    } catch {
        return null;
    }
}

export function middleware(req) {
    const token = req.cookies.get('token');
    let role = null;
    let isTokenExpired = false;

    if (token) {
        role = getRoleFromToken(token);
        if (role === null && token) {
            // token หมดอายุหรือไม่ valid
            isTokenExpired = true;
        }
    }

    // ถ้า token หมดอายุ ให้ลบ cookie และ redirect ไป login
    if (isTokenExpired) {
        const response = NextResponse.redirect(new URL('/login', req.url));
        response.cookies.delete('token');
        return response;
    }

    // เพิ่มการจัดการ root path
    if (req.nextUrl.pathname === '/') {
        if (role) {
            // redirect ไปหน้าที่เหมาะสมตาม role
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin', req.url));
            } else if (role === 'staff') {
                return NextResponse.redirect(new URL('/staff', req.url));
            } else {
                return NextResponse.redirect(new URL('/users', req.url));
            }
        } else {
            // ถ้าไม่มี token ให้ไป login
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    // เพิ่มการจัดการ login route
    if (req.nextUrl.pathname === '/login') {
        // ถ้ามี token ที่ valid แล้ว ให้ redirect ไปหน้าที่เหมาะสม
        if (role) {
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin', req.url));
            } else if (role === 'staff') {
                return NextResponse.redirect(new URL('/staff', req.url));
            } else {
                return NextResponse.redirect(new URL('/users', req.url));
            }
        }
        // ถ้าไม่มี token หรือ token หมดอายุ ให้อยู่ในหน้า login
        return NextResponse.next();
    }

    // ถ้า token หมดอายุหรือไม่มี token จะทำให้ role เป็น null
    if (req.nextUrl.pathname.startsWith('/users')) {
        if (!role || !['student', 'teacher', 'staff', 'admin'].includes(role)) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    } else if (req.nextUrl.pathname.startsWith('/staff')) {
        if (!role) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (role !== 'staff') {
            // ถ้าไม่ใช่ staff ให้ไป path ตาม role
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin', req.url));
            } else {
                return NextResponse.redirect(new URL('/users', req.url));
            }
        }
    } else if (req.nextUrl.pathname.startsWith('/admin')) {
        if (!role) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (role !== 'admin') {
            // ถ้าไม่ใช่ admin ให้ไป path ตาม role
            if (role === 'staff') {
                return NextResponse.redirect(new URL('/staff', req.url));
            } else {
                return NextResponse.redirect(new URL('/users', req.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/users/:path*', '/staff/:path*', '/admin/:path*'],
}