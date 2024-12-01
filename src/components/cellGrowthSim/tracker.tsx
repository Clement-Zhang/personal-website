import { Settings, Graph } from "./constants"

class Tracker {
    cellData: [number, number][]
    timeElapsed: number
    timeCapacity: number
    topCells: number
    extend: boolean
    gridUpdates: DOMHighResTimeStamp[]
    frameDraws: DOMHighResTimeStamp[]
    constructor() {
        this.cellData = []
        this.timeElapsed = 0
        this.timeCapacity = Graph.INITIAL_X_SIZE
        this.topCells = Graph.INITIAL_Y_SIZE
        this.extend = false
        this.gridUpdates = []
        this.frameDraws = []
    }
    updateCellCount(deltaTime: number, cellCount: number) {
        this.timeElapsed += deltaTime
        this.cellData.push([this.timeElapsed, cellCount])
        if (cellCount > this.topCells) {
            this.extend = true
            let sigFig = parseInt(cellCount.toPrecision(1))
            if (sigFig === Graph.LOW_Y_GROWTH_THRESHOLD) {
                this.topCells *= Graph.LOW_Y_GROWTH_FACTOR
            } else if (sigFig === Graph.HIGH_Y_GROWTH_THRESHOLD) {
                this.topCells *= Graph.HIGH_Y_GROWTH_FACTOR
            }
            this.topCells = Math.min(this.topCells, Settings.HEIGHT * Settings.WIDTH)
        }
        if (this.timeElapsed > this.timeCapacity) {
            this.extend = true
            if (this.timeElapsed < Graph.SECONDS_THRESHOLD) {
                if (this.timeElapsed < Graph.SMALL_X_MULTIPLIER) {
                    this.timeCapacity = Graph.MS_FIRST_HALF
                } else {
                    this.timeCapacity = Graph.MS_SECOND_HALF
                }
            }
            else if (this.timeElapsed < Graph.MINUTES_THRESHOLD) {
                let seconds = this.timeElapsed / Graph.MS_TO_S_CONVERSION
                if (seconds < Graph.SMALL_X_MULTIPLIER) {
                    this.timeCapacity = Graph.SMALL_X_MULTIPLIER * Graph.MS_TO_S_CONVERSION
                } else {
                    this.timeCapacity = Graph.BIG_X_MULTIPLIER * Graph.MS_TO_S_CONVERSION
                }
            } else {
                let minutes = this.timeElapsed / Graph.MS_TO_M_CONVERSION
                if (minutes < Graph.SMALL_X_MULTIPLIER) {
                    this.timeCapacity = Graph.SMALL_X_MULTIPLIER * Graph.MS_TO_M_CONVERSION
                } else {
                    this.timeCapacity = Graph.BIG_X_MULTIPLIER * Graph.MS_TO_M_CONVERSION
                }
            }
        }
    }
    clear() {
        this.cellData = []
        this.timeElapsed = 0
        this.timeCapacity = Graph.INITIAL_X_SIZE
        this.topCells = Graph.INITIAL_Y_SIZE
        this.extend = false
    }
    gridCall(time: DOMHighResTimeStamp){
        this.gridUpdates.push(time)
    }
    gridStats(){
        return this.gridUpdates.reduce((acc, val) => acc + val) / this.gridUpdates.length
    }
    frameDraw(time: DOMHighResTimeStamp){
        this.frameDraws.push(time)
    }
    frameStats(){
        return this.frameDraws.reduce((acc, val) => acc + val) / this.frameDraws.length
    }
    get gridData(): [[number, number][], boolean, number, number] {
        let extend = this.extend
        this.extend = false
        return [this.cellData, extend, this.timeCapacity, this.topCells]
    }
}

export default Tracker