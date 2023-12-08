// 請代入自己的網址路徑
const api_path = "peng";
const token = "4FilgCeGL5XWOS7jmjxmjDQNP4Z2";

let productWrap = document.querySelector('.productWrap') ;
let cartList = document.querySelector('.cartList') ;
let productData = [];
let cartData = [];

// 彈跳視窗
const MySwal = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  width: 280
});


// 取得產品列表
function getProductList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
    then(function (response) {
      productData = response.data.products ;
      renderProductList();
    })
}
getProductList();

function renderProductList(){  
    let ul = '';
      productData.forEach(function(v,i){
        ul += `
            <li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${v.images}" alt="產品圖片">
                <a href="#" class="addCardBtn" data-id="${v.id}">加入購物車</a>
                <h3>${v.title}</h3>
                <del class="originPrice">NT$${(v.origin_price).toLocaleString('zh-TW')}</del>
                <p class="nowPrice">NT$${(v.price).toLocaleString('zh-TW')}</p>
            </li>`;
      });
      productWrap.innerHTML = ul ;
}


// 取得購物車列表
let shoppingCartTable = document.querySelector('.shoppingCart-table')
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      cartData = response.data.carts ;
      renderCartList();
      if (cartData.length > 0) {
        deleteAllCartList();
        deleteCartItem();
      }
    })
}
getCartList();

function renderCartList(){  
    let resultPrice = 0 ;
    
    let headersRow = '';
    let ul = '';
    let totalPriceRow = '';

    headersRow = `
                <tr>
                    <th width="40%">品項</th>
                    <th width="15%">單價</th>
                    <th width="15%">數量</th>
                    <th width="15%">金額</th>
                    <th width="15%"></th>
                </tr> 
                `
    cartData.forEach((v) => {
        ul += `          
              <tr>
                  <td>
                      <div class="cardItem-title">
                          <img class="title-url" src="${v.product.images}" alt="">
                          <p class="title">${v.product.title}</p>
                      </div>
                  </td>
                  <td class="one-price">NT$${(v.product.price).toLocaleString('zh-TW')}</td>
                  <td class="num">${v.quantity}</td>
                  <td class="every-price">NT$${((v.product.price)*(v.quantity)).toLocaleString('zh-TW')}</td>
                  <td class="discardBtn">
                      <a href="#" class="material-icons" data-id="${v.id}">
                          clear
                      </a>
                  </td>
              </tr>
              `
        resultPrice += (v.product.price)*(v.quantity);
    });
    totalPriceRow =`
                  <tr>
                      <td>
                          <a href="#" class="discardAllBtn">刪除所有品項</a>
                      </td>
                      <td></td>
                      <td></td>
                      <td>
                          <p>總金額</p>
                      </td>
                      <td class="totalPrice">NT$${(resultPrice).toLocaleString('zh-TW')}</td>
                  </tr>
                  `
    shoppingCartTable.innerHTML = headersRow + ul + totalPriceRow ;
}


// 加入購物車
function addCartItem() {
  productWrap.addEventListener('click',function(e){
    if (e.target.classList == 'addCardBtn') {
        e.preventDefault();

        axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
        .then(function (response) {
          cartData = response.data.carts;
          let productId = e.target.getAttribute("data-id");
          let quantity = 0 ;
          
          const foundProduct = cartData.find(v => v.product.id === productId);

          if (foundProduct) {
              quantity = foundProduct.quantity + 1;
          } else {
              quantity = 1;
          }

          axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
            data: {
              "productId": productId,
              "quantity": quantity
            }
          }).then(function (response) {
            cartData = response.data.carts;
            MySwal.fire({
              icon: 'success',
              text: '已加入購物車!!',
              timer: 2000 
            });
            getCartList();
          })
        }) 
    }
  });
}
addCartItem();


// 清除購物車內全部產品
function deleteAllCartList() {
  let discardAllBtn = document.querySelector('.discardAllBtn');
  discardAllBtn.addEventListener('click',function(e){
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      cartData = response.data.carts ;
      MySwal.fire({
        icon: 'success',
        text: '已清空購物車!!',
        timer: 2000 
      });
      getCartList();
    })
  })
}


// 刪除購物車內特定產品
function deleteCartItem() {
  let discardBtn = document.querySelectorAll('.discardBtn');
  discardBtn.forEach((v) => {
    v.addEventListener('click',function(e){
      e.preventDefault();
      let itemId = e.target.dataset.id;
      axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${itemId}`)
      .then(function (response) {
        cartData = response.data.carts ;
        MySwal.fire({
          icon: 'success',
          text: '刪除成功!!',
          timer: 2000 
        });
        getCartList();
      })
    });
  });
    
}


// 送出購買訂單
function createOrder() {
  let orderInfoBtn = document.querySelector('.orderInfo-btn')
  let customerName = document.querySelector('#customerName')
  let customerPhone = document.querySelector('#customerPhone')
  let customerEmail = document.querySelector('#customerEmail')
  let customerAddress = document.querySelector('#customerAddress')
  let tradeWay = document.querySelector('#tradeWay')
  let formData = {};

  orderInfoBtn.addEventListener('click',(e) => {
    e.preventDefault();
      
    if (cartData == 0) {
      MySwal.fire({
        icon: 'warning',
        text: '請先加入購物車!!',
        timer: 2000 
      });
      return ;
    }
    if (customerName.value == '' || 
        customerPhone.value == '' || 
        customerEmail.value == '' || 
        customerAddress.value == '' || 
        tradeWay.value == '' ) {
    MySwal.fire({
      icon: 'warning',
      text: '請先填寫預定資料!!',
      timer: 2000 
    });
      return ;
    }
  
    formData = {
      "name": `${customerName.value}`,
      "tel": `${customerPhone.value}`,
      "email": `${customerEmail.value}`,
      "address": `${customerAddress.value}`,
      "payment": `${tradeWay.value}`
    }
  
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
      {
        "data": {
          "user": formData
        }
      }
    ).then(function (response) {
      MySwal.fire({
        icon: 'success',
        text: '訂單建立成功!!',
        timer: 2000 
      });
      getCartList();
      customerName.value = '' ; 
      customerPhone.value = '' ; 
      customerEmail.value = '' ; 
      customerAddress.value = '' ; 
      tradeWay.value = '' ;
    })
  });
}
createOrder();




