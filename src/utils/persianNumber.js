const e2p = (s) => (s ?? "").toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

export const p2e = (s) =>
  (s ?? "")
    .toString()
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

export const isValidIranianMobile = (phone) => {
  if (!phone) return false;
  const clean = p2e(phone).replace(/[^\d]/g, "");
  // Must start with 09 and be 11 digits
  return /^09\d{9}$/.test(clean);
};

export default e2p;
