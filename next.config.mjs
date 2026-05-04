/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        dangerouslyAllowSVG: true,
        remotePatterns:[
        {
            protocol:"https",
            hostname: "*",

        }
        ]
    },
    eslint:{
        ignoreDuringBuilds: true
    }
};

export default nextConfig;
