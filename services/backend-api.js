// backend-api.js

import axios from "axios"

const API_BASE_URL = "http://localhost:8080/api"

/**
 * Logs in a user.
 * @param {string} email - User's email or phone.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} The user object and token.
 */
export const login = async (email, password) => {
  return axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  })
}

/**
 * Registers a new user.
 * @param {Object} data - User registration data.
 * @param {string} data.firstName
 * @param {string} data.lastName
 * @param {string} data.email
 * @param {string} data.password
 * @param {string} data.school
 * @param {string} data.className
 * @returns {Promise<Object>} The newly created user data.
 */
export const register = async (data) => {
  return axios.post(`${API_BASE_URL}/auth/register`, data)
}

/**
 * Fetches the user's profile information.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} The user's profile.
 */
export const fetchUserProfile = async (userId) => {
  return axios.get(`${API_BASE_URL}/users/${userId}`)
}

/**
 * Fetches subjects for a specific school.
 * @param {string} schoolId - The ID or code of the school.
 * @returns {Promise<Array>} List of subject objects.
 */
export const fetchSubjectsBySchool = async (schoolId) => {
  return axios.get(`${API_BASE_URL}/subjects?school=${schoolId}`)
}

/**
 * Fetches documents for a specific subject.
 * @param {string} subjectId - The ID of the subject.
 * @returns {Promise<Array>} List of document names or URLs.
 */
export const fetchDocumentsBySubject = async (subjectId) => {
  return axios.get(`${API_BASE_URL}/documents?subject=${subjectId}`)
}

/**
 * Fetches all upcoming events.
 * @returns {Promise<Array>} List of event objects.
 */
export const fetchEvents = async () => {
  return axios.get(`${API_BASE_URL}/events`)
}

/**
 * Fetches all available quizzes.
 * @returns {Promise<Array>} List of quizzes.
 */
export const fetchQuizzes = async () => {
  return axios.get(`${API_BASE_URL}/quizzes`)
}

/**
 * Fetches quizzes related to a specific subject.
 * @param {string} subjectId - The ID of the subject.
 * @returns {Promise<Array>} List of subject-specific quizzes.
 */
export const fetchQuizzesBySubject = async (subjectId) => {
  return axios.get(`${API_BASE_URL}/quizzes?subject=${subjectId}`)
}

/**
 * Fetches user progress (e.g., lessons completed, quiz scores).
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} Progress data.
 */
export const fetchUserProgress = async (userId) => {
  return axios.get(`${API_BASE_URL}/progress/${userId}`)
}

/**
 * Searches for content across subjects, documents, or quizzes.
 * @param {string} query - The search keyword.
 * @returns {Promise<Object>} Matching results.
 */
export const searchContent = async (query) => {
  return axios.get(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)
}