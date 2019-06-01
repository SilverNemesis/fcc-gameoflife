import Design from './Design'

class Game {
    constructor(width, height, parameter, value) {
        this.names = Design.getNames()
        this.resize(width, height)
        this.initialize(parameter, value)
    }

    initialize(parameter, value) {
        this.generation = 0

        if (parameter === 'empty') {
            this.createEmptyGrid()
        } else if (parameter === 'random') {
            this.createRandomGrid(value)
        } else if (parameter === 'test') {
            this.createTestGrid(value)
        }
    }

    reset() {
        this.lastFrame = Date.now()
        this.grid = null
        this.generation = 0
    }

    resize(width, height) {
        this.reset()
        this.width = width
        this.height = height
    }

    doNothing() {
        this.lastFrame = Date.now()
    }

    drawCell(x, y, v) {
        if (!this.grid) {
            this.createEmptyGrid()
        }

        const base = this.grid
        const length = base.length
        const grid = new Array(length).fill(0)

        for (let i = 0; i < length; i++) {
            grid[i] = base[i]
        }

        const index = x + y * this.width

        if (v) {
            grid[index] = v
        } else {
            grid[index] = 0
        }

        this.grid = grid
    }

    drawItem(x, y, name) {
        if (!this.grid) {
            this.createEmptyGrid()
        }

        const base = this.grid
        const length = base.length
        const grid = new Array(length).fill(0)

        for (let i = 0; i < length; i++) {
            grid[i] = base[i]
        }

        Design.draw(grid, this.width, this.height, x, y, name)

        this.grid = grid
    }

    updateGeneration(speed) {
        this.thisFrame = Date.now()

        var elapsed = this.thisFrame - this.lastFrame

        const rate = 410 - speed * 4

        if (elapsed < rate) {
            return false
        }

        this.lastFrame = this.thisFrame

        if (!this.grid) {
            this.createEmptyGrid()
        }

        const base = this.grid
        const length = base.length
        const w = this.width
        const h = this.height
        const grid = new Array(length).fill(0)

        let m0
        let m2

        let n0
        let n1
        let n2

        let c
        let l
        let v

        for (let y = 0; y < h; y++) {
            n1 = y * w

            if (y === 0) {
                n0 = (h - 1) * w
                n2 = (y + 1) * w
            } else if (y === h - 1) {
                n0 = (y - 1) * w
                n2 = 0
            } else {
                n0 = (y - 1) * w
                n2 = (y + 1) * w
            }

            for (let x = 0; x < w; x++) {
                if (x === 0) {
                    m0 = w - 1
                    m2 = x + 1
                } else if (x === w - 1) {
                    m0 = x - 1
                    m2 = 0
                } else {
                    m0 = x - 1
                    m2 = x + 1
                }

                c = 0

                if (base[m0 + n0] !== 0) {
                    c++
                }
                if (base[x + n0] !== 0) {
                    c++
                }
                if (base[m2 + n0] !== 0) {
                    c++
                }
                if (base[m0 + n1] !== 0) {
                    c++
                }
                if (base[m2 + n1] !== 0) {
                    c++
                }
                if (base[m0 + n2] !== 0) {
                    c++
                }
                if (base[x + n2] !== 0) {
                    c++
                }
                if (base[m2 + n2] !== 0) {
                    c++
                }

                l = x + n1

                v = base[l]

                if (v) {
                    if (c === 2 || c === 3) {
                        grid[l] = v + 1
                    }
                } else {
                    if (c === 3) {
                        grid[l] = v + 1
                    }
                }
            }
        }

        this.grid = grid
        this.generation++

        return true
    }

    createEmptyGrid() {
        this.grid = new Array(this.width * this.height).fill(0)
    }

    createRandomGrid(value) {
        this.createEmptyGrid()

        const g = this.grid
        const l = g.length

        for (let i = 0; i < l; i++) {
            if (Math.random() < value) {
                g[i] = 1
            }
        }
    }

    createTestGrid(value) {
        this.createEmptyGrid()

        const l = this.names.length

        for (let i = 0; i < value; i++) {
            let dx = Math.floor(Math.random() * this.width)
            let dy = Math.floor(Math.random() * this.height)
            let j = Math.floor(Math.random() * l)
            Design.draw(this.grid, this.width, this.height, dx, dy, this.names[j])
        }
    }
}

export default Game