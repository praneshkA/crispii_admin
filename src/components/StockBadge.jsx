import React from 'react';

const StockBadge = ({ stock }) => {

  const isOutOfStock = stock <= 0;

  return (

    <span
      className={
        isOutOfStock
          ? 'stock-badge out'
          : 'stock-badge in'
      }
    >
      {
        isOutOfStock
          ? 'Out Of Stock'
          : 'In Stock'
      }
    </span>

  );

};

export default StockBadge;