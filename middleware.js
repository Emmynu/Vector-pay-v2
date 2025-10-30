import { NextResponse } from "next/server"


export async function middleware(req) {
    const token = req.cookies.get("user")?.value
    const totp = req.cookies.get("totp")?.value
    const { pathname } = req.nextUrl
   

    if (pathname === "/auth/totp" && !totp) {
        const url = req.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    } 

    if (pathname.startsWith("/auth")) {
        return NextResponse.next();
    }

    if (!token && pathname !== '/auth/login') {//user is trying to go to anywhere other than the login page without the token
        const url = req.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    }

    if (token) {
        return NextResponse.next();
    }
}


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)']
}
