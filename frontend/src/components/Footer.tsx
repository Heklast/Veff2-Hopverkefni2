import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="fotur">
        <div>© {new Date().getFullYear()}</div>
        <div>Vefverslun Heklu og Óla.</div>
        <div>Allur réttur áskilinn.</div>
        <div className="admin-link">
          <a href="/admin/products">Admin</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;