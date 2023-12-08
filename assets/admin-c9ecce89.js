import"./all-25b8e26f.js";const o="peng",n="4FilgCeGL5XWOS7jmjxmjDQNP4Z2",c=Swal.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,width:280});let u=[],p=document.querySelector(".order-list");function s(){axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${o}/orders`,{headers:{Authorization:n}}).then(function(r){u=r.data.orders,h(),f(),m(),$(),g()})}s();function h(){let r="";u.forEach(e=>{let i="";e.paid==!0?i="已付款":i="未付款";let d="";e.products.forEach(l=>{d+=`<p>${l.title}*${l.quantity}</p>`});let t=new Date(e.createdAt*1e3),a=`${t.getFullYear()}/${t.getMonth()+1}/${t.getDate()}`;r+=`
            <tr>
                <td>${e.id}</td>
                <td>
                <p>${e.user.name}</p>
                <p>${e.user.tel}</p>
                </td>
                <td>${e.user.address}</td>
                <td>${e.user.email}</td>
                <td>
                ${d}
                </td>
                <td>${a}</td>
                <td>
                <a href="#" class="orderStatus" data-id="${e.id}">${i}</a>
                </td>
                <td>
                <input type="button" class="delSingleOrder-Btn" data-id="${e.id}" value="刪除">
                </td>
            </tr>
            `}),p.innerHTML=r}function f(){document.querySelectorAll(".orderStatus").forEach(e=>{e.addEventListener("click",i=>{i.preventDefault();let d=i.target.dataset.id,t=i.target.textContent,a="";t=="未付款"?a=!0:a=!1,axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${o}/orders`,{data:{id:d,paid:a}},{headers:{Authorization:n}}).then(function(l){c.fire({icon:"success",text:"已修改訂單狀態",timer:2e3}),s()})})})}function m(){document.querySelector(".discardAllBtn").addEventListener("click",e=>{e.preventDefault(),axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${o}/orders`,{headers:{Authorization:n}}).then(function(i){c.fire({icon:"success",text:"已刪除全部訂單",timer:2e3}),s()})})}function $(){document.querySelectorAll(".delSingleOrder-Btn").forEach(e=>{e.addEventListener("click",i=>{let d=i.target.dataset.id;axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${o}/orders/${d}`,{headers:{Authorization:n}}).then(function(t){c.fire({icon:"success",text:"已刪除此訂單",timer:2e3}),s()})})})}function g(){let r={};u.forEach(d=>{d.products.forEach(t=>{r[t.category]==null?r[t.category]=t.price*t.quantity:r[t.category]+=t.price*t.quantity})});let e=Object.keys(r),i=[];e.forEach(d=>{let t=[];t.push(d),t.push(r[d]),i.push(t)}),c3.generate({bindto:"#chart",data:{type:"pie",columns:i}})}
