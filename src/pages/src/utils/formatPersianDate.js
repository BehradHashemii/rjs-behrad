const formatPersianDate = (isoDateString) => {
  const date = new Date(isoDateString);
  const formatter = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tehran",
  });

  const parts = formatter.formatToParts(date);

  const dayValue = parts.find((part) => part.type === "day").value;
  const monthValue = parts.find((part) => part.type === "month").value;
  const yearValue = parts.find((part) => part.type === "year").value;
  const hourValue = parts.find((part) => part.type === "hour").value;
  const minuteValue = parts.find((part) => part.type === "minute").value;

  return `${dayValue} ${monthValue} ${yearValue} - ${hourValue}:${minuteValue}`;
};

export default formatPersianDate;
