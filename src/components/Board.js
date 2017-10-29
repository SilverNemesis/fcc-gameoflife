import React from 'react'
import PropTypes from 'prop-types'
import Color from '../libs/Color'

class Board extends React.Component {
    constructor(props) {
        super(props)
        this.border = 5
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onContextMenu = this.onContextMenu.bind(this)
    }

    componentDidMount() {
        var rect = this.canvas.getBoundingClientRect();
        this.dx = rect.left + this.border
        this.dy = rect.top + this.border
        this.drawGrid()
    }

    componentDidUpdate() {
        var rect = this.canvas.getBoundingClientRect();
        this.dx = rect.left + this.border
        this.dy = rect.top + this.border
        this.drawGrid()
    }

    onMouseDown(event) {
        if (event.button === 0) {
            this.x = Math.floor((event.clientX - this.dx) / this.props.cellSize)
            this.y = Math.floor((event.clientY - this.dy) / this.props.cellSize)
            this.drawing = true
            this.drawCell(this.x, this.y)
        }
    }

    onMouseMove(event) {
        this.x = Math.floor((event.clientX - this.dx) / this.props.cellSize)
        this.y = Math.floor((event.clientY - this.dy) / this.props.cellSize)

        if (this.drawing) {
            this.drawCell(this.x, this.y)
        }
    }

    onMouseUp(event) {
        if (event.button === 0) {
            this.drawing = false
        }
    }

    onContextMenu(event) {
        event.preventDefault()
        const x = Math.floor((event.clientX - this.dx) / this.props.cellSize)
        const y = Math.floor((event.clientY - this.dy) / this.props.cellSize)
        this.props.handleContextMenu(event.clientX, event.clientY, x, y)
    }

    drawCell(x, y) {
        if (x !== this.px || y !== this.py) {
            this.props.drawCell(x, y)
            this.px = x
            this.py = y
        }
    }

    drawGrid() {
        if (this.props.grid === this.grid && this.props.width === this.width && this.props.height === this.height && this.props.steps === this.steps && this.props.showGrid === this.showGrid) {
            return;
        }

        this.grid = this.props.grid
        this.width = this.props.width
        this.height = this.props.height
        this.steps = this.props.steps
        this.showGrid = this.props.showGrid

        const ctx = this.canvas.getContext('2d');

        ctx.lineWidth = 1

        const w = this.props.width
        const h = this.props.height
        const s = this.props.cellSize

        ctx.clearRect(0, 0, w * s, h * s)

        let rs

        if (this.props.showGrid && s > 2) {
            rs = s - 1

            ctx.strokeStyle = 'white'
            ctx.fillStyle = 'white'

            for (let y = 0; y < h; y++) {
                ctx.fillRect(0, y * s + rs, w * s, 1)
            }

            for (let x = 0; x < w; x++) {
                ctx.fillRect(x * s + rs, 0, 1, h * s)
            }
        } else {
            rs = s
        }

        if (!this.grid) {
            return;
        }

        const grid = this.props.grid
        const length = grid.length

        const color1 = this.props.color1.toString()
        const color2 = this.props.color2.toString()

        const r1 = this.props.color1.r
        const g1 = this.props.color1.g
        const b1 = this.props.color1.b

        const r2 = this.props.color2.r
        const g2 = this.props.color2.g
        const b2 = this.props.color2.b

        let r
        let g
        let b
        let colors = []

        const steps = this.props.steps

        for (let i = 1; i < steps; i++) {
            r = this.interpolate(r1, r2, steps, i)
            g = this.interpolate(g1, g2, steps, i)
            b = this.interpolate(b1, b2, steps, i)
            colors.push(new Color(r, g, b).toString())
        }

        const t = steps + 1

        let color

        for (let index = 0; index < length; index++) {
            const v = grid[index]

            if (v !== 0) {
                const x = index % w
                const y = Math.floor(index / w)

                if (v <= 2) {
                    ctx.strokeStyle = color1
                    ctx.fillStyle = color1
                } else if (v > t) {
                    ctx.strokeStyle = color2
                    ctx.fillStyle = color2
                } else {
                    color = colors[v - 3]
                    ctx.strokeStyle = color
                    ctx.fillStyle = color
                }

                ctx.fillRect(x * s, y * s, rs, rs)
            }
        }
    }

    interpolate(start, end, steps, count) {
        return Math.floor(start + (((end - start) / steps) * count))
    }

    render() {
        return (
            <canvas style={{ border: this.border + 'px solid white' }}
                ref={elem => this.canvas = elem} onContextMenu={this.onContextMenu}
                width={this.props.width * this.props.cellSize} height={this.props.height * this.props.cellSize}
                onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} />
        )
    }
}

Board.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    cellSize: PropTypes.number.isRequired,
    grid: PropTypes.arrayOf(
        PropTypes.number
    ),
    showGrid: PropTypes.bool.isRequired,
    color1: PropTypes.instanceOf(
        Color
    ).isRequired,
    color2: PropTypes.instanceOf(
        Color
    ).isRequired,
    steps: PropTypes.number.isRequired,
    drawCell: PropTypes.func.isRequired,
    handleContextMenu: PropTypes.func.isRequired
}

export default Board