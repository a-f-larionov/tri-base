/**
 * Элемент панель друзей.
 * @constructor
 */
let ElementFriendsPanel = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X панели.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y панели.
     * @type {number}
     */
    this.y = 0;

    this.cardWidth = 50;
    this.cardHeight = 50;
    this.cardSpace = 10;

    this.cardsCount = DataCross.topUsersLimit;

    let friends = [];

    /**
     * @type GUIDom[]
     */
    let cardsDom = [];

    /**
     * @type GUIDom[]
     */
    let cardsText = [];

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        for (let i = 0; i < self.cardsCount; i++) {
            let dom;
            dom = GUI.createDom(undefined, {
                x: self.x + i * (self.cardWidth + self.cardSpace),
                y: self.y,
                width: self.cardWidth,
                height: self.cardHeight,
                borderWidth: 2,
                borderColor: '#715f4b',
                borderRadius: 8,
                background: '#aaa'
            });
            GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, function () {
                if (!friends[i]) SocNet.openInviteFriendDialog();
            });
            cardsDom.push(dom);
            cardsText.push(GUI.createElement(ElementText,
                {
                    x: self.x + i * (self.cardWidth + self.cardSpace) + 2,
                    y: self.y + 50 - 17,
                    width: self.cardWidth - 4, height: 30 / (100 / self.cardWidth), alignCenter: true,
                    background: '#eee',
                    opacity: 0.5,
                    fontSize: 12
                }));
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        cardsDom.forEach(function (card) {
            card.show();
        });
        cardsText.forEach(function (el) {
            el.show();
        });
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        cardsDom.forEach(function (card) {
            card.hide();
        });
        cardsText.forEach(function (el) {
            el.hide();
        });
    };

    /**
     * @param newData {Object}[]
     */
    this.setFriends = function (newData) {
        friends = newData;
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;

        cardsDom.forEach(function (card, i) {
            if (friends[i] && friends[i].photo50) {
                card.backgroundImage = friends[i].photo50;
                card.pointer = GUI.POINTER_ARROW;
            } else {
                card.backgroundImage = 'friend-vacancy.png';
                card.pointer = GUI.POINTER_HAND;
            }
            card.redraw();
        });

        cardsText.forEach(function (text, i) {
            if (friends[i]) {
                text.text = 'ур. ' + friends[i].nextPointId;
                text.show();
            } else {
                text.hide();
            }
            text.redraw();
        });

    };
};