// Legacy firestore service stubbed safely with local mockData fallback
import mockData from "../data/mockData.json";

export async function getArticlesFromFirestore() {
  return mockData.articles || [];
}

export async function getPortfoliosFromFirestore() {
  return mockData.portfolios || [];
}

export async function addArticleToFirestore(article) {
  return article;
}

export async function updateArticleInFirestore(id, data) {
  return { id, ...data };
}

export async function deleteArticleFromFirestore(id) {
  return id;
}
