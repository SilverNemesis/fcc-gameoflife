class Color {
    constructor(r, g, b) {
        this.r = r
        this.g = g
        this.b = b
    }

    toString() {
        return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
    }

    fromString(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (result) {
            this.r = parseInt(result[1], 16)
            this.g = parseInt(result[2], 16)
            this.b = parseInt(result[3], 16)
        }
    }
}

export default Color