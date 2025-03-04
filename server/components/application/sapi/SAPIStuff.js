const Kafka = require("../../base/Kafka.js").Kafka

SAPIStuff = function () {

    this.sendMeStuff = function (cntx) {
        Kafka.sendToGame({}, cntx.user.id, Kafka.TYPE_SEND_ME_STUFF_RQ_DTO);
    };

    this.usedHummer = function (cntx) {
        Kafka.sendToGame({}, cntx.user.id, Kafka.TYPE_USED_HUMMER_RQ_DTO);
    };

    this.usedLightning = function (cntx) {
        Kafka.sendToGame({}, cntx.user.id, Kafka.TYPE_USED_LIGHTNING_RQ_DTO);
    };

    this.usedShuffle = function (cntx) {
        Kafka.sendToGame({}, cntx.user.id, Kafka.TYPE_USED_SHUFFLE_RQ_DTO);
    };

    this.buyHummer = function (cntx, itemIndex) {
        Kafka.sendToGame({index: itemIndex}, cntx.user.id, Kafka.TYPE_BUY_HUMMER_RQ_DTO);
    };

    this.buyLightning = function (cntx, itemIndex) {
        Kafka.sendToGame({index: itemIndex}, cntx.user.id, Kafka.TYPE_BUY_LIGHTNING_RQ_DTO);
    };

    this.buyShuffle = function (cntx, itemIndex) {
        Kafka.sendToGame({index: itemIndex}, cntx.user.id, Kafka.TYPE_BUY_SHUFFLE_RQ_DTO);
    };

    this.buyHealth = function (cntx) {
        Kafka.sendToGame({}, cntx.user.id, Kafka.TYPE_BUY_HEALTH_RQ_DTO);
    }
};

SAPIStuff = new SAPIStuff();