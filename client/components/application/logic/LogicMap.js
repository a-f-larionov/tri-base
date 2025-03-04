/**
 * @type {LogicMap}
 * @constructor
 */
let LogicMap = function () {

    this.onArrowPrevClick = function () {
        DataMap.setPrevMap();
        PageController.redraw();
    };

    this.onArrowNextClick = function () {
        DataMap.setNextMap();
        PageController.redraw();
    };
};

/**
 * Статичный класс.
 * @type {LogicMap}
 */
LogicMap = new LogicMap();
