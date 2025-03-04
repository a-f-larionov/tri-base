/**
 * Страница с игровым полем
 * @type {PageBlockField}
 * @constructor
 */
let PageBlockField = function PageBlockField() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    /** @type {ElementField} */
    let elementField = null;

    let elScore = null;

    let elStar1 = null;
    let elStar2 = null;
    let elStar3 = null;

    let elProgressBar = null;

    let elTurns = null;
    let elLevel = null;

    /**
     *
     * @type {ElementText}
     */
    let elText = null;
    let elTextShadow = null;

    let stuffMode = null;

    let domStuff = null;

    let elPanelGoals;

    let buttonReloadField = null;
    let buttonChangeSpeed = null;

    let score;
    let turns;
    let goals;
    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    /**
     * Создадим тут все элементы страницы.
     */
    this.init = function () {
        let el, oX, oY, panelTextOffsetY;
        panelTextOffsetY = 37;

        /** Игровое поле */
        elementField = GUI.createElement(ElementField, {
            centerX: 388.5, centerY: 250,

            onDestroyLine: self.onDestroyLine,

            onDestroyThing: self.onDestroyThing,

            beforeTurnUse: self.beforeTurnUse,
            beforeStuffUse: self.beforeStuffUse,
            onFieldSilent: self.onFieldSilent

        });
        self.elements.push(elementField);

        /** Кнопка выхода */
        el = GUI.createElement(ElementButton, {
            x: 730, y: 10, srcRest: 'button-quit-rest.png',
            onClick: function () {
                if (turns === 0) {
                    PBZDialogs.dialogTurnsLoose.reset();
                } else {
                    PBZDialogs.dialogJustQuit.showDialog();
                }
            }
        });
        self.elements.push(el);

        /**
         * ПАНЕЛЬ УРОВЕНЬ
         */
        {
            oX = 635;
            oY = 65 + 30;
            /** Панель */
            el = GUI.createElement(ElementImage, {x: oX, y: oY, src: 'panel-turns.png'});
            self.elements.push(el);
            /** Надпись */
            el = GUI.createElement(ElementText, {x: oX, y: oY + 8, width: 112, text: 'УРОВЕНЬ', alignCenter: true, fontSize: 14});
            self.elements.push(el);
            /** Текст */
            elLevel = GUI.createElement(ElementText, {x: oX, y: oY + panelTextOffsetY, width: 112, alignCenter: true});
            self.elements.push(elLevel);
        }

        /**
         * ПАНЕЛЬ ОЧКИ
         */
        {
            /** Панель */
            oX = 15;
            oY = 160;
            el = GUI.createElement(ElementImage, {x: oX, y: oY, src: 'panel-score.png'});
            self.elements.push(el);
            /** Надпись */
            el = GUI.createElement(ElementText, {x: oX, y: oY + 8, width: 112, text: 'ОЧКИ', alignCenter: true, fontSize: 14});
            self.elements.push(el);
            /** Текст */
            elScore = GUI.createElement(ElementText, {x: oX, y: oY + panelTextOffsetY, width: 112, alignCenter: true});
            self.elements.push(elScore);
            /** Звезда 1 */
            elStar1 = GUI.createDom(undefined, {x: oX + 15, y: oY + 62});
            self.elements.push(elStar1);
            /** Звезда 2 */
            elStar2 = GUI.createDom(undefined, {x: oX + 15 + 27, y: oY + 62});
            self.elements.push(elStar2);
            /** Звезда 3 */
            elStar3 = GUI.createDom(undefined, {x: oX + 15 + 27 * 2, y: oY + 62});
            self.elements.push(elStar3);
            elProgressBar = GUI.createDom(null, {
                x: oX + 21, y: oY + 59,
                width: 71, height: 4,
                borderRadius: 2,
                borderWidth: 2,
                borderColor: 'rgba(68, 68, 0, 0.7)',
                background: 'rgba(68, 68, 0, 0.7)',
            });
            self.elements.push(elProgressBar);
        }

        /**
         * ПАНЕЛЬ ХОДОВ
         */
        {
            oX = 15;
            oY = 65 + 10;
            /** Панель */
            el = GUI.createElement(ElementImage, {x: oX, y: oY, src: 'panel-turns.png'});
            self.elements.push(el);
            /** Надпись */
            el = GUI.createElement(ElementText, {x: oX, y: oY + 8, width: 112, text: 'ХОДЫ', alignCenter: true, fontSize: 14});
            self.elements.push(el);
            /** Текст */
            elTurns = GUI.createElement(ElementText, {x: oX, y: oY + panelTextOffsetY, width: 112, alignCenter: true});
            self.elements.push(elTurns);
        }

        /**
         * ПАНЕЛЬ ЦЕЛИ
         */
        {
            oX = 15;
            oY = 260;
            elPanelGoals = GUI.createElement(ElementPanelItems, {x: oX, y: oY, title: 'ЦЕЛИ', fontSize: 14});
            self.elements.push(elPanelGoals);
        }

        oY = 200;
        /** Stuff hummer */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: oY, fieldName: 'hummerQty',
            srcRest: 'button-hummer-rest.png',
            onClick: function () {
                if (tlock(tlock.STUFF_BUTTON)) return;
                self.setStuffMode(LogicStuff.STUFF_HUMMER);
            }
        });
        self.elements.push(el);

        /** Stuff lightning */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: oY + 80, fieldName: 'lightningQty',
            srcRest: 'button-lightning-rest.png',
            onClick: function () {
                if (tlock(tlock.STUFF_BUTTON)) return;
                self.setStuffMode(LogicStuff.STUFF_LIGHTNING);
            }
        });
        self.elements.push(el);

        /** Stuff shuffle */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: oY + 80 * 2, fieldName: 'shuffleQty',
            srcRest: 'button-shuffle-rest.png',
            onClick: function () {
                if (tlock(tlock.STUFF_BUTTON)) return;
                self.setStuffMode(LogicStuff.STUFF_SHUFFLE);
            }
        });
        self.elements.push(el);

        /** Кнопка обновить поле, для админов\adminov */
        buttonReloadField = GUI.createElement(ElementButton, {
            x: 312, y: 5, width: 25, height: 25,
            srcRest: 'button-close-rest.png',
            onClick: function () {
                AnimLocker.lock();

                CAPIMap.setCallbackOnMapsInfo(function () {
                    PageController.showPage(PageMain);
                    PageController.showPage(PageField);
                    AnimLocker.release();
                    PageController.redraw();
                });
                SAPIMap.reloadLevels();
                SAPIMap.sendMeMapInfo(DataMap.getCurrent().id);
            }
        });

        /** Кнопка обновить поле, для админов */
        buttonChangeSpeed = GUI.createElement(ElementButton, {
            x: 312 + 30, y: 5, width: 25, height: 25,
            srcRest: 'field-red.png',
            onClick: function () {
                let standard = 1;
                switch (Config.OnIdle.animStep) {
                    case standard * 5:
                        buttonChangeSpeed.srcRest = 'field-yellow.png';
                        Config.OnIdle.animStep = standard;
                        break;
                    case standard :
                        buttonChangeSpeed.srcRest = 'field-red.png';
                        Config.OnIdle.animStep = standard / 5;
                        break;
                    case standard / 5:
                        buttonChangeSpeed.srcRest = 'field-green.png';
                        Config.OnIdle.animStep = standard * 5;
                        break;
                    default:
                        Config.OnIdle.animStep = standard;
                        break;
                }
                buttonChangeSpeed.redraw();
            }
        });

        /** Dom stuff */
        domStuff = GUI.createDom(null, {x: 190, y: 10, pointer: GUI.POINTER_NONE, zIndex: 10000});

        elTextShadow = GUI.createDom(undefined, {
            x: 0, y: 0, width: DataCross.app.width, height: DataCross.app.height,
            background: "black",
            opacity: 0.3,
            zIndex: 999
        });

        elText = GUI.createElement(ElementText, {
            x: DataCross.app.width / 2 - DataCross.app.width / 1.5 / 2,
            y: DataCross.app.height / 2 - 40 * 2 / 2,
            width: DataCross.app.width / 1.5,
            height: 20 * 2,
            fontSize: 36,
            color: '#fdfff5',
            alignCenter: true,
            zIndex: 1000,
        });

        GUI.bind(domStuff, GUI.EVENT_MOUSE_CLICK, function (event, dom) {
            let el;
            /** Передаем клик дальше, теоретически после анимации */
            domStuff.hide();
            el = document.elementFromPoint(event.clientX, event.clientY);
            /** Передаем только на поле */
            if (
                (el.parentElement.__dom && el.parentElement.__dom.isFieldContainer) ||
                el.isStuffButton) {
                el.dispatchEvent(new MouseEvent(event.type, event));
            }
            if (stuffMode) domStuff.show();
            return true;
        });

        GUI.onMouseMove(function (x, y) {
            domStuff.x = x - 25;
            domStuff.y = y - 25;
            domStuff.redraw();
        });
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        loadField();
        for (let i in self.elements) {
            self.elements[i].show();
        }
        self.firstShow();
        if (SocNet.getType() === SocNet.TYPE_STANDALONE
            || LogicUser.getCurrent().id === 1
            || LogicUser.getCurrent().socNetUserId === 1
        ) {
            if (LogicUser.getCurrent().id !== 4) {
                buttonReloadField.show();
                buttonChangeSpeed.show();
            }
        }
    };

    this.isShowed = function () {
        return showed;
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
        domStuff.hide();
        elPanelGoals.hide();
        buttonReloadField.hide();
        buttonChangeSpeed.hide();
    };

    /**
     * Загружает поле.
     */
    let loadField = function () {
        let data;
        data = DataPoints.getById(DataPoints.getPlayedId());
        score = 0;
        turns = data.turns;
        goals = DataPoints.copyGoals(data.goals);
        elementField.setLayers(data.layers);
        self.redraw();
    };

    this.firstShow = function () {
        let data;
        elementField.unlock();
        elementField.run();
        data = DataPoints.getById(DataPoints.getPlayedId());
        PBZDialogs.dialogGoals.setGoals(data.goals);
        PBZDialogs.dialogGoals.showDialog();
        noMoreGoals = false;
        LogicWizard.onFieldFirstShow();
    };

    this.unlockField = function () {
        elementField.unlock();
    };

    this.redraw = function () {
        if (!showed) return;

        let countStars = DataPoints.countStars(null, null, score);
        elStar1.backgroundImage = 'star-off-middle.png';
        elStar2.backgroundImage = 'star-off-middle.png';
        elStar3.backgroundImage = 'star-off-middle.png';
        if (countStars >= 1) elStar1.backgroundImage = 'star-on-middle.png';
        if (countStars >= 2) elStar2.backgroundImage = 'star-on-middle.png';
        if (countStars >= 3) elStar3.backgroundImage = 'star-on-middle.png';

        elScore.setText(score.toString());
        elTurns.setText(turns.toString());
        elLevel.setText((DataPoints.getPlayedId()).toString());

        for (let i in self.elements) {
            self.elements[i].redraw();
        }
        elPanelGoals.items = goals;
        elPanelGoals.redraw();

        if (stuffMode) {
            domStuff.show();
            domStuff.redraw();
        } else {
            domStuff.hide();
        }
        buttonReloadField.redraw();
        buttonChangeSpeed.redraw();

        elProgressBar.width = Math.min(71,
            71 / 100 *
            (100 / (DataPoints.getById(DataPoints.getPlayedId()).score3) * score)
        );
    };

    let noMoreGoals;

    let objectScores = {};
    objectScores[DataObjects.OBJECT_RED] = 10;
    objectScores[DataObjects.OBJECT_GREEN] = 10;
    objectScores[DataObjects.OBJECT_BLUE] = 10;
    objectScores[DataObjects.OBJECT_YELLOW] = 10;
    objectScores[DataObjects.OBJECT_PURPLE] = 10;
    objectScores[DataObjects.OBJECT_SAND] = 30;

    objectScores[DataObjects.OBJECT_ALPHA] = 100;
    objectScores[DataObjects.OBJECT_BETA] = 100;
    objectScores[DataObjects.OBJECT_GAMMA] = 100;
    objectScores[DataObjects.OBJECT_POLY_COLOR] = 300;
    objectScores[DataObjects.OBJECT_GOLD] = 300;
    objectScores[DataObjects.OBJECT_TILE] = 300;
    objectScores[DataObjects.OBJECT_BOX] = 5;
    objectScores[DataObjects.OBJECT_BARREL] = 100;
    objectScores[DataObjects.OBJECT_BOX] = 100;

    this.onDestroyThing = function (objectId, cell) {
        /** Goals */
        decreaseGoal(objectId, 1);

        if (objectScores[objectId]) {
            score += objectScores[objectId];
        }
        self.redraw();
        LogicWizard.onDestroyThing(cell);
    };

    this.onDestroyLine = function (line) {
        LogicWizard.onDestroyLine(line);
    };

    let decreaseGoal = function (id, qty) {
        noMoreGoals = true;
        goals.forEach(function (goal) {
            if (goal.id === id) {
                Animate.anim(animBlump, {}, elPanelGoals.getItemDom(goal.id));
                goal.count -= qty;
            }
            if (goal.count > 0) noMoreGoals = false;
            if (goal.count < 0) goal.count = 0;
        });
        /** @todo act goals */

        self.redraw();
    };

    this.onFieldSilent = function () {
        LogicWizard.onFieldSilent();
        if (noMoreGoals) {
            elementField.lock();
            noMoreGoals = false;
            setTimeout(self.finishLevel, Config.OnIdle.animateInterval * 1);
        } else if (turns === 0) {
            PBZDialogs.dialogTurnsLoose.showDialog(DataPoints.getPlayedId());
        }
    };

    this.finishLevel = function () {
        let pointId, user, lastScore, chestId;
        LogicWizard.finish(false);
        stuffMode = null;
        elementField.setStuffMode(stuffMode);

        user = LogicUser.getCurrent();
        pointId = DataPoints.getPlayedId();
        lastScore = DataPoints.getScore(pointId);
        if (user.nextPointId < pointId + 1) {
            user.nextPointId = pointId + 1;
            LogicUser.updateUserInfo(user);
        }
        if (score > lastScore || lastScore === undefined) {
            chestId = LogicChests.onFinish(pointId, lastScore, score);
            DataPoints.setPointUserScore(pointId, user.id, score);
            SAPIMap.onFinish(pointId, score, chestId);
        }
        SAPIUser.healthBack();
        PBZDialogs.dialogPointInfo.showDialog(pointId, score, true);
        PageController.redraw();
    };

    this.beforeTurnUse = function () {
        turns--;
        if (turns === 0 && !noMoreGoals) elementField.lock();
        if (turns === 5 && !noMoreGoals) showText('Осталось 5 ходов!');
        self.redraw();
    };

    this.beforeStuffUse = function () {
        switch (stuffMode) {
            case LogicStuff.STUFF_HUMMER:
                Sounds.play(Sounds.TYPE_HUMMER_HIT);
                SAPIStuff.usedHummer();
                LogicStuff.usedHummer();
                break;
            case LogicStuff.STUFF_LIGHTNING:
                SAPIStuff.usedLightning();
                LogicStuff.usedLightning();
                break;
            case LogicStuff.STUFF_SHUFFLE:
                SAPIStuff.usedShuffle();
                LogicStuff.usedShuffle();
                break;
        }
        stuffMode = null;
        elementField.setStuffMode(stuffMode);
        self.redraw();
    };

    this.setStuffMode = function (mode) {
        /** Если уже выбран этот - отменяем его */
        if (mode === stuffMode) mode = null;
        switch (mode) {
            case LogicStuff.STUFF_HUMMER:
                if (LogicStuff.getStuff('hummerQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = 'button-hummer-rest.png';
                break;
            case LogicStuff.STUFF_LIGHTNING:
                if (LogicStuff.getStuff('lightningQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = 'button-lightning-rest.png';
                break;
            case LogicStuff.STUFF_SHUFFLE:
                if (LogicStuff.getStuff('shuffleQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = 'button-shuffle-rest.png';
                break;
        }
        stuffMode = mode;
        elementField.setStuffMode(mode);
        self.redraw();
    };

    this.getElementField = function () {
        return elementField;
    };

    this.onWizardFinish = function (showTextDalcheSami) {
        //@Todo get sex and : Дальше ты сам(а)!
        //@todo show from Wizard by code, but not automaticaly
        if (showTextDalcheSami) {
            showText('Дальше сам!');
        }
    };

    let showText = function (text) {
        elTextShadow.show();
        elText.setText(text);
        elText.show();
        elText.redraw();
        setTimeout(function () {
            elTextShadow.hide();
            elText.hide();
        }, Config.OnIdle.second * 1.1);
    };

    this.increaseTurns = function (diff) {
        turns += diff;
    };
};

/** @type {PageBlockField} */
PageBlockField = new PageBlockField;