const Settings = {
    WIDTH: 200,
    HEIGHT: 200,
    X_START: 0,
    Y_START: 0,
    CANVAS_SIZE_MULTIPLIER: 3,
    CELL_DIVIDE_SIGNAL: "divide",
    CELL_DEATH_SIGNAL: "die",
    CELL_NO_SIGNAL: "",
    CELL_COLOUR: "green",
    CELL_START_TIME: 0,
    CELL_START_CYCLE: 0,
    CELL_GROWTH_DISTANCE: 1,
    CONVERSION: 1000
}

const Directions = {
    RIGHT: 1,
    UP: 10,
    LEFT: 100,
    DOWN: 1000,
    START: 0,
    NOT_ALLOWED: 0,
    EXTRACT: 10,
    HORI_FUNC_POINT_X: 2,
    HORI_FUNC_POINT_Y: -1,
    VERT_FUNC_POINT_X: 1,
    VERT_FUNC_POINT_Y: -1,
}

const Graph = {
    WIDTH: 300,
    HEIGHT: 300,
    X_START: 0,
    Y_START: 0,
    INITIAL_X_SIZE: 0,
    MS_TO_S_CONVERSION: 1000,
    SECONDS_THRESHOLD: 1000,
    MS_TO_M_CONVERSION: 60000,
    MINUTES_THRESHOLD: 60000,
    INITIAL_Y_SIZE: 10,
    LOW_Y_GROWTH_FACTOR: 2,
    LOW_Y_GROWTH_THRESHOLD: 1,
    HIGH_Y_GROWTH_FACTOR: 5,
    HIGH_Y_GROWTH_THRESHOLD: 2,
    SMALL_X_MULTIPLIER: 10,
    BIG_X_MULTIPLIER: 60,
    MS_FIRST_HALF: 500,
    MS_SECOND_HALF: 1000,
    TITLE_SIZE: 10,
    TITLE_FONT: "Comic Sans MS",
    TITLE_COLOUR: "white",
    X_TITLE: "Time",
    X_TITLE_LOCATION: 60,
    X_SMALLEST_UNIT: "ms",
    X_MEDIUM_UNIT: "s",
    X_BIGGEST_UNIT: "m",
    X_BIGGEST_SPACE: 50,
    Y_TITLE: "Cells",
    Y_UNIT: "Count",
    Y_TITLE_LOCATION: 70,
    Y_BIGGEST_SPACE: 60,
    ADJUST_0: 0,
    ADJUST_2: 5,
    ADJUST_3: 10,
    ADJUST_3_THRESHOLD: 100,
    ADJUST_4: 15,
    ADJUST_4_THRESHOLD: 1000,
    ADJUST_5: 20,
    ADJUST_5_THRESHOLD: 10000,
    ARROW_WIDTH: 5,
    LINE_WIDTH: 1,
    ARROW_START: 0,
    ARROW_COLOUR: "white",
    DATA_COLOUR: "green",
    SINGLETON: 1,
    BORDER: "solid 1px black",
    MARGIN: 10,
}

const Test = {
    CELL_LIFESPAN_BASE: 2000,
    CELL_LIFESPAN_MIN: 100,
    CELL_LIFESPAN_IMMORTAL: Number.POSITIVE_INFINITY,
    CELL_DIV_TIME_BASE: 1000,
    CELL_DIV_TIME_MIN: 100,
    CELL_DIV_TIME_CELIBATE: Number.POSITIVE_INFINITY,
    CELL_DIV_FAIL_RATE_SUCCEED: 0,
    CELL_DIV_FAIL_RATE_FAIL: 1,
    CELL_DIV_FAIL_RATE_MIDDLE: .5,
    TIME_PASSED_MIN: 1,
}

export { Settings, Directions, Graph, Test }