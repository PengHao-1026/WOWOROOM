import"./all-25b8e26f.js";const s="peng";let u=document.querySelector(".productWrap");document.querySelector(".cartList");let p=[],c=[];const l=Swal.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,width:280});function m(){axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${s}/products`).then(function(i){p=i.data.products,f()})}m();function f(){let i="";p.forEach(function(t,r){i+=`
            <li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${t.images}" alt="產品圖片">
                <a href="#" class="addCardBtn" data-id="${t.id}">加入購物車</a>
                <h3>${t.title}</h3>
                <del class="originPrice">NT$${t.origin_price.toLocaleString("zh-TW")}</del>
                <p class="nowPrice">NT$${t.price.toLocaleString("zh-TW")}</p>
            </li>`}),u.innerHTML=i}let v=document.querySelector(".shoppingCart-table");function d(){axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${s}/carts`).then(function(i){c=i.data.carts,$(),c.length>0&&(y(),x())})}d();function $(){let i=0,t="",r="",a="";t=`
                <tr>
                    <th width="40%">品項</th>
                    <th width="15%">單價</th>
                    <th width="15%">數量</th>
                    <th width="15%">金額</th>
                    <th width="15%"></th>
                </tr> 
                `,c.forEach(e=>{r+=`          
              <tr>
                  <td>
                      <div class="cardItem-title">
                          <img class="title-url" src="${e.product.images}" alt="">
                          <p class="title">${e.product.title}</p>
                      </div>
                  </td>
                  <td class="one-price">NT$${e.product.price.toLocaleString("zh-TW")}</td>
                  <td class="num">${e.quantity}</td>
                  <td class="every-price">NT$${(e.product.price*e.quantity).toLocaleString("zh-TW")}</td>
                  <td class="discardBtn">
                      <a href="#" class="material-icons" data-id="${e.id}">
                          clear
                      </a>
                  </td>
              </tr>
              `,i+=e.product.price*e.quantity}),a=`
                  <tr>
                      <td>
                          <a href="#" class="discardAllBtn">刪除所有品項</a>
                      </td>
                      <td></td>
                      <td></td>
                      <td>
                          <p>總金額</p>
                      </td>
                      <td class="totalPrice">NT$${i.toLocaleString("zh-TW")}</td>
                  </tr>
                  `,v.innerHTML=t+r+a}function g(){u.addEventListener("click",function(i){i.target.classList=="addCardBtn"&&(i.preventDefault(),axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${s}/carts`).then(function(t){c=t.data.carts;let r=i.target.getAttribute("data-id"),a=0;const e=c.find(o=>o.product.id===r);e?a=e.quantity+1:a=1,axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${s}/carts`,{data:{productId:r,quantity:a}}).then(function(o){c=o.data.carts,l.fire({icon:"success",text:"已加入購物車!!",timer:2e3}),d()})}))})}g();function y(){document.querySelector(".discardAllBtn").addEventListener("click",function(t){t.preventDefault(),axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${s}/carts`).then(function(r){c=r.data.carts,l.fire({icon:"success",text:"已清空購物車!!",timer:2e3}),d()})})}function x(){document.querySelectorAll(".discardBtn").forEach(t=>{t.addEventListener("click",function(r){r.preventDefault();let a=r.target.dataset.id;axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${s}/carts/${a}`).then(function(e){c=e.data.carts,l.fire({icon:"success",text:"刪除成功!!",timer:2e3}),d()})})})}function L(){let i=document.querySelector(".orderInfo-btn"),t=document.querySelector("#customerName"),r=document.querySelector("#customerPhone"),a=document.querySelector("#customerEmail"),e=document.querySelector("#customerAddress"),o=document.querySelector("#tradeWay"),n={};i.addEventListener("click",h=>{if(h.preventDefault(),c==0){l.fire({icon:"warning",text:"請先加入購物車!!",timer:2e3});return}if(t.value==""||r.value==""||a.value==""||e.value==""||o.value==""){l.fire({icon:"warning",text:"請先填寫預定資料!!",timer:2e3});return}n={name:`${t.value}`,tel:`${r.value}`,email:`${a.value}`,address:`${e.value}`,payment:`${o.value}`},axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${s}/orders`,{data:{user:n}}).then(function(S){l.fire({icon:"success",text:"訂單建立成功!!",timer:2e3}),d(),t.value="",r.value="",a.value="",e.value="",o.value=""})})}L();
