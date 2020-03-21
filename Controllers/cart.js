module.exports = class cart {
    constructor(cart) {
        this.items = cart.items || {};
    }
    add = (item, id) => {
        let cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = { idProduct: id, quantity: 0, price: 0 }
        }
        cartItem.quantity++;
    }
    remove = (id) =>{
        delete this.items[id]
        console.log("da xoa")
    }
}