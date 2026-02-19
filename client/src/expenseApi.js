// src/modules/expense/api/expenseApi.js
import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const expenseApi = {
  /* ========================= EXPENSE ========================= */
  getAll: () =>
    axios.get(`${baseURL}/expense`).then((res) => res.data),

  getOne: (id) =>
    axios.get(`${baseURL}/expense/${id}`).then((res) => res.data),
  
    getQuotes: (id) =>
    axios.get(`${baseURL}/expense/quotes/${id}`).then((res) => res.data),

  createRequest: (payload) =>
    axios.post(`${baseURL}/expense/create`, payload).then((res) => res.data),

  /* ========================= RFQ ========================= */
  submitRFQItems: (payload) =>
    axios
      .post(`${baseURL}/expense/rfq/submit`, payload)
      .then((res) => res.data),

  recommendRFQ: (payload) =>
    axios
      .post(`${baseURL}/expense/rfq/recommend`, payload)
      .then((res) => res.data),

  approveRFQByCH: (payload) =>
    axios
      .post(`${baseURL}/expense/rfq/approve-ch`, payload)
      .then((res) => res.data),

  getRFQItems: (expenseId) =>
    axios
      .get(`${baseURL}/expense/${expenseId}/rfq-items`)
      .then((res) => res.data),

  /* ========================= ITEMS & VENDORS ========================= */
  getItems: () =>
    axios.get(`${baseURL}/items`).then((res) => res.data),

  getVendors: () =>
    axios.get(`${baseURL}/vendors`).then((res) => res.data),

  /* ========================= QUOTES ========================= */
  uploadQuote: (formData) =>
    axios.post(`${baseURL}/expense/quotes/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data),

  recommendQuotes: (payload) =>
    axios
      .post(`${baseURL}/expense/quotes/recommend`, payload)
      .then((res) => res.data),

  approveVendor: (payload) =>
    axios
      .post(`${baseURL}/expense/quotes/approve`, payload)
      .then((res) => res.data),

      submitMultiVendorQuotes: (payload) =>
  axios
    .post(`${baseURL}/expense/quotes/upload-with-items`, payload)
    .then((res) => res.data),


  /* ========================= PURCHASE ORDER ========================= */
getPOItems: (id) =>
  axios.get(`${baseURL}/expense/po-items/${id}`).then(res => res.data),


createPO: (payload) =>
  axios
    .post(`${baseURL}/expense/po/create`, payload)
    .then((res) => res.data),

    getPO: (expenseId) =>
  axios
    .get(`${baseURL}/expense/po/${expenseId}`)
    .then(res => res.data),



  /* ========================= INVOICE ========================= */
  uploadInvoice: (formData) =>
    axios.post(`${baseURL}/expense/invoice/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data),

  approveInvoice: (payload) =>
    axios
      .post(`${baseURL}/expense/invoice/approve`, payload)
      .then((res) => res.data),

  /* ========================= PAYMENT ========================= */
  updatePayment: (payload) =>
    axios
      .post(`${baseURL}/expense/payment/update`, payload)
      .then((res) => res.data),

  verifyVendor: (payload) =>
    axios
      .post(`${baseURL}/expense/verify`, payload)
      .then((res) => res.data),

  /* ========================= DASHBOARD ========================= */
  getDashboardStats: () =>
    axios.get(`${baseURL}/expense/stats`).then((res) => res.data),

  getRecentRequests: () =>
    axios.get(`${baseURL}/expense/recent`).then((res) => res.data),
};

export default expenseApi;
