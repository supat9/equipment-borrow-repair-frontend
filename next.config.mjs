// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Enable standalone output for Docker
    images: {
        domains: [
            'images.unsplash.com',
            'png.pngtree.com',
            'res.cloudinary.com'
        ],
    },
};

export default nextConfig;
