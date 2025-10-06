// frontend/src/Components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_API_URL } from "../config";
import './AdminPage.css';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending Payment' },
    { value: 'confirmed', label: 'Payment Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Fetch all orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
  const res = await axios.get(`${BASE_API_URL}/api/orders/all`);
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch orders.');
      }
    };
    fetchOrders();
  }, []);

  // Select order by orderId
  const handleSelectOrder = (orderId) => {
    const selected = orders.find((o) => o.orderId === orderId);
    if (selected) {
      setCurrentOrder(selected);
      setStatus(selected.orderStatus);
      setError('');
    }
  };

  // Update order status in backend
  const updateStatus = async () => {
    if (!currentOrder || !status) {
      setError('No order selected or invalid status.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.put(
        `${BASE_API_URL}/api/orders/${currentOrder.orderId}`,
        { orderStatus: status }
      );

      if (res.data.success) {
        // Update state locally
        const updatedOrders = orders.map((o) =>
          o.orderId === currentOrder.orderId ? { ...o, orderStatus: status } : o
        );
        setOrders(updatedOrders);
        setCurrentOrder({ ...currentOrder, orderStatus: status });
        alert('Order status updated successfully!');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update order status.');
    }

    setLoading(false);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel - Orders Overview</h1>

      {/* Orders list */}
      <div className="orders-grid">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.orderId}
              className={`order-card-small ${
                currentOrder?.orderId === order.orderId ? 'active' : ''
              }`}
              onClick={() => handleSelectOrder(order.orderId)}
            >
              <h3>Order ID: {order.orderId}</h3>
              <p>Status: <strong>{order.orderStatus}</strong></p>
              <p>Total: ${order.totalAmount}</p>
              <p className="order-date">
                Created: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {/* Selected order details */}
      {currentOrder && (
        <div className="order-details-section">
          <h2>Order Details - {currentOrder.orderId}</h2>

          {/* Customer Details Section */}
          <div className="customer-details">
            <h3>Customer Details:</h3>
            {currentOrder.customerDetails ? (
              <div className="customer-info">
                <p><strong>Name:</strong> {currentOrder.customerDetails.firstName} {currentOrder.customerDetails.lastName || ''}</p>
                <p><strong>Phone:</strong> {currentOrder.customerDetails.phone}</p>
                <p><strong>Address:</strong> {currentOrder.customerDetails.address}</p>
                {currentOrder.customerDetails.apartment && (
                  <p><strong>Apartment:</strong> {currentOrder.customerDetails.apartment}</p>
                )}
                <p><strong>City:</strong> {currentOrder.customerDetails.city}</p>
                <p><strong>State:</strong> {currentOrder.customerDetails.state}</p>
                <p><strong>Pincode:</strong> {currentOrder.customerDetails.pincode}</p>
              </div>
            ) : (
              <p>No customer details available.</p>
            )}
          </div>

          <div className="order-products">
            <h3>Products:</h3>
            <ul>
              {currentOrder.items.map((p, i) => (
                <li key={i}>
                  {p.name} - Qty: {p.quantity} - Price: ${p.price}
                </li>
              ))}
            </ul>
            <p><strong>Total: ${currentOrder.totalAmount}</strong></p>
          </div>

          <div className="payment-section">
            <h3>Payment Proof:</h3>
            {currentOrder.paymentScreenshot ? (
              <div className="payment-image-container">
                <img
                  src={currentOrder.paymentScreenshot}
                  alt="Payment Proof"
                  className="payment-proof-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                  }}
                />
                <a 
                  href={currentOrder.paymentScreenshot} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-full-image"
                >
                  View Full Image
                </a>
              </div>
            ) : (
              <p>No payment proof uploaded.</p>
            )}
          </div>

          <div className="status-section">
            <h3>
              Current Status: <span>{currentOrder.orderStatus}</span>
            </h3>
            <p>Order Created: {new Date(currentOrder.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(currentOrder.updatedAt || currentOrder.createdAt).toLocaleString()}</p>
          </div>

          <div className="update-section">
            <h3>Update Order Status</h3>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={updateStatus}
              disabled={loading || status === currentOrder.orderStatus}
              className="admin-btn update"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
            {error && <p className="error-text">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;