import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  getAllOrders,
} from '../services/orderService';

import { BASE_API_URL } from '../config';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

import '../styles/dashboard.css';

const Dashboard = ({ onLogout }) => {

  const [orders, setOrders] =
    useState([]);

  const [currentOrder, setCurrentOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [updateLoading, setUpdateLoading] =
    useState(false);

  const [confirmingPayment, setConfirmingPayment] =
    useState(false);

  const [error, setError] =
    useState('');

  const [status, setStatus] =
    useState('');

  const [paymentStatus, setPaymentStatus] =
    useState('');



  // ================= STATUS OPTIONS =================

  const paymentStatusOptions = [
    {
      value: 'pending',
      label: 'Pending',
    },
    {
      value: 'successful',
      label: 'Successful',
    },
    {
      value: 'failed',
      label: 'Failed',
    },
  ];

  const statusOptions = [
    {
      value: 'pending',
      label: 'Pending Payment',
    },
    {
      value: 'confirmed',
      label: 'Payment Confirmed',
    },
    {
      value: 'processing',
      label: 'Processing',
    },
    {
      value: 'shipped',
      label: 'Shipped',
    },
    {
      value: 'delivered',
      label: 'Delivered',
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
    },
  ];



  // ================= FETCH ORDERS =================

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        setLoading(true);

        const data =
          await getAllOrders();

        if (data.success) {

          setOrders(data.orders);

        }

      } catch (err) {

        console.error(err);

        setError(
          'Failed to fetch orders'
        );

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);




  // ================= SELECT ORDER =================

  const handleSelectOrder = (
    orderId
  ) => {

    if (
      currentOrder?.orderId === orderId
    ) {

      setCurrentOrder(null);
      return;

    }

    const selected = orders.find(
      (order) =>
        order.orderId === orderId
    );

    if (selected) {

      setCurrentOrder(selected);

      setStatus(
        selected.orderStatus
      );

      setPaymentStatus(
        selected.paymentStatus ||
          'pending'
      );

      setError('');

    }

  };




  // ================= REFRESH ORDERS =================

  const refreshOrders = async (
    selectedOrderId
  ) => {

    try {

      const refreshed =
        await getAllOrders();

      if (refreshed.success) {

        setOrders(
          refreshed.orders
        );

        const updated =
          refreshed.orders.find(
            (o) =>
              o.orderId ===
              selectedOrderId
          );

        if (updated) {

          setCurrentOrder(updated);

          setStatus(
            updated.orderStatus
          );

          setPaymentStatus(
            updated.paymentStatus ||
              'pending'
          );

        }

      }

    } catch (err) {

      console.error(err);

    }

  };




  // ================= CONFIRM PAYMENT =================

  const confirmPayment =
    async () => {

      if (!currentOrder) {

        setError(
          'No order selected.'
        );

        return;

      }

      try {

        setConfirmingPayment(true);

        setError('');

        const payload = {
          orderStatus:
            'confirmed',
          paymentStatus:
            'successful',
        };

        const res =
          await axios.put(
            `${BASE_API_URL}/api/orders/${currentOrder.orderId}`,
            payload
          );

        if (res.data.success) {

          await refreshOrders(
            currentOrder.orderId
          );

          alert(
            'Payment confirmed successfully!'
          );

        }

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data
            ?.message ||
            'Failed to confirm payment.'
        );

      } finally {

        setConfirmingPayment(
          false
        );

      }

    };




  // ================= UPDATE STATUS =================

  const updateStatus =
    async () => {

      if (
        !currentOrder ||
        !status ||
        !paymentStatus
      ) {

        setError(
          'Invalid order status.'
        );

        return;

      }

      try {

        setUpdateLoading(true);

        setError('');

        const payload = {
          orderStatus: status,
          paymentStatus:
            paymentStatus,
        };

        const res =
          await axios.put(
            `${BASE_API_URL}/api/orders/${currentOrder.orderId}`,
            payload
          );

        if (res.data.success) {

          await refreshOrders(
            currentOrder.orderId
          );

          alert(
            'Order updated successfully!'
          );

        }

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data
            ?.message ||
            'Failed to update order.'
        );

      } finally {

        setUpdateLoading(
          false
        );

      }

    };




  // ================= PAYMENT BADGE =================

  const getPaymentStatusBadge =
    (status) => {

      const badges = {
        pending:
          'payment-badge pending',
        successful:
          'payment-badge successful',
        failed:
          'payment-badge failed',
      };

      return (
        <span
          className={
            badges[status] ||
            badges.pending
          }
        >
          {status}
        </span>
      );

    };




  return (

    <div className="dashboard-layout">

      <Sidebar />



      <div className="dashboard-main">

        <Navbar
          title="Admin Dashboard"
          onLogout={onLogout}
        />



        <div className="dashboard-content">

          <h1 className="dashboard-title">
            Orders Overview
          </h1>



          {loading ? (

            <p>
              Loading orders...
            </p>

          ) : (

            <div className="orders-grid">

              {orders.map(
                (order) => (

                  <div
                    key={
                      order.orderId
                    }
                    className={`order-wrapper ${
                      currentOrder?.orderId ===
                      order.orderId
                        ? 'expanded'
                        : ''
                    }`}
                  >

                    {/* ================= ORDER CARD ================= */}

                    <div
                      onClick={() =>
                        handleSelectOrder(
                          order.orderId
                        )
                      }
                      className={`order-card ${
                        currentOrder?.orderId ===
                        order.orderId
                          ? 'active'
                          : ''
                      }`}
                    >

                      <h3>
                        {
                          order.orderId
                        }
                      </h3>

                      <p>
                        Status:{' '}
                        {
                          order.orderStatus
                        }
                      </p>

                      <p>
                        Payment:{' '}
                        {getPaymentStatusBadge(
                          order.paymentStatus ||
                            'pending'
                        )}
                      </p>

                      <p>
                        Total: ₹
                        {
                          order.totalAmount
                        }
                      </p>

                    </div>



                    {/* ================= ORDER DETAILS BELOW CARD ================= */}

                    {currentOrder?.orderId ===
                      order.orderId && (

                      <div className="order-details">

                        <h2>
                          Order Details
                        </h2>

                        <p>
                          <strong>
                            Order ID:
                          </strong>{' '}
                          {
                            currentOrder.orderId
                          }
                        </p>

                        <p>
                          <strong>
                            Total:
                          </strong>{' '}
                          ₹
                          {
                            currentOrder.totalAmount
                          }
                        </p>

                        <p>
                          <strong>
                            Status:
                          </strong>{' '}
                          {
                            currentOrder.orderStatus
                          }
                        </p>

                        <p>
                          <strong>
                            Payment:
                          </strong>{' '}
                          {
                            currentOrder.paymentStatus
                          }
                        </p>

                        <p>
                          <strong>
                            Created:
                          </strong>{' '}
                          {new Date(
                            currentOrder.createdAt
                          ).toLocaleString()}
                        </p>



                        {/* ================= PAYMENT IMAGE ================= */}

                        <div className="payment-section">

                          <h3>
                            Payment Proof
                          </h3>

                          {currentOrder.paymentScreenshot ? (

                            <div className="payment-image-container">

                              <img
                                src={
                                  currentOrder.paymentScreenshot
                                }
                                alt="Payment Proof"
                                className="payment-proof-image"
                                onError={(
                                  e
                                ) => {

                                  e.target.src =
                                    'https://via.placeholder.com/400x300?text=Image+Not+Available';

                                }}
                              />

                              <a
                                href={
                                  currentOrder.paymentScreenshot
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="view-full-image"
                              >
                                View Full
                                Image
                              </a>

                            </div>

                          ) : (

                            <p>
                              No payment
                              screenshot
                              uploaded.
                            </p>

                          )}

                        </div>



                        {/* ================= PAYMENT CONFIRM BUTTON ================= */}

                        {currentOrder.paymentStatus !==
                          'successful' &&
                          currentOrder.orderStatus ===
                            'pending' && (

                            <div className="payment-confirmation-section">

                              <h3>
                                Payment
                                Confirmation
                              </h3>

                              <button
                                onClick={
                                  confirmPayment
                                }
                                disabled={
                                  confirmingPayment
                                }
                                className="confirm-btn"
                              >

                                {confirmingPayment
                                  ? 'Confirming...'
                                  : 'Confirm Payment'}

                              </button>

                            </div>

                          )}



                        {/* ================= UPDATE STATUS ================= */}

                        <div className="update-section">

                          <h3>
                            Update Order
                          </h3>

                          <div className="update-controls">

                            <div>

                              <label>
                                Order
                                Status
                              </label>

                              <select
                                value={
                                  status
                                }
                                onChange={(
                                  e
                                ) =>
                                  setStatus(
                                    e
                                      .target
                                      .value
                                  )
                                }
                              >

                                {statusOptions.map(
                                  (
                                    opt
                                  ) => (

                                    <option
                                      key={
                                        opt.value
                                      }
                                      value={
                                        opt.value
                                      }
                                    >

                                      {
                                        opt.label
                                      }

                                    </option>

                                  )
                                )}

                              </select>

                            </div>



                            <div>

                              <label>
                                Payment
                                Status
                              </label>

                              <select
                                value={
                                  paymentStatus
                                }
                                onChange={(
                                  e
                                ) =>
                                  setPaymentStatus(
                                    e
                                      .target
                                      .value
                                  )
                                }
                              >

                                {paymentStatusOptions.map(
                                  (
                                    opt
                                  ) => (

                                    <option
                                      key={
                                        opt.value
                                      }
                                      value={
                                        opt.value
                                      }
                                    >

                                      {
                                        opt.label
                                      }

                                    </option>

                                  )
                                )}

                              </select>

                            </div>



                            <button
                              onClick={
                                updateStatus
                              }
                              disabled={
                                updateLoading
                              }
                              className="update-btn"
                            >

                              {updateLoading
                                ? 'Updating...'
                                : 'Update Status'}

                            </button>

                          </div>

                        </div>



                        {/* ================= ERROR ================= */}

                        {error && (

                          <p className="error-text">

                            {error}

                          </p>

                        )}

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>

  );

};

export default Dashboard;