
class Product {

    constructor(name, type, img, link, description, price, width, height, offsetX, offsetY) {
        this.name = name;
        this.type = type;
        this.img = img;
        this.link = link;
        this.description = description;
        this.price = price;
        this.size = { width, height };
        this.offset = { x: offsetX, y: offsetY };
    }

}
