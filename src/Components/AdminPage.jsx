// frontend/src/Components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_API_URL } from "../config";
import './AdminPage.css';

const AdminPage = ({ onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'successful', label: 'Successful' },
    { value: 'failed', label: 'Failed' }
  ];

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
      setPaymentStatus(
        selected.paymentStatus === 'successful' ? 'successful' :
        selected.paymentStatus === 'failed' ? 'failed' :
        'pending'
      );
      setError('');
    }
  };

  // Confirm payment - separate button action
  const confirmPayment = async () => {
    if (!currentOrder) {
      setError('No order selected.');
      return;
    }

    setConfirmingPayment(true);
    setError('');

    try {
      const payload = { 
        orderStatus: 'confirmed', 
        paymentStatus: 'successful'
      };
      
      console.log('Confirming payment with payload:', payload);
      const res = await axios.put(
        `${BASE_API_URL}/api/orders/${currentOrder.orderId}`,
        payload
      );

      if (res.data.success) {
        // Re-fetch all orders
        const refreshed = await axios.get(`${BASE_API_URL}/api/orders/all`);
        if (refreshed.data.success) {
          setOrders(refreshed.data.orders);
          const updated = refreshed.data.orders.find(o => o.orderId === currentOrder.orderId);
          if (updated) {
            setCurrentOrder(updated);
            setStatus(updated.orderStatus);
            setPaymentStatus(updated.paymentStatus);
          }
        }
        alert('Payment confirmed successfully! Order status updated to "Payment Confirmed".');
      } else {
        setError('Backend responded but did not succeed: ' + JSON.stringify(res.data));
      }
    } catch (err) {
      console.error('Confirm payment error:', err);
      let debugMsg = 'Failed to confirm payment.';
      if (err.response) {
        debugMsg += `\nStatus: ${err.response.status}`;
        debugMsg += `\nResponse: ${JSON.stringify(err.response.data)}`;
      }
      setError(debugMsg);
    }

    setConfirmingPayment(false);
  };

  // Update order status in backend
  const updateStatus = async () => {
    if (!currentOrder || !status || !paymentStatus) {
      setError('No order selected or invalid status/payment status.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = { orderStatus: status, paymentStatus: String(paymentStatus) };
      console.log('Updating order with payload:', payload);
      const res = await axios.put(
        `${BASE_API_URL}/api/orders/${currentOrder.orderId}`,
        payload
      );

      if (res.data.success) {
        // Re-fetch all orders
        const refreshed = await axios.get(`${BASE_API_URL}/api/orders/all`);
        if (refreshed.data.success) {
          setOrders(refreshed.data.orders);
          const updated = refreshed.data.orders.find(o => o.orderId === currentOrder.orderId);
          if (updated) setCurrentOrder(updated);
        }
        alert('Order status and payment status updated successfully!');
      } else {
        setError('Backend responded but did not succeed: ' + JSON.stringify(res.data));
      }
    } catch (err) {
      console.error('Update error:', err);
      let debugMsg = 'Failed to update order/payment status.';
      if (err.response) {
        debugMsg += `\nStatus: ${err.response.status}`;
        debugMsg += `\nResponse: ${JSON.stringify(err.response.data)}`;
      }
      setError(debugMsg);
    }

    setLoading(false);
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      successful: { bg: 'bg-green-100', text: 'text-green-800', label: 'Successful' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="admin-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="admin-title">Admin Panel - Orders Overview</h1>
        <button onClick={onLogout} className="admin-btn logout" style={{ marginLeft: 'auto' }}>Logout</button>
      </div>

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
              <p>Payment: {getPaymentStatusBadge(order.paymentStatus || 'pending')}</p>
              <p>Total: ₹{order.totalAmount}</p>
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
        <div>
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
            <h3>
              Payment Status: {getPaymentStatusBadge(currentOrder.paymentStatus || 'pending')}
            </h3>
            <p>Order Created: {new Date(currentOrder.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(currentOrder.updatedAt || currentOrder.createdAt).toLocaleString()}</p>
          </div>

          {/* Payment Confirmation Section - Separate Button */}
          {currentOrder.paymentStatus !== 'successful' && currentOrder.orderStatus === 'pending' && (
            <div className="payment-confirmation-section" style={{
              backgroundColor: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#856404', marginBottom: '15px' }}>
                ⚠️ Payment Confirmation Required
              </h3>
              <p style={{ marginBottom: '15px', color: '#856404' }}>
                Review the payment proof above and confirm if the payment is valid.
              </p>
              <button
                onClick={confirmPayment}
                disabled={confirmingPayment}
                className="admin-btn"
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: confirmingPayment ? 'not-allowed' : 'pointer',
                  opacity: confirmingPayment ? 0.6 : 1
                }}
              >
                {confirmingPayment ? '✓ Confirming Payment...' : '✓ Confirm Payment'}
              </button>
            </div>
          )}

          {/* Order Status Update Section */}
          <div className="update-section">
            <h3>Update Order & Payment Status</h3>
            <div style={{marginBottom: '0.5rem', color: '#555', fontSize: '0.95em'}}>
              <strong>Current paymentStatus:</strong> {String(paymentStatus)}
            </div>
            <div>
              <label>Order Status:</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <label style={{marginLeft: '1rem'}}>Payment Status:</label>
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                {paymentStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                onClick={updateStatus}
                disabled={loading || (status === currentOrder.orderStatus && paymentStatus === (currentOrder.paymentStatus || 'pending'))}
                className="admin-btn update"
                style={{marginLeft: '1rem'}}>
                {loading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
            {error && (
              <div className="error-text" style={{whiteSpace: 'pre-wrap', color: 'red', marginTop: '1rem'}}>
                <strong>Update Error/Debug Info:</strong>
                <br />
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;