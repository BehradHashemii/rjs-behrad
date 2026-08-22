import api from '../utils/axiosInstance';

// Articles
export const getArticles = async () => (await api.get('/articles')).data;
export const getArticleById = async (id) => (await api.get(`/articles/${id}`)).data;
export const addArticle = async (data) => (await api.post('/articles', data)).data;
export const updateArticle = async (id, data) => (await api.put(`/articles/${id}`, data)).data;
export const deleteArticle = async (id) => (await api.delete(`/articles/${id}`)).data;

// Portfolios
export const getPortfolios = async () => (await api.get('/portfolios')).data;
export const addPortfolio = async (data) => (await api.post('/portfolios', data)).data;
export const updatePortfolio = async (id, data) => (await api.put(`/portfolios/${id}`, data)).data;
export const deletePortfolio = async (id) => (await api.delete(`/portfolios/${id}`)).data;

// Contact
export const getContactMessages = async () => (await api.get('/contact')).data;
export const sendContactMessage = async (data) => (await api.post('/contact', data)).data;
export const deleteContactMessage = async (id) => (await api.delete(`/contact/${id}`)).data;

// Tickets
export const getUserTickets = async (userId) => (await api.get(`/tickets`, { params: { userId } })).data;
export const getAllTickets = async () => (await api.get('/tickets')).data;
export const addTicket = async (userId, data) => (await api.post('/tickets', { ...data, userId })).data;
export const addMessageToTicket = async (ticketId, messageText, sender = "user") => (await api.post(`/tickets/${ticketId}/messages`, { text: messageText, sender })).data;
export const updateTicketStatus = async (ticketId, status) => (await api.put(`/tickets/${ticketId}/status`, { status })).data;

// Orders
export const getUserOrders = async (userId) => (await api.get(`/projects`, { params: { userId } })).data;
export const getAllOrders = async () => (await api.get('/projects')).data;
export const addOrder = async (userId, data) => (await api.post('/projects', { ...data, userId })).data;
export const updateOrderStatus = async (orderId, status) => (await api.put(`/projects/${orderId}/status`, { status })).data;

// Users / Auth
export const loginAPI = async (email, password) => (await api.post('/auth/login', { email, password })).data;
export const signupAPI = async (fullName, email, password) => (await api.post('/auth/register', { fullName, email, password })).data;
export const getProfileAPI = async () => (await api.get('/auth/me')).data;
export const updateProfileAPI = async (data) => (await api.put('/auth/profile', data)).data;
export const resetPasswordAPI = async (email) => (await api.post('/auth/reset-password', { email })).data;

// Projects Admin Aliases
export const getAllProjects = getAllOrders;
export const updateProjectStatus = updateOrderStatus;
export const addMessageToProject = async (projectId, messageText, sender = "admin") => (await api.post(`/projects/${projectId}/messages`, { text: messageText, sender })).data;
