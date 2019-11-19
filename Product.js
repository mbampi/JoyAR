
class Product {

    constructor(name, type, img, link, price, width, height, offsetX, offsetY) {
        this.name = name;
        this.type = type;
        this.img = img;
        this.link = link;
        this.price = price;
        this.size = { width, height };
        this.offset = { x: offsetX, y: offsetY };
    }

}
