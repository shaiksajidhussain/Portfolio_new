/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'randomuser.me',
      'upload.wikimedia.org',
      'keshavareddy.com',
      'seeklogo.com',
      'th.bing.com',
      'images.unsplash.com',
      'www.w3.org',
      'www.vectorlogo.zone',
      'getbootstrap.com',
      'cdn-icons-png.flaticon.com',
      'cdn.iconscout.com',
      'reactnative.dev',
      'encrypted-tbn0.gstatic.com',
      'github.githubassets.com',
      'example.com', // Added to fix the error with example.com domain
    ],
  },
};

module.exports = nextConfig;