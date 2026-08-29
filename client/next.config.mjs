/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites(){
        return[
            {
                source: "/api/v1/:path*",
                destination:"https://next-tuts-jet.vercel.app/api/v1/:path*"
            }
        ]
    }
};

export default nextConfig;
