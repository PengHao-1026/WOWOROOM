// 請代入自己的網址路徑
const api_path = "peng";
const token = "4FilgCeGL5XWOS7jmjxmjDQNP4Z2";

// 彈跳視窗
const MySwal = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    width: 280
  });



// 宣告DOM
let orderData = [] ;
let orderList = document.querySelector('.order-list');



// 取得訂單列表
function getOrderList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        orderData = response.data.orders;
        renderOrderList();
        editOrderList();
        deleteAllOrder();
        deleteOrderItem();
        renderC3();
      })
}
getOrderList();

function renderOrderList(){
    let tr = '';
    orderData.forEach((v) => {
        // 處理付款
        let orderStatus = '';
        if (v.paid==true){
            orderStatus = '已付款';
        } else {
            orderStatus = '未付款';
        }
        // 處理訂單物品、數量
        let titleStr = '';
        v.products.forEach((i) => {
            titleStr += `<p>${i.title}*${i.quantity}</p>`;
        });
        // 處理時間
        let time = new Date(v.createdAt*1000);
        let orderTime = `${time.getFullYear()}/${time.getMonth()+1}/${time.getDate()}`
        // 處理整個tbody
        tr += `
            <tr>
                <td>${v.id}</td>
                <td>
                <p>${v.user.name}</p>
                <p>${v.user.tel}</p>
                </td>
                <td>${v.user.address}</td>
                <td>${v.user.email}</td>
                <td>
                ${titleStr}
                </td>
                <td>${orderTime}</td>
                <td>
                <a href="#" class="orderStatus" data-id="${v.id}">${orderStatus}</a>
                </td>
                <td>
                <input type="button" class="delSingleOrder-Btn" data-id="${v.id}" value="刪除">
                </td>
            </tr>
            `; 
    });
    orderList.innerHTML = tr ;
}


// 修改訂單狀態 
function editOrderList() {
    let orderStatus = document.querySelectorAll('.orderStatus');
    orderStatus.forEach((v) => {
        v.addEventListener('click',(e) => {
            e.preventDefault();
            // 取值訂單id、訂單狀態
            let orderId = e.target.dataset.id;
            let status = e.target.textContent;
            // 更改訂單狀態
            let newStatus = '';
            if (status == '未付款') {
                newStatus = true;
            } else {
                newStatus = false;
            }
            // PUT之後渲染畫面
            axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
            {
                "data": {
                    "id": orderId,
                    "paid": newStatus
                }
            },
            {
                headers: {
                'Authorization': token
                }
            })
            .then(function (response) {
                MySwal.fire({
                    icon: 'success',
                    text: '已修改訂單狀態',
                    timer: 2000 
                  });
                getOrderList();
            })
        });
    });
}
  
// 刪除全部訂單
function deleteAllOrder() {
    let discardAllBtn = document.querySelector('.discardAllBtn');
        discardAllBtn.addEventListener('click',(e) => {
            e.preventDefault();
            axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
                headers: {
                'Authorization': token
                }
            })
            .then(function (response) {
                MySwal.fire({
                    icon: 'success',
                    text: '已刪除全部訂單',
                    timer: 2000 
                  });
                getOrderList();
            })
        });
}
  
// 刪除特定訂單
function deleteOrderItem() {
    let delSingleOrderBtn = document.querySelectorAll('.delSingleOrder-Btn');
        delSingleOrderBtn.forEach((v) => {
            v.addEventListener('click',(e) => {
                let orderId = e.target.dataset.id ;
                axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
                {
                headers: {
                    'Authorization': token
                }
                })
                .then(function (response) {
                    MySwal.fire({
                        icon: 'success',
                        text: '已刪除此訂單',
                        timer: 2000 
                      });
                    getOrderList();
                })
            })
        });
}

// 圖表
function renderC3(){
    let obj = {};
    orderData.forEach( item => {
        item.products.forEach( v => {
            if (obj[v.category] == undefined){
                obj[v.category] = v.price*v.quantity ;
            } else {
                obj[v.category] += v.price*v.quantity
            }
        })
    })
    let categoryArr = Object.keys(obj);
    let newData = [];
    categoryArr.forEach( v => {
        let arr = [];
        arr.push(v);
        arr.push(obj[v]);
        newData.push(arr);
    })
    // C3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData
        },
    });
}