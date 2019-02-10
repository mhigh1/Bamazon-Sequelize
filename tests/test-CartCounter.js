describe('countCartItems()', function() {
  // Test Sample Data
  const array0 = [];
  
  const array1 = [
    { itemNo: 1, itemName: 'Product A', itemPrice: 2.99, qty: 1, stockQty: 20 },
    { itemNo: 2, itemName: 'Product B', itemPrice: 5.99, qty: 3, stockQty: 10 },
    { itemNo: 3, itemName: 'Product C', itemPrice: 1.99, qty: 2, stockQty: 15 }
  ];

  const array2 = [
    { itemNo: 1, itemName: 'Product A', itemPrice: 2.99, qty: 1, stockQty: 20 },
    { itemNo: 2, itemName: 'Product B', itemPrice: 5.99, qty: '3', stockQty: 10 },
    { itemNo: 3, itemName: 'Product C', itemPrice: 1.99, qty: 2, stockQty: 15 }
  ];

  const array3 = [
    { itemNo: 1, itemName: 'Product A', itemPrice: 2.99, qty: 1, stockQty: 20 },
    { itemNo: 2, itemName: 'Product B', itemPrice: 5.99, stockQty: 10 },
    { itemNo: 3, itemName: 'Product C', itemPrice: 1.99, qty: 2, stockQty: 15 }
  ];

  it('should return a zero when the cart is empty', function() {
    expect(countCartItems(array0)).to.equal(0);
  });

  it('should return the total quantity of items in the cart', function() {
    expect(countCartItems(array1)).to.equal(6);
  });

  it('should return total quantity and coerce string values to an integer', function() {
    expect(countCartItems(array2)).to.equal(6);
  });

  it('should return undefined if any item quantity is null or empty', function() {
    expect(countCartItems(array3)).to.equal(undefined);
  });
});