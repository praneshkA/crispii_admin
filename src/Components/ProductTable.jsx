import React from 'react';
import StockBadge from './StockBadge';

const ProductTable = ({
  products,
  onEdit,
  onDelete,
}) => {

  if (!products.length) {

    return (
      <div className="empty-products">
        No products found
      </div>
    );

  }

  return (

    <div className="product-table-wrapper">

      <table className="product-table">

        <thead>

          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr key={product._id}>

              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              </td>

              <td>{product.name}</td>

              <td>{product.category}</td>

              <td>₹{product.price}</td>

              <td>{product.stock}</td>

              <td>
                <StockBadge stock={product.stock} />
              </td>

              <td>

                <div className="product-actions">

                  <button
                    className="edit-btn"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(product._id)}
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

};

export default ProductTable;