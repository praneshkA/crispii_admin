import '../styles/ProductForm.css';

import React, {
  useEffect,
  useState,
} from 'react';



const initialState = {

  name: '',
  category: '',
  image: '',

  prices: {

    "1000g": '',
    "500g": '',
    "250g": '',

  },

  stock: '',

};



const ProductForm = ({

  onSubmit,
  editingProduct,
  onCancel,

}) => {

  const [formData, setFormData] =
    useState({
      ...initialState,
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');



  // ================= EDIT MODE =================

  useEffect(() => {

    if (editingProduct) {

      setFormData({

        name:
          editingProduct.name || '',

        category:
          editingProduct.category || '',

        image:
          editingProduct.image || '',

        prices: {

          "1000g":
            editingProduct.prices?.[
              "1000g"
            ] || '',

          "500g":
            editingProduct.prices?.[
              "500g"
            ] || '',

          "250g":
            editingProduct.prices?.[
              "250g"
            ] || '',

        },

        stock:
          editingProduct.stock || '',

      });

    } else {

      setFormData({
        ...initialState,
      });

    }

  }, [editingProduct]);




  // ================= NORMAL INPUT CHANGE =================

  const handleChange = (e) => {

    const { name, value } =
      e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));

  };




  // ================= PRICE INPUT CHANGE =================

  const handlePriceChange = (
    e
  ) => {

    const { name, value } =
      e.target;

    setFormData((prev) => ({

      ...prev,

      prices: {

        ...(prev.prices || {}),

        [name]: value,

      },

    }));

  };




  // ================= SUBMIT =================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    setError('');



    // ================= REQUIRED VALIDATION =================

    if (

      !formData.name ||
      !formData.category ||
      !formData.image ||

      formData.prices?.["1000g"] === '' ||
      formData.prices?.["500g"] === '' ||
      formData.prices?.["250g"] === '' ||

      formData.stock === ''

    ) {

      return setError(
        'All fields are required'
      );

    }



    // ================= PRICE VALIDATION =================

    if (

      Number(
        formData.prices?.["1000g"]
      ) < 0 ||

      Number(
        formData.prices?.["500g"]
      ) < 0 ||

      Number(
        formData.prices?.["250g"]
      ) < 0

    ) {

      return setError(
        'Prices cannot be negative'
      );

    }



    // ================= STOCK VALIDATION =================

    if (
      Number(formData.stock) < 0
    ) {

      return setError(
        'Stock cannot be negative'
      );

    }



    try {

      setLoading(true);

      await onSubmit({

        name:
          formData.name,

        category:
          formData.category,

        image:
          formData.image,

        prices: {

          "1000g": Number(
            formData.prices?.[
              "1000g"
            ]
          ),

          "500g": Number(
            formData.prices?.[
              "500g"
            ]
          ),

          "250g": Number(
            formData.prices?.[
              "250g"
            ]
          ),

        },

        stock: Number(
          formData.stock
        ),

      });

      setFormData({
        ...initialState,
      });

    } catch (err) {

      setError(

        err.response?.data
          ?.message ||

        'Something went wrong'

      );

    } finally {

      setLoading(false);

    }

  };




  return (

    <form
      className="product-form"
      onSubmit={handleSubmit}
    >

      <h2 className="form-title">

        {
          editingProduct
            ? 'Edit Product'
            : 'Add Product'
        }

      </h2>



      {error && (

        <div className="form-error">

          {error}

        </div>

      )}



      {/* ================= PRODUCT NAME ================= */}

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
      />



      {/* ================= CATEGORY ================= */}

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />



      {/* ================= IMAGE ================= */}

      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
      />



      {/* ================= PRICE 1000g ================= */}

      <input
        type="number"
        name="1000g"
        placeholder="Price for 1000g"
        value={
          formData.prices?.[
            "1000g"
          ] || ''
        }
        onChange={
          handlePriceChange
        }
      />



      {/* ================= PRICE 500g ================= */}

      <input
        type="number"
        name="500g"
        placeholder="Price for 500g"
        value={
          formData.prices?.[
            "500g"
          ] || ''
        }
        onChange={
          handlePriceChange
        }
      />



      {/* ================= PRICE 250g ================= */}

      <input
        type="number"
        name="250g"
        placeholder="Price for 250g"
        value={
          formData.prices?.[
            "250g"
          ] || ''
        }
        onChange={
          handlePriceChange
        }
      />



      {/* ================= STOCK ================= */}

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
      />



      {/* ================= ACTION BUTTONS ================= */}

      <div className="form-actions">

        <button
          type="submit"
          className="save-btn"
          disabled={loading}
        >

          {
            loading
              ? 'Saving...'
              : editingProduct
                ? 'Update Product'
                : 'Add Product'
          }

        </button>



        {editingProduct && (

          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
          >

            Cancel

          </button>

        )}

      </div>

    </form>

  );

};

export default ProductForm;