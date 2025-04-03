import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 text-sm text-gray-600 py-6 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          © {new Date().getFullYear()} Vefverslun Heklu og Óla. Allur réttur áskilinn.
        </div>
        <div className="flex gap-4">
          <a href="/admin/products" className="text-red-500 hover:underline text-red-500">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
