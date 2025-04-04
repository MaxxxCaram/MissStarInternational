import Link from "next/link";

export default function VietnameseHome() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <nav className="p-4 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          Miss Star International
        </div>
        <div className="flex gap-4">
          {["en", "es", "pt", "th", "vi"].map((lang) => (
            <Link
              key={lang}
              href={`/${lang}`}
              className="text-white hover:text-yellow-300 transition"
            >
              {lang.toUpperCase()}
            </Link>
          ))}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-8">Miss Star International</h1>
          <p className="text-xl mb-12">Khám Phá Vẻ Đẹp, Ôm Lấy Sự Đa Dạng</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Cuộc Thi</h2>
              <p>Tham gia cuộc thi sắc đẹp quốc tế danh giá nhất</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Cộng Đồng</h2>
              <p>Kết nối với thí sinh từ khắp nơi trên thế giới</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Di Sản</h2>
              <p>Trở thành một phần của di sản quốc tế đang phát triển</p>
            </div>
          </div>

          <button className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition">
            Đăng Ký Ngay
          </button>
        </div>
      </div>
    </main>
  );
}
