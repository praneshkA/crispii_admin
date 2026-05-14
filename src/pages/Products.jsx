import React, {
  useEffect,
  useState,
} from 'react';

import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateAllProductStock,
} from '../services/productService';

import '../styles/products.css';

const Products = () => {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [editingProduct, setEditingProduct] =
    useState(null);

  // ================= BULK STOCK STATE =================

  const [bulkStock, setBulkStock] =
    useState('');

  const [bulkError, setBulkError] =
    useState('');

  const [bulkLoading, setBulkLoading] =
    useState(false);

  // ================= FETCH PRODUCTS =================

  const fetchProducts = async () => {

    try {

      setLoading(true);

      const data = await getProducts();

      setProducts(data);

    } catch (err) {

      console.error(err);

      setError(
        'Failed to fetch products'
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  // ================= BULK STOCK =================

  const handleBulkStockChange = (e) => {

    setBulkStock(e.target.value);

    setBulkError('');

  };

  const handleBulkStockUpdate = async () => {

    const value = Number(bulkStock);

    if (bulkStock === '') {

      setBulkError(
        'Stock value is required.'
      );

      return;

    }

    if (
      isNaN(value) ||
      value < 0
    ) {

      setBulkError(
        'Stock must be a non-negative number.'
      );

      return;

    }

    setBulkLoading(true);

    try {

      await updateAllProductStock(value);

      setBulkStock('');

      setBulkError('');

      await fetchProducts();

      alert(
        'All product stocks updated successfully'
      );

    } catch (err) {

      setBulkError(
        err.response?.data?.message ||
          'Failed to update all product stocks'
      );

    } finally {

      setBulkLoading(false);

    }

  };

  // ================= CREATE / UPDATE =================

  const handleSubmit = async (
    productData
  ) => {

    try {

      if (editingProduct) {

        await updateProduct(
          editingProduct._id,
          productData
        );

      } else {

        await createProduct(
          productData
        );

      }

      setEditingProduct(null);

      fetchProducts();

    } catch (err) {

      console.error(err);

      throw err;

    }

  };

  // ================= DELETE =================

  const handleDelete = async (
    productId
  ) => {

    const confirmed = window.confirm(
      'Delete this product?'
    );

    if (!confirmed) return;

    try {

      await deleteProduct(productId);

      fetchProducts();

    } catch (err) {

      console.error(err);

      alert(
        'Failed to delete product'
      );

    }

  };

  // ================= EDIT =================

  const handleEdit = (product) => {

    setEditingProduct(product);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  };

  return (

    <div className="products-page">

      {/* HEADER */}

      <div className="products-header">

        <h1 className="products-title">
          Product Management
        </h1>

      </div>

      {/* BULK STOCK UPDATE */}

      <div
        className="bulk-stock-update"
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          background: '#fff',
          borderRadius: '8px',
          boxShadow:
            '0 2px 8px rgba(0,0,0,0.05)',
          maxWidth: 500,
          width: '100%',
        }}
      >

        <h2
          style={{
            marginBottom: '1rem',
            fontWeight: 600,
            fontSize: '1.2rem',
          }}
        >
          Bulk Stock Update
        </h2>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >

          <input
            type="number"
            min="0"
            value={bulkStock}
            onChange={handleBulkStockChange}
            placeholder="Enter new stock value"
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: 180,
              fontSize: '1rem',
            }}
            disabled={bulkLoading}
          />

          <button
            onClick={
              handleBulkStockUpdate
            }
            disabled={bulkLoading}
            style={{
              padding:
                '0.5rem 1.5rem',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: bulkLoading
                ? 'not-allowed'
                : 'pointer',
            }}
          >

            {bulkLoading
              ? 'Updating...'
              : 'Update All Stocks'}

          </button>

        </div>

        {bulkError && (

          <div
            style={{
              color: 'red',
              marginTop: '0.5rem',
              fontSize: '0.95rem',
            }}
          >
            {bulkError}
          </div>

        )}

      </div>

      {/* PRODUCT FORM */}

      <ProductForm
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        onCancel={() =>
          setEditingProduct(null)
        }
      />

      {/* PRODUCT TABLE */}

      {loading ? (

        <p>Loading products...</p>

      ) : error ? (

        <p>{error}</p>

      ) : (

        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      )}

    </div>

  );

};

export default Products;