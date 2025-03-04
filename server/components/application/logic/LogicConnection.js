const {Kafka} = require("../../base/Kafka");
/**
 * @type {LogicConnection}
 */
var LogicConnection = function () {
    let userToCntx = {};
    let userToCntxCount = 0;

    this.init = function (afterInitCallback) {
        ApiRouter.addOnDisconnectCallback(onDisconnectOrFailedSend);
        ApiRouter.addOnFailedSendCallback(onDisconnectOrFailedSend);
        Logs.log("LogicConnection inited.", Logs.LEVEL_DEBUG);
        afterInitCallback();
    };

    /**
     * Отправить пользователю данные
     * @param userId {int} id пользователя.
     * @param group {string} группу апи.
     * @param method {string} метод апи.
     * @param arguments {Array} аргументы апи.
     */
    this.sendToUser = function (userId, group, method, arguments) {
        let cntxList = userGetConns(userId);
        ApiRouter.executeRequest(group, method, arguments, cntxList);
    };

    this.userAddConn = function (userId, socNetUserId, cntx) {
        userAddConn({
            id: userId,
            socNetUserId: socNetUserId
        }, cntx);
    }

    let userAddConn = function (user, cntx) {
        if (!userToCntx[user.id]) {
            Logs.log("CREATE user context. uid:" + user.id + ", cid:" + cntx.cid, Logs.LEVEL_TRACE);
            userToCntx[user.id] = {
                conns: {},
                user: {
                    id: user.id,
                    socNetUserId: user.socNetUserId
                },
                connsCount: 0
            };
            userToCntxCount++;
        }
        Logs.log("ADD user conn", Logs.LEVEL_TRACE);
        cntx.userId = user.id;
        cntx.isAuthorized = true;
        cntx.user = userToCntx[user.id].user;
        userToCntx[user.id].conns[cntx.cid] = cntx;
        userToCntx[user.id].connsCount++;
    };

    let userGetConns = function (userId) {
        return userToCntx[userId] ? userToCntx[userId].conns : null;
    };

    /**
     * Удаляет контекст соединения для пользователя.
     * Так же удалит контекст пользователя, если в результате удаления не останется ни одного соединения.
     * @param cntx
     */
    let userDeleteConn = function (cntx) {
        let userId = cntx.userId;
        Logs.log("DELETE user conn", Logs.LEVEL_TRACE);
        delete userToCntx[userId].conns[cntx.cid];
        userToCntx[userId].connsCount--;
        if (userToCntx[userId].connsCount === 0) {
            Logs.log("DELETE user Context", Logs.LEVEL_TRACE);
            delete userToCntx[userId];
            userToCntxCount--;
        }
    };

    /**
     * Действия при выходе игрока из игры.
     * @param userId {Number} id пользователя.
     */
    let onLogout = function (userId) {
        Kafka.sendToUsers({userId: userId}, userId, Kafka.TYPE_UPDATE_LAST_LOGOUT_RQ_DTO);
    };

    /**
     * это каллбек для определения что соедиение разорвано.
     * и на случай если мы пытаемся отправить данные отконектившемуся клиенту,
     * мы попробуем удалить соединение из контекста пользователя.
     * @param cntx
     */
    let onDisconnectOrFailedSend = function (cntx) {
        if (cntx && cntx.userId) {
            onLogout(cntx.userId);
            userDeleteConn(cntx);
        }
    };
};

LogicConnection = new LogicConnection();
LogicConnection.depends = ['Logs'];
global["LogicConnection"] = LogicConnection;
module.exports = {LogicConnection}