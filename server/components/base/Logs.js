const FS = require('fs');

/**
 * Компонент логирования.
 * Клиент-серверный компонент!
 * @type {Logs}
 */
var Logs = function () {
    let self = this;

    /**
     * Уровень срабатывания.
     * @type {number} Logs.LEVEL_*
     */
    let trigger_level = null;

    this.init = function (afterInitCallback) {
        trigger_level = Config.Logs.triggerLevel;
        afterInitCallback();
    };

    /**
     * Сюда и проходят логи.
     * @param message {string} сообщение.
     * @param level {int} тип Logs.LEVEL_*.
     * @param [details] {*} необязательный параметр, детали.
     * @param channel
     * @param telega
     */
    this.log = function (message, level, telega) {
        let dateFormated, logText, levelTitle;
        if (!level) level = Logs.LEVEL_TRACE;
        if (level < trigger_level) return;
        dateFormated = formatDate();
        levelTitle = typeTitles[level];
        logText = dateFormated + ' [' + levelTitle + (telega ? '+' : ' ') + '] ' + message;
        switch (level) {
            case Logs.LEVEL_ERROR:
                console.error(" > " + logText);
                break;
            case Logs.LEVEL_WARN:
                console.warn(" > " + logText);
                break;
            default:
                console.log(" > " + logText);
                break;
        }
        if (level >= Logs.LEVEL_INFO || telega) {
            telegramSent(message);
        }
    };

    let formatDate = function () {
        var date = new Date();
        /** Тут мы получим "01-01-2014 15:55:55" */
        let day, month, year, hour, minutes, seconds;
        day = str_pad(date.getDate());
        hour = str_pad(date.getHours());
        minutes = str_pad(date.getMinutes());
        seconds = str_pad(date.getSeconds());
        return day + '.' + ' ' + hour + ':' + minutes + ':' + seconds;
    }
    /**
     * Дополним нулями значение и вернёт строку
     * Тут это специфичная функция, дополнит нулями число спереди до 2ух знаков.
     * @param sourceValue {number}
     */
    let str_pad = function (sourceValue) {
        return "00000".substr(0, 2 - sourceValue.toString().length) + sourceValue;
    };

    this.setLevel = function (level) {
        trigger_level = level;
    };

    /* константы типов логов */

    /**
     * Детально.
     */
    this.LEVEL_DETAIL = 1;

    /**
     * Оповещение.
     */
    this.LEVEL_NOTIFY = 2;

    /**
     * Оповещение.
     */
    this.LEVEL_ALERT = 3;

    /**
     * Внимание.
     */
    this.LEVEL_WARNING = 4;

    /**
     * Ошибка.
     */
    this.LEVEL_ERROR = 5;


    this.alert = function (level, message) {
        if (level < trigger_level) return;
        alert(message);
    };

    /**
     *
     * @param message
     */
    let telegramSent = function (message) {
        if (message.includes("KafkaJS")) {
            return;
        }
        if (!this.Kafka) {
            console.log("Cant sent to telegram " + message);
            return;
        }
        this.Kafka.sendToCommon({
            message: message,
            level: "INFO",
            sendToTelegram: true
        }, undefined, this.Kafka.TYPE_LOG_RQ_DTO);
    };

    let typeTitles = {};
    /** Человеко-читаемые типы логов. */
    typeTitles[this.LEVEL_TRACE] = 'd';
    typeTitles[this.LEVEL_DEBUG] = 'N';
    typeTitles[this.LEVEL_INFO] = '!';
    typeTitles[this.LEVEL_WARN] = 'w';
    typeTitles[this.LEVEL_ERROR] = 'E';

    this.Kafka = undefined;
    this.setKafka = function (toInject) {
        this.Kafka = toInject;
    }
};

Logs = new Logs();

Logs.depends = [];
global['Logs'] = Logs
module.exports = { Logs }