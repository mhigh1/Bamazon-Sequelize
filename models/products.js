module.exports = function(connection, Sequelize) {
  const Product = connection.define('Product', {
    product_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    department_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    price: Sequelize.DECIMAL(2,10),
    stock_quantity: Sequelize.INTEGER
  });

  return Product;
};