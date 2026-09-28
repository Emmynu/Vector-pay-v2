/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites(){
        return[
            {
                source: "/api/v1/:path*",
                destination:"http://localhost:8000/api/v1/:path*" // https://vector-pay.onrender.com/
            }
        ]
    }
};

export default nextConfig;
