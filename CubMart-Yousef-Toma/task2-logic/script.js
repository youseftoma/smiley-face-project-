let products_list = [
    {id: 1, name: "laptop", price: 999.99, quantity: 10, category: "electronics"},
    {id: 2, name: "smartphone", price: 699.99, quantity: 20, category: "electronics"},
    {id: 3, name: "headphones", price: 199.99, quantity: 15, category: "electronics"},
    {id: 4, name: "t-shirt", price: 19.99, quantity: 50, category: "clothing"},
    {id: 5, name: "jeans", price: 49.99, quantity: 30, category: "clothing"},
    {id: 6, name: "jacket", price: 89.99, quantity: 25, category: "clothing"},
    {id: 7, name: "blender", price: 59.99, quantity: 10, category: "home appliances"},
    {id: 8, name: "microwave", price: 149.99, quantity: 5, category: "home appliances"},
    {id: 9, name: "toaster", price: 29.99, quantity: 8, category: "home appliances"}
];

let promo_codes = [
    {code: "SAVE10", discount: 0.1},
    {code: "SAVE20", discount: 0.2},
    {code: "SAVE30", discount: 0.3}
];

let cart = [];
let activeDiscount = 0;
const TAX_RATE = 0.14;

function formatProducts(products) {
    if (products.length === 0) return "No products found.";
    let output = "--- Available Products ---\n";
    for (let product of products) {
        output += `[ID: ${product.id}] ${product.name} - $${product.price.toFixed(2)} (Stock: ${product.quantity}) | Category: ${product.category}\n`;
    }
    return output;
}

function calculateSubtotal() {
    let subtotal = 0;
    for (let item of cart) {
        subtotal += item.price * item.quantity;
    }
    return subtotal;
}

function getDiscountRate() {
    return activeDiscount;
}

function applyPromoCode(code) {
    let promo = promo_codes.find(p => p.code === code.toUpperCase());
    if (promo) {
        activeDiscount = promo.discount;
        return true;
    }
    return false;
}

function calculateTax(subtotal, discountAmount) {
    let taxableAmount = subtotal - discountAmount;
    return taxableAmount * TAX_RATE;
}

function generateReceipt() {
    let subtotal = calculateSubtotal();
    let discountRate = getDiscountRate();
    let discountAmount = subtotal * discountRate;
    let taxAmount = calculateTax(subtotal, discountAmount);
    let finalTotal = subtotal - discountAmount + taxAmount;

    let receipt = "--- Smiley Face Store Final Receipt ---\n";
    for (let item of cart) {
        let itemTotal = item.price * item.quantity;
        receipt += `${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}\n`;
    }
    receipt += "-----------------------------------\n";
    receipt += `Subtotal: $${subtotal.toFixed(2)}\n`;
    if (discountAmount > 0) {
        receipt += `Promo Discount (${discountRate * 100}%): -$${discountAmount.toFixed(2)}\n`;
    }
    receipt += `Tax (14%): $${taxAmount.toFixed(2)}\n`;
    receipt += `Total Amount Paid: $${finalTotal.toFixed(2)}\n\n`;
    receipt += "Thank you for shopping with smiley face store! 😊";
    
    return receipt;
}

while (true) {
    let menu = "Welcome to smiley face store! 🛒\nPlease select an option:\n\n" +
               "1. Display all products\n" +
               "2. Display products by category\n" +
               "3. Search for a product by name\n" +
               "4. Add products to the cart\n" +
               "5. Apply promo code\n" +
               "6. View cart\n" +
               "7. Checkout (Generate Receipt)\n" +
               "8. Exit Store entirely\n\n" +
               "Press Cancel or choose 8 to completely close application.";
               
    let rawChoice = prompt(menu);
    
    if (rawChoice === null || Number(rawChoice) === 8) {
        if (confirm("Are you sure you want to shut down the system and exit?")) {
            break;
        } else {
            continue;
        }
    }

    let choice = Number(rawChoice);

    if (choice === 1) {
        alert(formatProducts(products_list));
    } 
    else if (choice === 2) {
        let category = prompt("Enter the category (electronics, clothing, home appliances): ");
        if (category !== null) {
            category = category.toLowerCase();
            let filteredProducts = products_list.filter(product => product.category.toLowerCase() === category);
            alert(formatProducts(filteredProducts));
        }
    } 
    else if (choice === 3) {
        let searchName = prompt("Enter product name to search: ");
        if (searchName !== null) {
            searchName = searchName.toLowerCase();
            let foundProducts = products_list.filter(product => product.name.toLowerCase().includes(searchName));
            alert(formatProducts(foundProducts));
        }
    } 
    else if (choice === 4) {
        let productname = prompt("Enter the name of the product you want to add: ");
        if (productname !== null) {
            productname = productname.toLowerCase();
            let product = products_list.find(p => p.name === productname);

            if (!product) {
                alert("Product not found!");
            } else {
                let quantityInput = prompt(`How many "${product.name}" would you like to add?\n(Available Stock: ${product.quantity}): `);
                if (quantityInput !== null) {
                    let quantityToAdd = Number(quantityInput);
                    
                    if (quantityToAdd <= 0 || isNaN(quantityToAdd)) {
                        alert("Please enter a valid quantity.");
                    } else if (quantityToAdd > product.quantity) {
                        alert("Not enough stock available!");
                    } else {
                        product.quantity -= quantityToAdd;

                        let cartItem = cart.find(item => item.name === productname);
                        if (cartItem) {
                            cartItem.quantity += quantityToAdd;
                        } else {
                            cart.push({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                quantity: quantityToAdd
                            });
                        }
                        alert(`Successfully added ${quantityToAdd}x ${product.name} to your cart!`);
                    }
                }
            }
        }
    } 
    else if (choice === 5) {
        let codeInput = prompt("Enter promo code: ");
        if (codeInput !== null) {
            if (applyPromoCode(codeInput)) {
                alert(`Success! Promo code applied! (${getDiscountRate() * 100}% OFF)`);
            } else {
                alert("Invalid promo code.");
            }
        }
    } 
    else if (choice === 6) {
        if (cart.length === 0) {
            alert("Your cart is empty. 🛒");
        } else {
            let cartOutput = "--- Your Cart ---\n";
            for (let item of cart) {
                let itemTotal = item.price * item.quantity;
                cartOutput += `${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}\n`;
            }
            let currentSubtotal = calculateSubtotal();
            let currentDiscount = currentSubtotal * getDiscountRate();
            
            cartOutput += `\nSubtotal: $${currentSubtotal.toFixed(2)}`;
            if (currentDiscount > 0) {
                cartOutput += `\nActive Discount: -$${currentDiscount.toFixed(2)}`;
            }
            alert(cartOutput);
        }
    } 
    else if (choice === 7) {
        if (cart.length === 0) {
            alert("Your cart is empty. You cannot check out yet!");
            continue;
        }

        if (confirm("Are you ready to finalize your transaction and checkout?")) {
            alert(generateReceipt());
            cart = [];
            activeDiscount = 0;
            alert("Order processed successfully!\nStarting a brand new order session... 🔄");
        }
    } 
    else {
        alert("Invalid option. Please choose a number between 1 and 8.");
    }
}