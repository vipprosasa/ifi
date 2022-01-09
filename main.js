const data_local = JSON.parse(localStorage.getItem("item-buy"));

window.onload = () => {
    let product;
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", "./db.json", true);
    rawFile.onreadystatechange = () => {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            const data = JSON.parse(rawFile.responseText);
            product = data.product;
            function UpdateDataWhenReload() {
                data_local
                    ? data_local.forEach((item) => {
                          product.forEach((items) => {
                              item && items
                                  ? item.nameProduct === items.nameProduct
                                      ? (items.wasBuy = item.wasBuy)
                                      : false
                                  : false;
                          });
                      })
                    : product.forEach((item) => {
                          item.wasBuy = 0;
                      });
            }
            UpdateDataWhenReload();
            const renderCardProduct = () => {
                const parent = document.querySelector(".product-list")
                    ? document.querySelector(".product-list")
                    : document.querySelector(".hot-offer-item");
                product.map((item, index) => {
                    let card = `						
					<div class="col-md-3">
					<div class="product-list-item">
						<div class="tag">
							<img
								${item.imgTag ? (src = "item.imgTag") : false}
								alt=""
							/>
						</div>
						<div class="product-list-item1">
							<div class="list-item1-top">
								<a href=""
									><img
										src="${item.imgProduct}"
								/></a>
								<p>${item.nameProduct} (1 kg)</p>
								<h4>
									$${item.priceAfter}
									<span>$${item.priceBefore}</span>
								</h4>
							</div>
							<div class="hot-offer-button">
								<button class="add-cart" id="${index}">
									Add To Cart
								</button>
							</div>
						</div>
					</div>
				</div>
			`; //render product
                    parent.innerHTML += card;
                });
            };

            const parent = document.querySelector("#cartdrop-down");

            function renderListItem() {
                let item_buy = localStorage.getItem("item-buy");
                if (item_buy == null) {
                    list_product_buy = [];
                } else {
                    list_product_buy = JSON.parse(item_buy);
                }
                let card = "";
                list_product_buy.map((item) => {
                    //thay đổi class của cái thẻ (1) ở đây, nếu thay cả cái class của button thì phải đổi class delete ở cái dưới
                    // Cái card này render những hàng đã mua trong cart
                    card += `
							<div class="item-buy"> 
							<p>${item.nameProduct}</p>
							<span>$${Math.round(item.priceBefore * item.wasBuy, 3)}</span>
							<input type="number" min="1" value="${item.wasBuy}" />
							<button class="delete">
							<i class="fas fa-trash"></i>
								</button>
								</div>
								`; //render produt đã mua
                });
                parent.innerHTML += card;
                parent.innerHTML += '<button id="update-cart">Update</button>';
                const item_buy_task = document.querySelectorAll(".item-buy");
                item_buy_task.forEach((item, index) => {
                    item.querySelector("input").addEventListener(
                        "input",
                        (e) => {
                            if (
                                e.target.value <= 0 ||
                                e.target.value == "e" ||
                                e.target.value == "E"
                            ) {
                                e.target.value = 1;
                            } else {
                                parent
                                    .querySelector("#update-cart")
                                    .addEventListener("click", () => {
                                        let item_buy =
                                            localStorage.getItem("item-buy");
                                        list_product_buy = JSON.parse(item_buy);
                                        new_list_product = list_product_buy;
                                        new_list_product[index].wasBuy =
                                            parseInt(e.target.value);
                                        localStorage.setItem(
                                            "item-buy",
                                            JSON.stringify(new_list_product),
                                        );
                                    });
                            }
                        },
                    );
                });
                let ItemInCart = document
                    .querySelector("#cartdrop-down")
                    .querySelectorAll(".item-buy .delete"); // item-buy là cái class của div (1) chứa tên, ảnh, nút xóa. Nếu đổi thì phải đổi cả cái item-buy sang 1 cái khác
                ItemInCart.forEach((item) => {
                    item.addEventListener("click", () => {
                        deleteItem(
                            item.parentNode.querySelector("p").innerHTML,
                        );
                    });
                });
            }

            renderListItem();
            renderCardProduct();

            $(".dropcart").on("click", () => {
                $("#cartdrop-down").addClass("show");
            }); //hiện mục hàng được mua ở View Product Card

            $(".add-cart").on("click", (e) => {
                let item_buy = localStorage.getItem("item-buy");
                let buy = product[e.target.id];
                if (item_buy == null) {
                    list_product_buy = [];
                } else {
                    list_product_buy = JSON.parse(item_buy);
                }

                list_product_buy = list_product_buy.filter((item) => {
                    return item.nameProduct !== buy.nameProduct;
                });

                list_product_buy.push(buy);

                Array.isArray(list_product_buy)
                    ? list_product_buy.forEach((item) => {
                          item
                              ? item.nameProduct === buy.nameProduct
                                  ? item.wasBuy
                                      ? item.wasBuy++
                                      : Object.assign(buy, { wasBuy: 1 })
                                  : false
                              : false;
                      })
                    : Object.assign(buy, { wasBuy: 1 });

                localStorage.setItem(
                    "item-buy",
                    JSON.stringify(list_product_buy),
                );
                parent.innerHTML = "";
                new renderListItem();
            });

            function deleteItem(itemName) {
                let item_buy = localStorage.getItem("item-buy");
                list_product_buy = JSON.parse(item_buy);
                list_product_buy.forEach((item, index) => {
                    if (item.nameProduct === itemName) {
                        list_product_buy.splice(index, 1);
                        product.forEach((item2) => {
                            if (item.nameProduct === item2.nameProduct) {
                                item2.wasBuy = 0;
                            }
                        });
                    }
                });
                parent.innerHTML = "";
                localStorage.setItem(
                    "item-buy",
                    JSON.stringify(list_product_buy),
                );
                new renderListItem();
            }
        }
    };
    rawFile.send(null);
};
