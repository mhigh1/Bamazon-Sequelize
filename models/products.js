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
    price: Sequelize.DECIMAL(10,2),
    stock_quantity: Sequelize.INTEGER,
    photo: Sequelize.STRING
  });

  return Product;
};