/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites(){
        return[
            {
                source: "/api/v1/:path*",
                destination:"https://vector-pay.onrender.com/api/v1/:path*" //http://localhost:8000/
            }
        ]
    }
};

export default nextConfig;
