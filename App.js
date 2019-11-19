
class App {

    constructor(screenSize) {
        this.currentProductIndex = 0;
        this.productList = this.loadProducts();
        this.currentProduct = this.productList[this.currentProductIndex];
        //this.productImg = new Image();
        //this.productImg.src = this.currentProduct.img;
        setProductsScale(screenSize);
    }

    loadProducts() {
        // load products from database 'where type == currentProduct.type

        let products = [
            { name: "Brinco 0", type: "earring", img: "img/brinco0.png", link: "www.usphera.com", price: '14.99', size: 40, offset: { x: 0, y: 0 } },
            //{ name: "Colar 0", type: "necklace", img: "img/colar0.png", size: 100, offset: { x: 0, y: 0 } },
            { name: "Brinco 1", type: "earring", img: "img/brinco1.png", link: "www.usphera.com", price: '200.00', size: 40, offset: { x: 0, y: 0 } },
            //{ name: "Colar 1", type: "necklace", img: "img/colar1.png", size: 100, offset: { x: 0, y: 0 } },
            { name: "Brinco 2", type: "earring", img: "img/brinco2.png", link: "www.usphera.com", price: '120.50', size: 40, offset: { x: 0, y: 0 } },
            //{ name: "Colar 2", type: "necklace", img: "img/colar2.png", size: 100, offset: { x: 0, y: 0 } }
        ];

        return products;
    }

    nextProduct() {
        if (this.currentProductIndex + 1 < this.productList.length) {
            this.setProduct(this.currentProductIndex + 1)
        } else {
            this.setProduct(0)
        }
    }

    previousProduct() {
        if (this.currentProductIndex - 1 >= 0) {
            this.setProduct(this.currentProductIndex - 1)
        } else {
            this.setProduct(this.productList.length - 1)
        }
    }

    setProduct(productIndex) {
        this.currentProductIndex = productIndex;
        this.currentProduct = this.productList[this.currentProductIndex];
        //this.productImg.src = this.currentProduct.img;
    }

}