export function getLikedArticles() {
  try {
    const data = localStorage.getItem("liked_articles");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isArticleLiked(id) {
  const list = getLikedArticles();
  return list.includes(id);
}

export function toggleLikeArticle(id) {
  const list = getLikedArticles();
  let updated;
  if (list.includes(id)) {
    updated = list.filter((item) => item !== id);
  } else {
    updated = [...list, id];
  }
  localStorage.setItem("liked_articles", JSON.stringify(updated));
  window.dispatchEvent(
    new CustomEvent("article-liked-change", { detail: updated }),
  );
  return updated;
}

export function getSavedPortfolios() {
  try {
    const data = localStorage.getItem("saved_portfolios");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isPortfolioSaved(id) {
  const list = getSavedPortfolios();
  return list.includes(id);
}

export function toggleSavePortfolio(id) {
  const list = getSavedPortfolios();
  let updated;
  if (list.includes(id)) {
    updated = list.filter((item) => item !== id);
  } else {
    updated = [...list, id];
  }
  localStorage.setItem("saved_portfolios", JSON.stringify(updated));
  window.dispatchEvent(
    new CustomEvent("portfolio-saved-change", { detail: updated }),
  );
  return updated;
}

export function getLoggedUser() {
  try {
    const user = localStorage.getItem("user_profile");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function saveLoggedUser(user) {
  localStorage.setItem("user_profile", JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("user-auth-change", { detail: user }));
}

export function removeLoggedUser() {
  localStorage.removeItem("user_profile");
  window.dispatchEvent(new CustomEvent("user-auth-change", { detail: null }));
}

// Initial Mock Tickets
const INITIAL_TICKETS = [
  {
    id: "TCK-1082",
    title: "مشاوره جهت طراحی فروشگاه اختصاصی آنلاین با ری‌اکت",
    category: "مشاوره پروژه",
    priority: "فوری",
    status: "پاسخ داده شده",
    date: "۱۴۰۴/۰۵/۰۲",
    messages: [
      {
        sender: "user",
        text: "سلام و احترام، بنده قصد طراحی یک آنلاین‌شاپ اختصاصی با امکانات فیلتر پیشرفته و اتصال به درگاه بانک دارم. تایم‌لاین پروژه چقدر خواهد بود؟",
        time: "۱۰:۳۰ - ۱۴۰۴/۰۵/۰۲",
      },
      {
        sender: "support",
        name: "پشتیبانی بهراد",
        text: "درود بر شما! بستگی به سناریوی دقیق دارد اما معمولاً پروژه‌های آنلاین‌شاپ اختصاصی بین ۳ الی ۵ هفته زمان می‌برند. می‌توانید جزئیات فنی بیشتر را ارسال فرمایید.",
        time: "۱۱:۱۵ - ۱۴۰۴/۰۵/۰۲",
      },
    ],
  },
  {
    id: "TCK-1045",
    title: "استعلام هزینه و زمان تحویل پورتفولیو شرکتی",
    category: "استعلام قیمت",
    priority: "عادی",
    status: "در حال بررسی",
    date: "۱۴۰۴/۰۵/۰۳",
    messages: [
      {
        sender: "user",
        text: "سلام، درخواست استعلام قیمت برای وب‌سایت معرفی شرکت مهندسی همراه با رزومه‌ها و گالری پروژه‌ها داشتم.",
        time: "۱۶:۲۰ - ۱۴۰۴/۰۵/۰۳",
      },
    ],
  },
];

export function getUserTickets() {
  try {
    const data = localStorage.getItem("user_tickets");
    if (!data) {
      localStorage.setItem("user_tickets", JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_TICKETS;
  }
}

export function addSupportTicket(newTicket) {
  const tickets = getUserTickets();
  const ticketObj = {
    id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "در حال بررسی",
    date: new Date().toLocaleDateString("fa-IR"),
    messages: [
      {
        sender: "user",
        text: newTicket.description,
        time: `${new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })} - ${new Date().toLocaleDateString("fa-IR")}`,
      },
    ],
    ...newTicket,
  };
  const updated = [ticketObj, ...tickets];
  localStorage.setItem("user_tickets", JSON.stringify(updated));
  window.dispatchEvent(
    new CustomEvent("user-tickets-change", { detail: updated }),
  );
  return updated;
}

export function addMessageToTicket(ticketId, messageText) {
  const tickets = getUserTickets();
  const updated = tickets.map((t) => {
    if (t.id === ticketId) {
      return {
        ...t,
        messages: [
          ...t.messages,
          {
            sender: "user",
            text: messageText,
            time: `${new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })} - ${new Date().toLocaleDateString("fa-IR")}`,
          },
        ],
      };
    }
    return t;
  });
  localStorage.setItem("user_tickets", JSON.stringify(updated));
  window.dispatchEvent(
    new CustomEvent("user-tickets-change", { detail: updated }),
  );
  return updated;
}

const INITIAL_ORDERS = [
  {
    id: "PRJ-901",
    title: "سفارش طراحی پلتفرم آموزش آنلاین و وبینار",
    serviceType: "توسعه وب‌سایت فرانت‌اند و بک‌اند",
    budget: "۴۰ تا ۶۰ میلیون تومان",
    status: "تایید اولیه و صدور پیش‌فاکتور",
    date: "۱۴۰۴/۰۴/۲۸",
    description:
      "نیاز به سیستم برگزاری دوره آنلاین، آزمون‌گیر و صدور گواهی‌نامه.",
  },
];

export function getUserOrders() {
  try {
    const data = localStorage.getItem("user_orders");
    if (!data) {
      localStorage.setItem("user_orders", JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function addProjectOrder(newOrder) {
  const orders = getUserOrders();
  const orderObj = {
    id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
    status: "در حال بررسی کارشناس",
    date: new Date().toLocaleDateString("fa-IR"),
    ...newOrder,
  };
  const updated = [orderObj, ...orders];
  localStorage.setItem("user_orders", JSON.stringify(updated));
  window.dispatchEvent(
    new CustomEvent("user-orders-change", { detail: updated }),
  );
  return updated;
}

// User Activities
const INITIAL_ACTIVITIES = [];

export function getUserActivities() {
  try {
    const data = localStorage.getItem("user_activities");
    if (!data) {
      localStorage.setItem(
        "user_activities",
        JSON.stringify(INITIAL_ACTIVITIES),
      );
      return INITIAL_ACTIVITIES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

export function addActivity(title, type = "info") {
  const activities = getUserActivities();
  const newAct = {
    id: Date.now(),
    title,
    time: "هم‌اکنون",
    type,
  };
  const updated = [newAct, ...activities.slice(0, 15)];
  localStorage.setItem("user_activities", JSON.stringify(updated));
  return updated;
}
