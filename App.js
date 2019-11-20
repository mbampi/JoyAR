
class App {

    constructor() {
        this.currentProductIndex = 0;
        let initialType = 'earring';
        this.productList = this.loadProducts(initialType);
        this.currentProduct = this.productList[this.currentProductIndex];
    }

    loadProducts(type = null) {
        // load products from database 'where type == currentProduct.type'
        if (type === null) {
            type = this.currentProduct.type;
        }

        let products = ''
        switch (type) {
            case 'earring':
                products = [
                    { name: "Brinco 0", type: "earring", img: "img/brinco0.png", link: "https://www.usphera.com", description: 'nice yellow cow earring', price: '14.99', size: 40, offset: { x: 0, y: 0 } },
                    { name: "Brinco 1", type: "earring", img: "img/brinco1.png", link: "https://www.usphera.com", description: 'fancy black diamond earring', price: '200.00', size: 40, offset: { x: 0, y: 0 } },
                    { name: "Brinco 2", type: "earring", img: "img/brinco2.png", link: "https://www.usphera.com", description: 'small cool earring', price: '120.50', size: 40, offset: { x: 0, y: 0 } },
                ];
                break;
            case 'necklace':
                products = [
                    { name: "Colar 0", type: "necklace", img: "img/colar0.png", link: "https://www.usphera.com", description: 'decricao colar 0', price: '14.99', size: 100, offset: { x: 0, y: 0 } },
                    { name: "Colar 1", type: "necklace", img: "img/colar1.png", link: "https://www.usphera.com", description: 'decricao colar 1', price: '200.00', size: 100, offset: { x: 0, y: 0 } },
                    { name: "Colar 2", type: "necklace", img: "img/colar2.png", link: "https://www.usphera.com", description: 'decricao colar 2', price: '120.50', size: 100, offset: { x: 0, y: 0 } }
                ];
                break;
        }

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
    }

}