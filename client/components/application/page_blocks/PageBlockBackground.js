/**
 * Страница бэкграудна.
 * @type {PageBlockBackground}
 * @constructor
 */
let PageBlockBackground = function PageBlockBackground() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    this.init = function () {
        let el;

        /** Рамка для фулскрина */
        /*el = GUI.createElement(ElementImage, {x: -15, y: -15, src: 'fs-frame.png'});
        self.elements.push(el);*/

        /** Задний фон */
        el = GUI.createElement(ElementImage, {x: 0, y: 0, src: 'old-paper.png'});
        self.elements.push(el);

        this.fpsText = GUI.createElement(ElementText, {
            x: 50, y: 10, width: 30, height: 50, text: ''
        });
        if (SocNet.getType() === SocNet.TYPE_STANDALONE
            || LogicUser.getCurrent().id === 1
            || LogicUser.getCurrent().socNetUserId === 1
        ) {
            if (LogicUser.getCurrent().id !== 4) {
                this.fpsText.show();
            }
        }

        setBackgroundImage();
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        self.preset();
        for (let i in self.elements) {
            self.elements[i].show();
        }
        self.redraw();
    };

    /**
     * Спрачем все элементы на странице.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        for (let i in self.elements) {
            self.elements[i].hide();
        }
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {

    };

    /**
     * Обновляем онлайн индикатор и индикатор очков.
     */
    this.redraw = function () {
        if (!showed) return;
        self.preset();
        for (let i in self.elements) {
            self.elements[i].redraw();
        }
    };

    let setBackgroundImage = function () {
        let elBody;
        elBody = document.getElementsByTagName('body')[0];
        GUI.setImageToElement(elBody, 'old-paper.png', screen.width, screen.height);
    };
};

/**
 *
 * @type {PageBlockBackground}
 */
PageBlockBackground = new PageBlockBackground();