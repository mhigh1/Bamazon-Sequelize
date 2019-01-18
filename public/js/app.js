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

const getProducts = function() {
    $.get('/api/products')
    .then(function(data){
        renderProducts(data);
    })
}
  
getProducts();