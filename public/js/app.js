// DOM Ready
$(document).ready(function() {
    $('#products').on('click', 'button', function() {
        let itemNo = $(this).data('itemId');
        addItemToCart(itemNo);
    });

    $('#btnCart').on('click', function() {
        renderCart();
    });

    $('#cartModal').on('change',"input[name='quantity']", function() {
        updateCart($(this).data('itemId'), $(this).val());
    });

    $('#cartModal').on('click','button.btnDelete', function() {
        // Remove the item from the Cart array
        removeItemFromCart($(this).data('itemId'));
        
        // render the cart
        renderCart();
    });

    $('#cartModal').on('click','#btnCheckout', function() {
        processOrder();
    });
});

// Shopping Cart Array
const arrCart = [];

// Product Card Template
const tmplProductCard = function(itemId, name, price, photo) {
  return `
  <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
      <div class="card mb-3">
        <h5 class="card-title p-3">${name}</h5>
        <img class="card-img-top" src="./images/products/${photo}" alt="Photo of ${name}">
        <div class="card-body text-right">
            <p class="card-text">$${price}</p>
        </div>
        <div class="card-footer">
            <button type="button" class="btn btn-primary float-right" data-item-id="${itemId}">Add to Cart</button>
        </div>
      </div>
  </div>
  `
}

// Call the Products API to get the products
const getProducts = function() {
    $.get('/api/products')
    .then(function(data){
        renderProducts(data);
    });
}

// Render the Products
const renderProducts = function(array) {
    $('#products').empty();
    for (let i = 0; i < array.length; i++) {
        let itemId = array[i].id;
        let itemName = array[i].product_name;
        let price = array[i].price;
        let photo = array[i].photo;
        $('#products').append(tmplProductCard(itemId, itemName, price, photo));
    }
}

// Render the Cart
const renderCart = function() {
    $('div.modal-body').empty();
    
    // If cart is empty display empty notice, otherwise render cart
    if(arrCart.length === 0) {
        $('div.modal-body').html('<span class="font-italic">There are currently no items in your cart.</span>');
    } else {
        // Create the cart table
        let cartTable = $('<table>').attr("id","tblCartItems");
        cartTable.addClass('table table-sm');
        cartTable.append(`<thead><th scope="col" width="100%">Item</th><th scope="col" style="width: 50px;">Quantity</th><th scope="col" style="width: 50px;">Price</th><th scope="col" style="width: 50px;">Total</th><th scope="col" style="width: 50px;"></th></thead>`);
        cartTable.append(`<tbody></tbody>`);
        $(`div.modal-body`).html(cartTable);

        let orderTotal = 0;

        // Foreach item in the array, create a row and append to table
        arrCart.forEach(product => {
            
            let unitPrice = parseFloat(product.itemPrice, 2).toLocaleString();
            let lineTotal = parseFloat(product.qty * product.itemPrice, 2);
            orderTotal += parseFloat(lineTotal, 2);
            let row = `
                <tr>
                    <td>${product.itemName}</td>
                    <td class="text-center"><input type="text" class="text-center" style="width: 50px" name="quantity" value="${product.qty}" data-item-id="${product.itemNo}" /></td>
                    <td>$${unitPrice}</td>
                    <td>$${lineTotal.toLocaleString()}</td>
                    <td class="text-center"><button type="button" class="btn btnDelete" data-item-id="${product.itemNo}"><i class="fas fa-trash-alt"></i></button</td>
                </tr>
            `;
            $('#tblCartItems tbody').append(row);
        });

        $('#tblCartItems tbody').append(`<tr class="font-weight-bold"><td colspan="3" class="text-right">Total:</td><td>$${orderTotal.toLocaleString()}</td><td></td></tr>`);
    }
    // Update cart counter
    countCartItems();
}

// Count the number of items in the cart and render on Cart button
const countCartItems = function() {
    let count = 0;
    arrCart.forEach(product => {
        count += product.qty;
    });
    $('#cartCounter').html(`(${count})`);
}

// Add an Item to the Cart Array
const addItemToCart = function(itemNo) {
    // Call the API to get the item details
    $.get(`/api/product/${itemNo}`).then((data) => {
        
        // Create the item object based on the response
        let item = {
            itemNo: data.id,
            itemName: data.product_name,
            itemPrice: data.price,
            qty: 1,
            stockQty: data.stock_quantity
        }
        
        // If the item is not in the cart add it, otherwise increase the quantity by 1
        if(!arrCart.find(el => el.itemNo === item.itemNo)) {
            arrCart.push(item);
        } else {
            let pos = arrCart.findIndex(el => el.itemNo === item.itemNo);
            arrCart[pos].qty += 1;
        }

        // Update cart item count
        countCartItems();
    });

}

// Remove an Item from the Cart Array
const removeItemFromCart = function(itemNo) {
    let pos = arrCart.findIndex(el => el.itemNo === itemNo);
    arrCart.splice(pos, 1);
    countCartItems();
}

// Update the item quantity from cart
const updateCart = function(itemNo, qty) {
    
    // Cast qty as an integer
    qty = parseInt(qty, 10);
    
    // If qty eq 0 then remove the item from the cart, else update the qty in cart array
    if(qty === 0) {
        removeItemFromCart(itemNo);
        renderCart();
    } else {
        let pos = arrCart.findIndex(product => product.itemNo === itemNo);
        arrCart[pos].qty = qty;
        renderCart();
        countCartItems();
    }
}

// Process the order
const processOrder = function() {
    let cartModified = false;
    let messages = $('<ul>').attr("id","cartMessageList");
    
    // Foreach product in cart array, check the stock level
    arrCart.forEach(product => {
        if(product.qty > product.stockQty) {
            
            // Set the item qty to max available
            product.qty = product.stockQty;
            
            // Add qty adjusted message to messages
            messages.append(`<li>The quantity for '${product.itemName}' has been adjusted to the maximum available.</li>`);

            // Set cartModified to true
            cartModified = true;
        }
    });

    // If the cart was modified, render the updated cart and display notifications
    if(cartModified === true) {
        
        // Render the modified cart
        renderCart();
        
        // Display cart modified messages
        $('.modal-body').prepend(`<div id="cartMessageCenter" class="text-danger"></div>`);
        $('#cartMessageCenter').html(messages);
        $('#cartMessageList').append('<li>Please review the changes and resubmit your order.</li>');
    
    } else {

        // If no item quantites were changed, then remove each item qty from stock
        arrCart.forEach(product => {
            
            let data = {
                stock_quantity: (product.stockQty - product.qty) 
            };

            $.ajax({
                type: 'PUT',
                url: `/api/product/${product.itemNo}`,
                contentType: "application/json",
                data: JSON.stringify(data)
            });
        });

        // Display order submitted message
        $('.modal-body').empty();
        $('.modal-body').append(`<span class="text-success"><i class="far fa-check-circle"></i> Your order has been submitted successfully!</span>`);
        $('.modal-footer').html(`<button type="button" class="btn btn-secondary" data-dismiss="modal">Continue Shopping</button>`);

        // Empty the cart and reset the cart counter
        arrCart.length = 0;
        countCartItems();
        
    }
}

getProducts();