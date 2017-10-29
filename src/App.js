import React from 'react'
import Game from './libs/Game'
import Slider from './components/Slider'
import Color from './libs/Color'
import ColorPicker from './components/ColorPicker'
import Board from './components/Board'

// Objective: Build a CodePen.io app that is functionally similar to this: https://codepen.io/FreeCodeCamp/full/reGdqx/.
// User Story: When I first arrive at the game, it will randomly generate a board and start playing.
// User Story: I can start and stop the board.
// User Story: I can set up the board.
// User Story: I can clear the board.
// User Story: When I press start, the game will play out.
// User Story: Each time the board changes, I can see how many generations have gone by.
// Hint: Here's an explanation of Conway's Game of Life from John Conway himself: https://www.youtube.com/watch?v=E8kUJL04ELA
// Hint: Here's an overview of Conway's Game of Life with rules for your reference: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life

class App extends React.Component {
    constructor(props) {
        super(props)

        this.runFrame = this.runFrame.bind(this)
        this.handleDrawCell = this.handleDrawCell.bind(this)
        this.handleContextMenu = this.handleContextMenu.bind(this)

        this.onClickRunPause = this.onClickRunPause.bind(this)
        this.onClickShowHideGrid = this.onClickShowHideGrid.bind(this)
        this.onClickClear = this.onClickClear.bind(this)

        this.onChangeSize = this.onChangeSize.bind(this)
        this.onChangeSpeed = this.onChangeSpeed.bind(this)
        this.onChangeColor = this.onChangeColor.bind(this)
        this.onChangeSteps = this.onChangeSteps.bind(this)

        this.onChangeRandomPercent = this.onChangeRandomPercent.bind(this)
        this.onClickRandom = this.onClickRandom.bind(this)

        this.onChangeTestItems = this.onChangeTestItems.bind(this)
        this.onClickTest = this.onClickTest.bind(this)

        this.onContextMenuItemClick = this.onContextMenuItemClick.bind(this)

        this.onClick = this.onClick.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onResize = this.onResize.bind(this)

        this.outerWidth = window.outerWidth
        this.outerHeight = window.outerHeight

        const gridInfo = this.calcGridSize(80)

        this.game = new Game(gridInfo.width, gridInfo.height, 'random', 0.1)

        const color1 = new Color(255, 0, 0)
        const color2 = new Color(0, 0, 255)

        this.state = {
            contextMenu: false,
            running: true,
            showGrid: true,
            speed: 80,
            steps: 80,
            randomPercent: 5,
            testItems: 10,
            color1raw: color1.toString(),
            color1: color1,
            color2raw: color2.toString(),
            color2: color2,
            boardSize: gridInfo.boardSize,
            cellSize: gridInfo.cellSize,
            generation: this.game.generation,
            width: this.game.width,
            height: this.game.height,
            grid: this.game.grid
        }
    }

    componentDidMount() {
        this.lastFrame = Date.now()
        this.interval = setInterval(this.runFrame, 2)
        window.addEventListener('click', this.onClick)
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('resize', this.onResize)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        window.removeEventListener('click', this.onClick)
        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('resize', this.onResize)
    }

    calcGridSize(boardSize) {
        const w = Math.floor(window.innerWidth * 0.75)
        const h = Math.floor(window.innerHeight * 0.90)
        const cellSize = Math.floor(Math.min(w, h) / boardSize) || 1
        const width = Math.floor(w / cellSize)
        const height = Math.floor(h / cellSize)

        return {
            boardSize: boardSize,
            cellSize: cellSize,
            width: width,
            height: height
        }
    }

    runFrame() {
        if (this.state.running) {
            if (this.game.updateGeneration(this.state.speed)) {
                this.setState({ generation: this.game.generation, grid: this.game.grid })
            }
        } else {
            this.game.doNothing()
        }
    }

    handleDrawCell(x, y) {
        this.game.drawCell(x, y, 1)
        this.setState({
            grid: this.game.grid
        })
    }

    handleContextMenu(sx, sy, x, y) {
        if (sx + this.context.offsetWidth > window.innerWidth) {
            sx -= this.context.offsetWidth
        }

        if (sy + this.context.offsetHeight > window.innerHeight) {
            sy -= this.context.offsetHeight
        }

        this.setState({
            contextMenu: true,
            contextMenuX: sx,
            contextMenuY: sy,
            contextMenuTargetX: x,
            contextMenuTargetY: y
        })
    }

    onClickRunPause(event) {
        if (this.state.running) {
            this.setState({
                running: false
            })
        } else {
            this.setState({
                running: true
            })
        }
    }

    onClickShowHideGrid(event) {
        if (this.state.showGrid) {
            this.setState({
                showGrid: false
            })
        } else {
            this.setState({
                showGrid: true
            })
        }
    }

    onClickClear(event) {
        if (this.state.grid) {
            this.game.reset()
            this.setState({
                running: false,
                generation: this.game.generation,
                grid: this.game.grid
            })
        }
    }

    onChangeSize(event) {
        const boardSize = Number(event.target.value)

        if (typeof boardSize === 'number' && boardSize !== this.state.boardSize) {
            this.game.reset()

            const gridInfo = this.calcGridSize(boardSize)

            this.game.resize(gridInfo.width, gridInfo.height)

            this.setState({
                running: false,
                boardSize: gridInfo.boardSize,
                cellSize: gridInfo.cellSize,
                width: this.game.width,
                height: this.game.height,
                generation: this.game.generation,
                grid: this.game.grid
            })
        }
    }

    onChangeSpeed(event) {
        const speed = Number(event.target.value)

        if (typeof speed === 'number' && speed !== this.state.speed) {
            this.setState({
                speed: speed
            })
        }
    }

    onChangeColor(event, index) {
        if (index === 1) {
            const color = this.state.color1
            color.fromString(event.target.value)
            this.setState({
                color1raw: event.target.value,
                color1: color
            })
        } else if (index === 2) {
            const color = this.state.color2
            color.fromString(event.target.value)
            this.setState({
                color2raw: event.target.value,
                color2: color
            })
        }
    }

    onChangeSteps(event) {
        const steps = Number(event.target.value)

        if (typeof steps === 'number' && steps !== this.state.steps) {
            this.setState({
                steps: steps
            })
        }
    }

    onChangeRandomPercent(event) {
        const randomPercent = Number(event.target.value)

        if (typeof randomPercent === 'number' && randomPercent !== this.state.randomPercent) {
            this.setState({
                randomPercent: randomPercent
            })
        }
    }

    onClickRandom(event) {
        this.game.initialize('random', this.state.randomPercent / 100)
        this.setState({
            generation: this.game.generation,
            grid: this.game.grid
        })
    }

    onChangeTestItems(event) {
        const testItems = Number(event.target.value)

        if (typeof testItems === 'number' && testItems !== this.state.testItems) {
            this.setState({
                testItems: testItems
            })
        }
    }

    onClickTest(event) {
        this.game.initialize('test', this.state.testItems)
        this.setState({
            generation: this.game.generation,
            grid: this.game.grid
        })
    }

    onContextMenuItemClick(event, name) {
        this.game.drawItem(this.state.contextMenuTargetX, this.state.contextMenuTargetY, name)
        this.setState({
            contextMenu: false,
            grid: this.game.grid
        })
    }

    onClick(event) {
        if (this.state.contextMenu) {
            this.setState({
                contextMenu: false
            })
        }
    }

    onKeyDown(event) {
        if (event.keyCode === 27) {
            if (this.state.contextMenu) {
                this.setState({
                    contextMenu: false
                })
            }
        }
    }

    onResize(event) {
        if (window.outerWidth !== this.outerWidth || window.outerHeight !== this.outerHeight) {
            this.outerWidth = window.outerWidth
            this.outerHeight = window.outerHeight
            this.game.reset()
            const gridInfo = this.calcGridSize(this.state.boardSize)
            this.game.resize(gridInfo.width, gridInfo.height)
            this.setState({
                running: false,
                boardSize: gridInfo.boardSize,
                cellSize: gridInfo.cellSize,
                width: this.game.width,
                height: this.game.height,
                generation: this.game.generation,
                grid: this.game.grid
            })
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center mt-2">
                    <div className="col-2 text-center mt-2">
                        <h1 className="mt-2"><a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer">Game of Life</a></h1>
                        <div className="input-group mt-4">
                            <span className="input-group-addon">Generation:</span>
                            <input type="text" className="form-control text-right no-select" readOnly value={this.state.generation.toLocaleString()} />
                        </div>
                        <button className="btn btn-block mt-4" onClick={this.onClickRunPause}>{this.state.running ? 'PAUSE' : 'RUN'}</button>
                        <button className="btn btn-block mt-2" onClick={this.onClickShowHideGrid}>{this.state.showGrid ? 'HIDE GRID' : 'SHOW GRID'}</button>
                        <button className="btn btn-block mt-2" onClick={this.onClickClear}>CLEAR</button>
                        <div className="input-group mt-4">
                            <span className="input-group-addon">Board Size:</span>
                            <input type="text" className="form-control text-right no-select" readOnly value={this.state.width.toLocaleString() + ' x ' + this.state.height.toLocaleString()} />
                        </div>
                        <div className="mt-2">
                            <Slider min="20" max="300" onChange={this.onChangeSize} value={this.state.boardSize} />
                        </div>
                        <div className="input-group mt-4">
                            <span className="input-group-addon">Sim Speed:</span>
                            <input type="text" className="form-control text-right no-select" readOnly value={this.state.speed.toLocaleString()} />
                        </div>
                        <div className="mt-2">
                            <Slider min="1" max="100" onChange={this.onChangeSpeed} value={this.state.speed} />
                        </div>
                        <div className="form-group row mt-4 align-items-center">
                            <label className="col-8 col-form-label text-right no-select label">Young Cell Color:</label>
                            <div className="col-4">
                                <ColorPicker value={this.state.color1raw} onChange={(e) => this.onChangeColor(e, 1)} />
                            </div>
                        </div>
                        <div className="form-group row mt-2 align-items-center">
                            <label className="col-8 col-form-label text-right no-select label">Old Cell Color:</label>
                            <div className="col-4">
                                <ColorPicker value={this.state.color2raw} onChange={(e) => this.onChangeColor(e, 2)} />
                            </div>
                        </div>
                        <div className="input-group mt-3">
                            <span className="input-group-addon">Young to Old Generations:</span>
                            <input type="text" className="form-control text-right no-select" readOnly value={this.state.steps.toLocaleString()} />
                        </div>
                        <div className="mt-2">
                            <Slider min="1" max="100" onChange={this.onChangeSteps} value={this.state.steps} />
                        </div>
                        <div className="input-group mt-4">
                            <span className="input-group-addon">Random Population Percentage:</span>
                            <input type="text" className="form-control text-right no-select" readOnly value={this.state.randomPercent.toLocaleString()} />
                        </div>
                        <div className="mt-2">
                            <Slider min="5" max="70" onChange={this.onChangeRandomPercent} value={this.state.randomPercent} />
                        </div>
                        <button className="btn btn-block mt-3" onClick={this.onClickRandom}>GENERATE RANDOM</button>
                        <div className="input-group mt-4">
                            <span className="input-group-addon">Number of Test Items:</span>
                            <input type="text" className="form-control text-right no-select" readOnly value={this.state.testItems.toLocaleString()} />
                        </div>
                        <div className="mt-2">
                            <Slider min="1" max="100" onChange={this.onChangeTestItems} value={this.state.testItems} />
                        </div>
                        <button className="btn btn-block mt-3" onClick={this.onClickTest}>GENERATE TEST</button>
                    </div>
                    <div className="col-10 text-center">
                        <Board width={this.state.width} height={this.state.height} cellSize={this.state.cellSize} grid={this.state.grid} showGrid={this.state.showGrid}
                            color1={this.state.color1} color2={this.state.color2} drawCell={this.handleDrawCell} handleContextMenu={this.handleContextMenu} steps={this.state.steps} />
                        <nav ref={(elem) => this.context = elem} className={this.state.contextMenu ? 'context-menu context-menu--active' : 'context-menu'} style={{ left: this.state.contextMenuX, top: this.state.contextMenuY }}>
                            <ul className="list-group">
                                {this.game.names.map((item, key) => {
                                    return (
                                        <li key={key} className="list-group-item" onClick={(e) => this.onContextMenuItemClick(e, item)}>{item}</li>
                                    )
                                })}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        )
    }
}

export default App
