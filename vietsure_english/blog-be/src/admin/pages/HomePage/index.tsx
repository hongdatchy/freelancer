const Homepage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        fontFamily: "Arial, sans-serif",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Banner */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "420px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src="/Vietsure English_Logo-15.png"
          alt="Banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "60px 24px 80px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "32px",
              marginBottom: "16px",
            }}
          >
            Chào mừng đến trang Admin
          </h2>

          <p
            style={{
              fontSize: "18px",
              color: "#cbd5e1",
              lineHeight: 1.6,
            }}
          >
            Quản lý khóa học, giáo viên và nội dung tại đây.
          </p>
        </div>
      </div>
    </div>
  );
};

export { Homepage };