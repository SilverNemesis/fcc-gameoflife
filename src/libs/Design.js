const designs = [
    {
        name: 'Block',
        data: [
            0, 0, 1, 0, 0, 1, 1, 1
        ]
    },
    {
        name: 'Beehive',
        data: [
            1, 0, 2, 0, 0, 1, 3, 1, 1, 2, 2, 2
        ]
    },
    {
        name: 'Loaf',
        data: [
            1, 0, 2, 0, 0, 1, 3, 1, 1, 2, 3, 2, 2, 3
        ]
    },
    {
        name: 'Boat',
        data: [
            0, 0, 1, 0, 0, 1, 2, 1, 1, 2
        ]
    },
    {
        name: 'Tub',
        data: [
            1, 0, 0, 1, 2, 1, 1, 2
        ]
    },
    {
        name: 'Blinker',
        data: [
            0, 1, 1, 1, 2, 1
        ]
    },
    {
        name: 'Toad',
        data: [
            1, 1, 2, 1, 3, 1, 0, 2, 1, 2, 2, 2
        ]
    },
    {
        name: 'Beacon',
        data: [
            0, 0, 1, 0, 0, 1, 3, 2, 2, 3, 3, 3
        ]
    },
    {
        name: 'Pulsar',
        data: [
            2, 0, 3, 0, 4, 0, 8, 0, 9, 0, 10, 0, 0, 2, 5, 2, 7, 2, 12, 2, 0, 3, 5, 3, 7, 3, 12, 3, 0, 4, 5, 4, 7, 4, 12, 4, 2, 5, 3, 5, 4, 5, 8, 5, 9, 5, 10, 5, 2, 7, 3, 7, 4, 7, 8, 7, 9, 7, 10, 7, 0, 8, 5, 8, 7, 8, 12, 8, 0, 9, 5, 9, 7, 9, 12, 9, 0, 10, 5, 10, 7, 10, 12, 10, 2, 12, 3, 12, 4, 12, 8, 12, 9, 12, 10, 12
        ]
    },
    {
        name: 'Pentadecathon',
        data: [
            3, 2, 4, 2, 5, 2, 2, 3, 6, 3, 2, 4, 6, 4, 3, 5, 4, 5, 5, 5, 3, 10, 4, 10, 5, 10, 2, 11, 6, 11, 2, 12, 6, 12, 3, 13, 4, 13, 5, 13
        ]
    },
    {
        name: 'Glider',
        data: [
            1, 1, 2, 2, 3, 2, 1, 3, 2, 3
        ]
    },
    {
        name: 'LWSS',
        data: [
            2, 0, 3, 0, 1, 1, 2, 1, 3, 1, 4, 1, 1, 2, 2, 2, 4, 2, 5, 2, 3, 3, 4, 3
        ]
    },
    {
        name: 'R-pentomino',
        data: [
            1, 0, 2, 0, 0, 1, 1, 1, 1, 2
        ]
    },
    {
        name: 'Diehard',
        data: [
            6, 0, 0, 1, 1, 1, 1, 2, 5, 2, 6, 2, 7, 2
        ]
    },
    {
        name: 'Acorn',
        data: [
            1, 0, 3, 1, 0, 2, 1, 2, 4, 2, 5, 2, 6, 2
        ]
    },
    {
        name: 'Gosper\'s Glider Gun',
        data: [
            25, 0, 23, 1, 25, 1, 13, 2, 14, 2, 21, 2, 22, 2, 35, 2, 36, 2, 12, 3, 16, 3, 21, 3, 22, 3, 35, 3, 36, 3, 1, 4, 2, 4, 11, 4, 17, 4, 21, 4, 22, 4, 1, 5, 2, 5, 11, 5, 15, 5, 17, 5, 18, 5, 23, 5, 25, 5, 11, 6, 17, 6, 25, 6, 12, 7, 16, 7, 13, 8, 14, 8
        ]
    },
    {
        name: 'PatternX',
        data: [
            6, 0, 4, 1, 6, 1, 7, 1, 4, 2, 6, 2, 4, 3, 2, 4, 0, 5, 2, 5
        ]
    },
    {
        name: 'PatternY',
        data: [
            0, 0, 1, 0, 2, 0, 4, 0, 0, 1, 3, 2, 4, 2, 1, 3, 2, 3, 4, 3, 0, 4, 2, 4, 4, 4
        ]
    },
    {
        name: 'PatternZ',
        data: [
            0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 17, 0, 18, 0, 19, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 34, 0, 35, 0, 36, 0, 37, 0, 38, 0
        ]
    }
]

class Design {
    static getNames() {
        let names = []

        for (let i = 0; i < designs.length; i++) {
            names.push(designs[i].name)
        }

        return names
    }

    static draw(grid, width, height, x, y, name) {
        const design = designs.find((design) => {
            if (design.name === name) {
                return true
            }

            return false
        })

        const p = design.data
        const l = p.length
        let ax
        let ay

        for (let i = 0; i < l; i += 2) {
            ax = (x + p[i]) % width
            ay = (y + p[i + 1]) % height
            grid[ax + ay * width] = 1
        }
    }
}

export default Design