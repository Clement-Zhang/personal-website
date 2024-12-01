import Grid from "./grid"
import Tracker from "./tracker"
import { Settings, Graph } from "./constants"

class Renderer {
    prevFrameTime: number | null
    prevFrameId: number | null
    gridContext: CanvasRenderingContext2D | null
    trackerContext: CanvasRenderingContext2D | null
    grid: Grid
    tracker: Tracker
    constructor(gridContext: CanvasRenderingContext2D, grid: Grid, trackerContext: CanvasRenderingContext2D | null, tracker: Tracker) {
        this.prevFrameTime = null
        this.prevFrameId = null
        this.gridContext = gridContext
        this.trackerContext = trackerContext
        this.grid = grid
        this.tracker = tracker
    }
    animate(track: boolean = false) {
        let deltaTime = Date.now() - this.prevFrameTime!
        let gridTime: DOMHighResTimeStamp | undefined
        let frameTime: DOMHighResTimeStamp | undefined
        if (track) {
            gridTime = performance.now()
        }
        this.grid.update(deltaTime)
        if (track) {
            this.tracker.gridCall(performance.now() - gridTime!)
            frameTime = performance.now()
        }
        this.frame()
        if (track) {
            this.tracker.frameDraw(performance.now() - frameTime!)
        }
        this.prevFrameTime = Date.now()
        this.prevFrameId = requestAnimationFrame(this.animate.bind(this, track))
    }
    frame() {
        this.drawGrid()
        this.drawGraph()
    }
    drawGrid() {
        this.gridContext!.clearRect(Settings.X_START, Settings.Y_START, Settings.WIDTH * Settings.CANVAS_SIZE_MULTIPLIER, Settings.HEIGHT * Settings.CANVAS_SIZE_MULTIPLIER)
        for (let y = Settings.Y_START; y < Settings.HEIGHT; y++) {
            for (let x = Settings.Y_START; x < Settings.WIDTH; x++) {
                if (this.grid.cells[y][x]) {
                    let begin = x
                    while (x < Settings.WIDTH && this.grid.cells[y][x]) {
                        x++
                    }
                    this.gridContext!.fillRect(begin * Settings.CANVAS_SIZE_MULTIPLIER, y * Settings.CANVAS_SIZE_MULTIPLIER, (x - begin) * Settings.CANVAS_SIZE_MULTIPLIER, Settings.CANVAS_SIZE_MULTIPLIER)
                }
            }
        }
    }
    drawGraph() {
        let [graph, extend, time, topCells] = this.tracker.gridData
        let leftBound = Graph.X_START + Graph.MARGIN + Graph.LINE_WIDTH
        let rightBound = Graph.WIDTH - Graph.ARROW_WIDTH
        let bottomBound = Graph.HEIGHT - Graph.MARGIN - Graph.LINE_WIDTH
        let topBound = Graph.Y_START + Graph.ARROW_WIDTH + Graph.LINE_WIDTH
        if (extend) {
            this.setGraph(time, topCells)
            for (let i = Graph.SINGLETON; i < graph.length; i++) {
                this.line(leftBound, rightBound, bottomBound, topBound, time, topCells, graph[i], graph[i - 1])
            }
        } else if (graph.length === Graph.SINGLETON) {
            let datum = graph[0]
            let x = datum[0] / time * (rightBound - leftBound) + leftBound
            let y = bottomBound - datum[1] / topCells * (bottomBound - topBound)
            this.trackerContext!.fillRect(x, y, Graph.LINE_WIDTH, Graph.LINE_WIDTH)
        } else if (graph.length > Graph.SINGLETON) {
            this.line(leftBound, rightBound, bottomBound, topBound, time, topCells, graph[graph.length - 1], graph[graph.length - 2])
        }
    }
    line(
        leftBound: number,
        rightBound: number,
        bottomBound: number,
        topBound: number,
        time: number,
        topCells: number,
        datum: [number, number],
        prevDatum: [number, number]
    ) {
        let x = datum[0] / time * (rightBound - leftBound) + leftBound
        let y = bottomBound - datum[1] / topCells * (bottomBound - topBound)
        let prevX = prevDatum[0] / time * (rightBound - leftBound) + leftBound
        let prevY = bottomBound - prevDatum[1] / topCells * (bottomBound - topBound)
        this.trackerContext!.beginPath()
        this.trackerContext!.moveTo(prevX, prevY)
        this.trackerContext!.lineTo(x, y)
        this.trackerContext!.stroke()
    }
    arrow(length: number) {
        let halfWidth = Math.ceil(Graph.ARROW_WIDTH / 2)
        this.trackerContext!.strokeStyle = Graph.ARROW_COLOUR
        this.trackerContext!.lineWidth = Graph.LINE_WIDTH
        this.trackerContext!.beginPath()
        this.trackerContext!.moveTo(Graph.ARROW_START, halfWidth)
        this.trackerContext!.lineTo(length, halfWidth)
        this.trackerContext!.lineTo(length - halfWidth, Graph.ARROW_START)
        this.trackerContext!.moveTo(length, halfWidth)
        this.trackerContext!.lineTo(length - halfWidth, Graph.ARROW_WIDTH)
        this.trackerContext!.moveTo(length - Graph.ARROW_WIDTH, Graph.ARROW_START)
        this.trackerContext!.lineTo(length - Graph.ARROW_WIDTH, Graph.ARROW_WIDTH)
        this.trackerContext!.stroke()
    }
    setGraph(time: number, topCells: number) {
        let xUnit: string
        let yAdjust = Graph.ADJUST_0
        let xAdjust = Graph.ADJUST_2
        if (time < Graph.SECONDS_THRESHOLD) {
            xUnit = Graph.X_SMALLEST_UNIT
            if (time < Graph.MS_FIRST_HALF) {
                time = Graph.MS_FIRST_HALF
                xAdjust = Graph.ADJUST_3
            } else {
                time = Graph.MS_SECOND_HALF
                xAdjust = Graph.ADJUST_4
            }
        } else if (time < Graph.MINUTES_THRESHOLD) {
            xUnit = Graph.X_MEDIUM_UNIT
            let seconds = time / Graph.MS_TO_S_CONVERSION
            if (seconds < Graph.SMALL_X_MULTIPLIER) {
                time = Graph.SMALL_X_MULTIPLIER
            } else {
                time = Graph.BIG_X_MULTIPLIER
            }
        } else {
            xUnit = Graph.X_BIGGEST_UNIT
            let minutes = time / Graph.MS_TO_M_CONVERSION
            if (minutes < Graph.SMALL_X_MULTIPLIER) {
                time = Graph.SMALL_X_MULTIPLIER
            } else {
                time = Graph.BIG_X_MULTIPLIER
            }
        }
        if (topCells >= Graph.ADJUST_5_THRESHOLD) {
            yAdjust = Graph.ADJUST_5
        } else if (topCells >= Graph.ADJUST_4_THRESHOLD) {
            yAdjust = Graph.ADJUST_4
        } else if (topCells >= Graph.ADJUST_3_THRESHOLD) {
            yAdjust = Graph.ADJUST_3
        }
        let xTitleLocation = Graph.WIDTH - Graph.X_TITLE_LOCATION - xAdjust
        let yTitleLocation = -(Graph.Y_TITLE_LOCATION + yAdjust)
        let rightAngle = -Math.PI / 2
        this.trackerContext!.clearRect(Graph.X_START, Graph.Y_START, Graph.WIDTH, Graph.HEIGHT)
        this.trackerContext!.translate(Graph.X_START, Graph.HEIGHT - Graph.MARGIN - Graph.ARROW_WIDTH)
        this.arrow(Graph.WIDTH)
        this.trackerContext!.translate(-Graph.X_START, -(Graph.HEIGHT - Graph.MARGIN - Graph.ARROW_WIDTH))
        this.trackerContext!.rotate(rightAngle)
        this.trackerContext!.translate(-Graph.HEIGHT, Graph.X_START + Graph.MARGIN)
        this.arrow(Graph.WIDTH)
        this.trackerContext!.translate(Graph.HEIGHT, -(Graph.X_START + Graph.MARGIN))
        this.trackerContext!.rotate(-rightAngle)
        this.trackerContext!.font = Graph.TITLE_SIZE + Graph.TITLE_FONT
        this.trackerContext!.fillStyle = Graph.TITLE_COLOUR
        this.trackerContext!.fillText(Graph.X_TITLE + " (" + xUnit + ")", xTitleLocation, Graph.HEIGHT)
        this.trackerContext!.fillText(time.toString(), xTitleLocation + Graph.X_BIGGEST_SPACE, Graph.HEIGHT)
        this.trackerContext!.fillText("0", Graph.X_START + Graph.ARROW_WIDTH, Graph.HEIGHT)
        this.trackerContext!.rotate(rightAngle)
        this.trackerContext!.fillText(Graph.Y_TITLE + " (" + Graph.Y_UNIT + ")", yTitleLocation, Graph.Y_START + Graph.MARGIN)
        this.trackerContext!.fillText(topCells.toString(), yTitleLocation + Graph.Y_BIGGEST_SPACE, Graph.Y_START + Graph.MARGIN)
        this.trackerContext!.rotate(-rightAngle)
        this.trackerContext!.fillStyle = Graph.DATA_COLOUR
        this.trackerContext!.strokeStyle = Graph.DATA_COLOUR
    }
    play(track: boolean = false) {
        this.prevFrameTime = Date.now()
        this.prevFrameId = requestAnimationFrame(this.animate.bind(this, track))
    }
    pause() {
        cancelAnimationFrame(this.prevFrameId!)
    }
    reset() {
        cancelAnimationFrame(this.prevFrameId!)
        this.grid.clear()
        this.gridContext!.clearRect(0, 0, Settings.WIDTH * Settings.CANVAS_SIZE_MULTIPLIER, Settings.HEIGHT * Settings.CANVAS_SIZE_MULTIPLIER)
        this.tracker.clear()
        this.trackerContext!.clearRect(0, 0, Graph.WIDTH, Graph.HEIGHT)
        let [, , time, topCells] = this.tracker.gridData
        this.setGraph(time, topCells)
    }
    startTrack() {
        this.pause()
        this.play(true)
    }
    stopTrack() {
        this.pause()
        console.log(this.tracker.gridStats(), this.tracker.frameStats())
        this.play()
    }
}

export default Renderer