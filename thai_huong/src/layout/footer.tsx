export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 mt-auto">
      <div className="container mx-auto px-4">
        <p className="font-semibold text-slate-700">
          CÔNG TY CỔ PHẦN DƯỢC MỸ PHẨM THÁI HƯƠNG
        </p>
        <p className="mt-1">
          Nhà máy sản xuất mỹ phẩm chuẩn cGMP-ASEAN & ISO 22716
        </p>
        <p className="mt-2 text-[11px] text-slate-400">
          © {new Date().getFullYear()} Thai Huong Schedule System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
