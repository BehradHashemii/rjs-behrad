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
  window.dispatchEvent(new CustomEvent("article-liked-change", { detail: updated }));
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
  window.dispatchEvent(new CustomEvent("portfolio-saved-change", { detail: updated }));
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
