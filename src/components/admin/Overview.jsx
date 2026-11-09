import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaUsers,
  FaEye,
  FaHeart,
  FaBookmark,
  FaNewspaper,
  FaBriefcase,
  FaTicketAlt,
} from "react-icons/fa";
import e2p from "../../utils/persianNumber";

function Overview({
  users = [],
  tickets = [],
  articles = [],
  portfolios = [],
  totalViews = 0,
  totalLikes = 0,
  totalSaves = 0,
  monthlyGrowthData = [],
  userRolePieData = [],
}) {
  const statCards = [
    {
      title: "کاربران ثبت‌نامی",
      value: e2p(users.length),
      icon: <FaUsers />,
      color: "#6366f1",
      bg: "rgba(99, 102, 241, 0.12)",
    },
    {
      title: "مجموع بازدیدها",
      value: e2p(totalViews),
      icon: <FaEye />,
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.12)",
    },
    {
      title: "مجموع لایک‌ها",
      value: e2p(totalLikes),
      icon: <FaHeart />,
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.12)",
    },
    {
      title: "ذخیره‌شده‌ها",
      value: e2p(totalSaves),
      icon: <FaBookmark />,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.12)",
    },
    {
      title: "تعداد مقالات",
      value: e2p(articles.length),
      icon: <FaNewspaper />,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.12)",
    },
    {
      title: "نمونه‌کارها",
      value: e2p(portfolios.length),
      icon: <FaBriefcase />,
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.12)",
    },
    {
      title: "تیکت‌های باز",
      value: e2p(tickets.filter((t) => t.status !== "بسته شده").length),
      icon: <FaTicketAlt />,
      color: "#ec4899",
      bg: "rgba(236, 72, 153, 0.12)",
    },
  ];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px", marginTop: "16px" }}>
      {/* ردیف کارت‌های آماری */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          width: "100%",
        }}
      >
        {statCards.map((c, i) => (
          <div
            key={i}
            style={{
              padding: "16px",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: c.bg,
                color: c.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
              }}
            >
              {c.icon}
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary, #94a3b8)", display: "block" }}>
                {c.title}
              </span>
              <strong style={{ fontSize: "1.3rem", fontWeight: "700" }}>{c.value}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* بخش نمودارها */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          width: "100%",
        }}
      >
        {/* نمودار رشد ماهانه */}
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h3 style={{ fontSize: "1rem", marginBottom: "16px" }}>روند رشد تعاملات در ماه‌های اخیر</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyGrowthData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.6)" fontSize={12} />
                <YAxis stroke="rgba(255, 255, 255, 0.6)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                />
                <Area type="monotone" dataKey="بازدید" stroke="#6366f1" fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="لایک" stroke="#ef4444" fillOpacity={1} fill="url(#colorLikes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار توزیع کاربران */}
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h3 style={{ fontSize: "1rem", marginBottom: "16px" }}>توزیع نقش‌های کاربری</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRolePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {userRolePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
