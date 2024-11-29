import { SyntheticEvent, useState, useRef, useEffect } from "react"
import Grid from "../components/cellGrowthSim/grid"
import Renderer from "../components/cellGrowthSim/renderer"
import {Settings} from "../components/cellGrowthSim/constants"
require("../styles/cellGrowthSim.module.css")

const play = require("../assets/playButton.jpg")
const pause = require("../assets/pauseButton.jpg")
const reset = require("../assets/resetButton.jpg")

const Sim = () => {
    let [mouse, updateMouse] = useState([0, 0]);
    let renderer = useRef<Renderer | null>(null);
    let grid = useRef(new Grid())
    const [controls, changeControls] = useState({
        divTime: .9,
        divFailRate: 0,
        lifespan: 2
    });
    let canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        let context = canvasRef.current!.getContext("2d")
        context!.fillStyle = Settings.CELL_COLOUR
        renderer.current = new Renderer(context!, grid.current)
    }, [canvasRef])
    const adjust = (e: SyntheticEvent) => {
        const target = e.target as typeof e.target & {
            name: string,
            value: number
        }
        const name = target.name;
        const value = target.value;
        changeControls(values => ({ ...values, [name]: value }))
    }
    function moveMouse(e: React.MouseEvent<HTMLCanvasElement>) {
        updateMouse([
            e.clientX-canvasRef.current!.getBoundingClientRect().left,
            e.clientY-canvasRef.current!.getBoundingClientRect().top
        ])
    }
    function interact(e: React.MouseEvent<HTMLCanvasElement>, grid: React.MutableRefObject<Grid>) {
        e.preventDefault()
        let x = Math.floor(mouse[0] / Settings.CANVAS_SIZE_MULTIPLIER)
        let y = Math.floor(mouse[1] / Settings.CANVAS_SIZE_MULTIPLIER)
        if (e.button === 0) {
            grid.current.createCell(x, y, controls.lifespan! * Settings.CONVERSION, controls.divTime! * Settings.CONVERSION, controls.divFailRate)
        } else {
            grid.current.deleteCell(x, y)
        }
        renderer.current!.frame()
    }
    function changeButton(e: SyntheticEvent) {
        let element = e.target as HTMLImageElement
        if (element.getAttribute("data-active-button") === "play") {
            element.setAttribute("data-active-button", "pause")
            element.src = pause
            renderer.current!.play()
        } else {
            element.setAttribute("data-active-button", "play")
            element.src = play
            renderer.current!.pause()
        }
    }
    function resetButton(e: SyntheticEvent) {
        let element = document.getElementById("playPause") as HTMLImageElement
        element.setAttribute("data-active-button", "play")
        element.src = play
        renderer.current!.reset()
    }
    return (
        <div style={{ display: "flex" }}>
            <div style={{ flex: "25%" }}>
                <ul>
                    <li>
                        <img id="playPause" src={play} alt="play button" data-active-button="play" onClick={changeButton} />
                    </li>
                    <li>
                        <img src={reset} alt="reset button" onClick={resetButton} />
                    </li>
                </ul>
                <form>
                    <label>
                        Division Time (seconds)
                    </label>
                    <input type="number" name="divTime" min={.1} step={.1} value={controls.divTime || .9} onChange={adjust} />
                    <label>
                        Division Failure Rate (0-1)
                    </label>
                    <input type="number" name="divFailRate" min={0} max={1} step={.0001} value={controls.divFailRate || 0} onChange={adjust} />
                    <label>
                        Cell Lifespan (seconds)
                    </label>
                    <input type="number" name="lifespan" min={.1} step={.1} value={controls.lifespan || 2} onChange={adjust} />
                </form>
                <p>When Cell Lifespan is an integer multiple of Division Time, cells will <em>not</em> divide for that last stretch of time before it dies.</p>
            </div>
            <div style={{ flex: "75%" }}>
                <canvas
                    ref={canvasRef}
                    width={Settings.WIDTH * Settings.CANVAS_SIZE_MULTIPLIER}
                    height={Settings.HEIGHT * Settings.CANVAS_SIZE_MULTIPLIER}
                    onMouseMove={moveMouse}
                    onClick={(e) => interact(e, grid)}
                    onContextMenu={(e) => interact(e, grid)}
                />
            </div>
        </div>
    );
}

export default Sim