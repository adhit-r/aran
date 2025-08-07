import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // Handle subdomain routing
  const subdomain = hostname.split('.')[0];
  
  // Skip for localhost and www
  if (subdomain === 'localhost' || subdomain === 'www' || hostname.includes('127.0.0.1')) {
    return NextResponse.next();
  }

  // Check if this is a company subdomain
  if (subdomain && subdomain !== 'aran') {
    // Add company context to headers for use in components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-company-subdomain', subdomain);
    
    // Clone the request with new headers
    const newRequest = NextRequest.next({
      request: {
        headers: requestHeaders,
      },
    });

    return newRequest;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
