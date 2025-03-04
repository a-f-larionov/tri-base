/**
 * Блок Визарда
 * @type {PageBlockWizard}
 * @constructor
 */
let PageBlockWizard = function PageBlockWizard() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    let images = {};

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    let wizardArea = null;
    /** @type {CanvasRenderingContext2D} */
    let cntx = null;

    let elDialog = null;
    let elText = null;
    let elWCat = null;

    let dialogBorder = 16;

    this.init = function () {

        /** Canvas */
        wizardArea = GUI.wizardArea;

        wizardArea.width = DataCross.app.width;
        wizardArea.height = DataCross.app.height;

        wizardArea.style.display = 'none';
        cntx = wizardArea.getContext('2d');

        //cntx.showByImg = showByImg;
        cntx.unlockByImg = unlockByImg;
        cntx.highlightCells = highlightCells;

        let proccesEvent = function (event, callback) {
            let pixelData, el, x, y;
            x = event.offsetX;
            y = event.offsetY;
            pixelData = cntx.getImageData(x, y, 1, 1).data;
            if (pixelData[3] === 0) {
                wizardArea.style.display = 'none';
                el = document.elementFromPoint(event.clientX, event.clientY);
                if (el) el.dispatchEvent(new MouseEvent(event.type, event));
                if (wizardArea.isActive) wizardArea.style.display = '';

                if (callback) callback(el);
            } else {
                if (callback) callback(false);
            }
        };

        /** On Click */
        wizardArea.onclick = function (event) {
            proccesEvent(event, LogicWizard.onClick)
        };
        /** On Click */
        wizardArea.onmousedown = function (event) {
            proccesEvent(event, LogicWizard.onMouseDown)
        };
        wizardArea.onmouseup = function (event) {
            proccesEvent(event, LogicWizard.onMouseUp)
        };
        /** On Mouse Move */
        wizardArea.onmousemove = function (event) {
            proccesEvent(event, function (el) {
                if (el) {
                    wizardArea.style.cursor = el.style.cursor;
                } else {
                    wizardArea.style.cursor = '';
                }
            });
        };
        //canvas.onmouseout = proccesEvent;
        //canvas.onmouseover = proccesEvent;
        //canvas.onmousemove = proccesEvent;

        elDialog = GUI.createElement(ElementImage, {src: 'w-dialog.png'});
        elDialog.dom.zIndex = 50000;
        elDialog.dom.borderWidth = 5;
        elDialog.dom.borderColor = 'red';

        //elDialog.hide();

        elText = GUI.createElement(ElementText, {
            x: 400 + dialogBorder, y: 360 + dialogBorder,
            width: Images.getWidth('w-dialog.png') - dialogBorder * 2,
            height: Images.getHeight('w-dialog.png'),
            alignCenter: true, zIndex: 50001,
            text: 'text'
        });
        //elText.hide();

        elWCat = GUI.createElement(ElementImage, {src: 'w-cat.png'});
        elWCat.dom.zIndex = 50002;
    };

    let drawBackground = function () {
        cntx.clearRect(0, 0,
            DataCross.app.width * window.devicePixelRatio,
            DataCross.app.height * window.devicePixelRatio
        );
        cntx.globalCompositeOperation = 'source-out';
        cntx.globalAlpha = 0.55;
        cntx.fillStyle = 'black';
        cntx.fillRect(0, 0,
            DataCross.app.width * window.devicePixelRatio,
            DataCross.app.height * window.devicePixelRatio
        );
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed) return;
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
        if (!showed) return;
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
        self.elements.forEach(function (el) {
            el.redraw();
        });
        elDialog.redraw();
        elWCat.redraw();
        elText.redraw();
    };

    this.begin = function () {
        PageBlockField.getElementField().lockHint();
        wizardArea.style.display = '';
        wizardArea.isActive = true;
        drawBackground();
    };

    this.finish = function (showText) {
        self.reset();
        PageBlockField.onWizardFinish(showText);
    };

    this.reset = function () {
        wizardArea.isActive = false;
        wizardArea.style.display = 'none';
        elDialog.hide();
        elWCat.hide();
        elText.hide();
        PageBlockField.getElementField().unlockHint();
        clearInterval(hintIntervalId);
    };

    let hintIntervalId = null;

    this.showHint = function (pList) {
        let coords = PageBlockField.getElementField().getCoords();
        pList.forEach(function (p) {
            p.x += coords.cellX;
            p.y += coords.cellY;
        });
        if (hintIntervalId) clearInterval(hintIntervalId);
        hintIntervalId = setInterval(function () {
            if (Animate.hintActive) return;
            PageBlockField.getElementField().showHint(pList);
        }, Config.OnIdle.second * 1.5);
    };

    let wCatX = 0;
    this.updateText = function (text, wCatXNew) {
        elText.text = text;
        wCatX = wCatXNew;
        self.redraw();
    };

    this.showDialog = function (x, y, lines, fontSize, wCatX, wCatY) {
        let textOffsetY;
        if (!x) x = 400;
        if (!y) y = 360;
        switch (lines) {
            default:
            case 1:
                textOffsetY = 30;
                break;
            case 2:
                textOffsetY = 15 + 3;
                break;
            case 3:
                textOffsetY = 2 + 6;
                break;
        }
        if (!lines) textOffsetY = lines * 15;
        if (!fontSize) fontSize = '';
        elDialog.x = x;
        elDialog.y = y;
        elWCat.x = x + 210;
        elWCat.y = y - 232;
        elWCat.x = 568;
        elWCat.y = 257;
        if (wCatX) elWCat.x = wCatX;
        if (wCatY) elWCat.y = wCatY;
        elText.x = x + dialogBorder;
        elText.y = y + dialogBorder + textOffsetY;
        //elText.fontSize = fontSize;
        elDialog.show();
        elWCat.show();
        elText.show();
        self.redraw();
    };

    this.hideDialog = function () {
        elDialog.hide();
        elText.hide();
        elWCat.hide();
    };

    this.draw = function (callback) {
        callback(cntx);
    };

    let drawSome = function (url, x, y, unlock, skipload) {
        //@todo some strange
        if (!skipload || !images[url]) {
            images[url] = new Image();
            images[url].onload = function () {
                drawSome(url, x, y, unlock, true);
            };
            images[url].src = Images.getRealPath(url);
            return;
        }
        cntx.globalAlpha = unlock ? 1 : 0.99;
        cntx.globalCompositeOperation = 'destination-out';
        cntx.drawImage(images[url], x, y, Images.getWidth(url), Images.getHeight(url));
    };

    let unlockByImg = function (url, x, y) {
        drawSome(url, x, y, true);
    };

    let showByImg = function (url, x, y) {
        drawSome(url, x, y, false);
    };

    let highlightCells = function (pList) {
        let f = PageBlockField.getElementField().getCoords();

        pList.forEach(function (p) {
            if (p.unlock) {
                unlockByImg('w-cell.png',
                    f.x + DataPoints.BLOCK_WIDTH * p.x,
                    f.y + DataPoints.BLOCK_HEIGHT * (p.y + 1)
                );
            } else {
                showByImg('w-cell.png',
                    f.x + DataPoints.BLOCK_WIDTH * p.x,
                    f.y + DataPoints.BLOCK_HEIGHT * (p.y + 1)
                );
            }
        });
    };

    //this.showByImg = showByImg;
    this.unlockByImg = unlockByImg;
    this.highlightCells = highlightCells;
};

/** @type {PageBlockWizard} */
PageBlockWizard = new PageBlockWizard();

let PBWizard = PageBlockWizard;