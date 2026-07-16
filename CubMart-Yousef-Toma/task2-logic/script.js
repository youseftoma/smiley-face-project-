const catalog = [
    { name: "Laptop", price: 999.99, category: "electronics", stock: 10 },
    { name: "Smartphone", price: 699.99, category: "electronics", stock: 20 },
    { name: "Headphones", price: 199.99, category: "electronics", stock: 15 },
    { name: "T-Shirt", price: 19.99, category: "fashion", stock: 50 },
    { name: "Jeans", price: 49.99, category: "fashion", stock: 30 },
    { name: "Jacket", price: 89.99, category: "fashion", stock: 25 },
    { name: "Blender", price: 59.99, category: "home", stock: 10 },
    { name: "Microwave", price: 149.99, category: "home", stock: 5 },
    { name: "Toaster", price: 29.99, category: "home", stock: 8 }
];

const promoCodes = [
    { code: "50EGP", discount: 50 },
    { code: "100EGP", discount: 100 },
    { code: "150EGP", discount: 150 }
];

let cart = [];
let activePromoDiscount = 0;
const TAX_RATE = 0.14;

function formatProducts(products) {
    if (products.length === 0) {
        return "No products found in that category.";
    }

    let output = "--- CubMart Catalog ---\n";
    for (let product of products) {
        output += `${product.name} - EGP ${product.price.toFixed(2)} | Category: ${product.category} | Stock: ${product.stock}\n`;
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

function getDiscountRate(subtotal) {
    if (subtotal > 1000) {
        return 0.15;
    } else if (subtotal > 600) {
        return 0.10;
    } else if (subtotal > 300) {
        return 0.05;
    }
    return 0;
}

function applyPromoCode(code) {
    const promo = promoCodes.find(item => item.code.toUpperCase() === code.toUpperCase());
    if (promo) {
        activePromoDiscount = promo.discount;
        return true;
    }

    activePromoDiscount = 0;
    return false;
}

function calculateTax(subtotal, discountAmount) {
    const taxableAmount = subtotal - discountAmount;
    return taxableAmount * TAX_RATE;
}

function generateReceipt() {
    const subtotal = calculateSubtotal();
    const discountRate = getDiscountRate(subtotal);
    const tierDiscount = subtotal * discountRate;
    const totalDiscount = tierDiscount + activePromoDiscount;
    const taxAmount = calculateTax(subtotal, totalDiscount);
    const finalTotal = subtotal - totalDiscount + taxAmount;

    let receipt = "--- CubMart Receipt ---\n";
    for (let item of cart) {
        const itemTotal = item.price * item.quantity;
        receipt += `${item.name} x${item.quantity} - EGP ${itemTotal.toFixed(2)}\n`;
    }

    receipt += "-----------------------------------\n";
    receipt += `Subtotal: EGP ${subtotal.toFixed(2)}\n`;

    if (tierDiscount > 0) {
        receipt += `Tier Discount (${(discountRate * 100).toFixed(0)}%): -EGP ${tierDiscount.toFixed(2)}\n`;
    }

    if (activePromoDiscount > 0) {
        receipt += `Promo Discount: -EGP ${activePromoDiscount.toFixed(2)}\n`;
    }

    receipt += `Tax (14%): EGP ${taxAmount.toFixed(2)}\n`;
    receipt += `Grand Total: EGP ${finalTotal.toFixed(2)}\n\n`;
    receipt += "Thank you for shopping at CubMart!";

    return receipt;
}

do {
    cart = [];
    activePromoDiscount = 0;

    const browseCategory = prompt("Which category would you like to browse? (electronics, fashion, home)");
    if (browseCategory !== null) {
        const selectedCategory = browseCategory.trim().toLowerCase();
        const filteredProducts = catalog.filter(product => product.category.toLowerCase() === selectedCategory);
        alert(formatProducts(filteredProducts));
    }

    let keepOrdering = true;
    while (keepOrdering) {
        const productName = prompt("Enter a product name to add to your order. Type 'done' when finished.");

        if (productName === null) {
            break;
        }

        if (productName.trim().toLowerCase() === "done") {
            keepOrdering = false;
            break;
        }

        const product = catalog.find(item => item.name.toLowerCase() === productName.trim().toLowerCase());

        if (!product) {
            alert("That product is not available in the catalog. Please try again.");
            continue;
        }

        const quantityInput = prompt(`How many ${product.name} would you like to add? (Available stock: ${product.stock})`);
        if (quantityInput === null) {
            continue;
        }

        const quantity = Number(quantityInput);
        if (!Number.isInteger(quantity) || quantity <= 0) {
            alert("Please enter a valid whole number greater than zero.");
            continue;
        }

        if (quantity > product.stock) {
            alert("Not enough stock available. Please choose a smaller quantity.");
            continue;
        }

        product.stock -= quantity;

        const existingItem = cart.find(item => item.name.toLowerCase() === product.name.toLowerCase());
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }

        alert(`Added ${quantity} x ${product.name} to your cart.`);
    }

    if (cart.length === 0) {
        alert("Your cart is empty. No order was placed.");
    } else {
        const codeInput = prompt("Do you have a promo code? Enter it here or leave blank to skip.(50EGP, 100EGP, 150EGP)");
        if (codeInput !== null && codeInput.trim() !== "") {
            if (applyPromoCode(codeInput)) {
                alert("Promo code applied successfully!");
            } else {
                alert("Invalid promo code. No extra discount was applied.");
            }
        }

        alert(generateReceipt());
    }
} while (confirm("Would you like to place another order?"));

alert("Thank you for shopping at CubMart!");
