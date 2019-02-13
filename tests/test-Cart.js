describe('removeItemFromCart()', function() {
  
    beforeEach(function() {
        arrCart.push({ itemNo: 1, itemName: 'Product A', itemPrice: 2.99, qty: 1, stockQty: 20 });
    });

    it('should remove an item from the cart array based on provided integer value', function() {
        removeItemFromCart(1);
        expect(arrCart).to.not.have.property('itemNo', 1);
    });
  
    it('should return true if the item was removed', function() {
        expect(removeItemFromCart(1)).to.be.true;
    });

    it('should return false if the item does not exists in cart array', function() {
        expect(removeItemFromCart(4)).to.be.false;
    });
    
    it('should return undefined if the value cannot be coerced to a integer', function() {
        expect(removeItemFromCart('string')).to.equal(undefined);
    });

});