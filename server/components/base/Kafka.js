const { Logs } = require("./Logs");

const KafkaJS = require("kafkajs").Kafka;
//const { LogicConnection } = require("../application/logic/LogicConnection.js");

//const CAPIUser = require("../generated/CAPIUser.js");

const kafkaJs = new KafkaJS({
    clientId: "node-client",
    brokers: [
        "kafka:9092",
    ],
    retry: {
        initialRetryTime: 1000,
        retries: 10000
    }
});

const producer = kafkaJs.producer()
const consumer = kafkaJs.consumer({ groupId: '1' })

const run = async () => {
    // Producing
    await producer.connect()

    // Consuming
    await consumer.connect()
    await consumer.subscribe({ topic: 'topic-client', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let msg = JSON.parse(message.value.toString());

            console.log("KAFKA." + topic + " > node" + " " + partition);
            console.log(message.headers.__TypeId__.toString(), message.value.toString());

            // to client
            var cntx;
            try {
                switch (message.headers.__TypeId__.toString()) {

                    // USERS
                    case 'm3.users.dto.rs.UpdateUserListInfoRsDto':
                        CAPIUser.updateUserListInfo(msg.userId,
                            msg.list
                        );
                        break;
                    case 'm3.users.dto.rs.AuthSuccessRsDto':
                        cntx = ApiRouter.getConnectContext(msg.connectionId);
                        LogicConnection.userAddConn(msg.id, msg.socNetUserId, cntx);
                        CAPIUser.authorizeSuccess(msg.userId,
                            {
                                id: msg.id,
                                connectionId: msg.connectionId,
                                createTm: msg.createTm,
                                firstName: msg.firstName,
                                fullRecoveryTime: msg.fullRecoveryTime,
                                lastName: msg.lastName,
                                loginTm: msg.loginTm,
                                logoutTm: msg.logoutTm,
                                nextPointId: msg.nextPointId,
                                online: msg.online,
                                photo50: msg.photo50,
                                photo100: msg.photo100,
                                socNetTypeId: msg.socNetTypeId,
                                socNetUserId: msg.socNetUserId,
                            }
                        );

                        break;
                    case 'm3.users.dto.rs.GotMapFriendIdsRsDto':
                        console.log(CAPIUser.gotMapFriendIds);
                        CAPIUser.gotMapFriendIds(msg.userId,
                            msg.mapId,
                            msg.ids);
                        break;
                    case 'm3.users.dto.rs.GotFriendsIdsRsDto':
                        CAPIUser.gotFriendsIds(msg.userId,
                            msg.fids
                        );
                        break;
                    case 'm3.users.dto.rs.GotTopUsersRsDto':
                        CAPIUser.gotTopUsers(msg.userId,
                            msg.users
                        );
                        break;
                    case 'm3.users.dto.rs.SendMeScoresRsDto':
                        CAPIUser.gotScores(msg.userId,
                            msg.pids,
                            msg.uids
                        );
                        break;
                    case 'm3.users.dto.rs.SetOneHealthHideRsDto':
                        CAPIUser.setOneHealthHide(msg.userId,
                            msg.oneHealthHide,
                            msg.fullRecoveryTime
                        );
                        break;
                    case 'm3.users.dto.rs.UpdateUserInfoRsDto':
                    case 'm3.lib.dto.rs.UpdateUserInfoRsDto':
                    case 'm3.common.dto.rs.UpdateUserInfoRsDto':
                        CAPIUser.updateUserInfo(msg.userId, msg);
                        break;
                    // COMMMON
                    case 'm3.common.dto.rs.UpdateTimeRsDto':
                        cntx = ApiRouter.getConnectContext(msg.connectionId);
                        ApiRouter.executeRequest("CAPITimeServer", "gotServerTime", [msg.timestamp], [cntx]);
                        break;
                    case 'm3.game.dto.rs.GotMapInfoRsDto':
                        CAPIMap.gotMapsInfo(msg.userId, msg.mapId, msg.map, msg.points);
                        break;
                    case 'm3.game.dto.rs.GotStuffRsDto':
                        CAPIStuff.gotStuff(msg.userId, msg);
                        break;
                    case 'm3.lib.dto.rs.ErrorRsDto':
                        CAPILog.log(msg.userId, msg);
                        break;
                    case 'm3.game.dto.rs.GotPointTopScoreRsDto':
                        CAPIMap.gotPointTopScore(msg.userId, msg.pointId, msg);
                        break;
                    case 'm3.game.dto.rs.GotScoresRsDto':
                        CAPIUser.gotScores(msg.userId, msg.rows);
                        break;
                    case 'm3.game.dto.rs.DoOrderChangeAnswerRsDto':
                        LogicPayments.doOrderChangeCallbackAnswer(msg);
                        break;
                    default:
                        console.log("Not found method");
                }
            } catch (e) {
                console.log(e);
            }
        },
    })
}


run().catch((e) => {

    Logs.log(JSON.stringify(e), Logs.LEVEL_ERROR, true);

    console.error(e);
});

/**
 * @type {Kafka}
 */
var Kafka = function () {

    this.TOPIC_USERS = "topic-users";
    this.TOPIC_COMMON = "topic-common";
    this.TOPIC_GAME = "topic-game";

    this.RQ_NS_LIB = "m3.lib.dto.rq";
    this.RQ_NS_USERS = "m3.users.dto.rq";
    this.RQ_NS_COMMON = "m3.common.dto.rq";
    this.RQ_NS_GAME = "m3.game.dto.rq";

    this.TYPE_STATISTIC_RQ_DTO = this.RQ_NS_LIB + ".StatisticRqDto";

    this.TYPE_LOG_RQ_DTO = this.RQ_NS_LIB + ".LogRqDto";
    this.TYPE_SENDMETIME_RQ_DTO = this.RQ_NS_COMMON + ".SendMeTimeRqDto";
    this.TYPE_DO_ORDER_CHANGE_RQ_DTO = this.RQ_NS_GAME + '.DoOrderChangeRqDto';

    this.TYPE_SENDUSERAGENT_RQ_DTO = this.RQ_NS_COMMON + ".SendUserAgentRqDto";
    this.TYPE_UPDATE_LAST_LOGOUT_RQ_DTO = this.RQ_NS_USERS + ".UpdateLastLogoutRqDto";
    this.TYPE_AUTH_RQ_DTO = this.RQ_NS_USERS + ".AuthRqDto";
    this.TYPE_SEND_USER_LIST_INFO_RQ_DTO = this.RQ_NS_USERS + ".SendUserListInfoRqDto";
    this.TYPE_SEND_MAP_FRIENDS_RQ_DTO = this.RQ_NS_USERS + ".SendMapFriendsRqDto";
    this.TYPE_SEND_FRIEND_IDS_BY_SOCNET_RQ_DTO = this.RQ_NS_USERS + ".SendFriendIdsBySocNetRqDto";
    this.TYPE_SEND_TOP_USERS_RQ_DTO = this.RQ_NS_USERS + ".SendTopUsersRqDto";
    this.TYPE_HEALTH_BACK_RQ_DTO = this.RQ_NS_USERS + ".HealthBackRqDto";
    this.TYPE_ZERO_LIFE_RQ_DTO = this.RQ_NS_USERS + ".ZeroLifeRqDto";

    this.TYPE_HEALTH_DOWN_RQ_DTO = this.RQ_NS_USERS + ".HealthDownRqDto";
    this.TYPE_SEND_ME_MAP_INFO_RQ_DTO = this.RQ_NS_GAME + ".SendMeMapInfoRqDto";
    this.TYPE_SEND_ME_SCORES_RQ_DTO = this.RQ_NS_GAME + ".SendMeScoresRqDto";
    this.TYPE_SEND_ME_POINT_TOP_SCORE_RQ_DTO = this.RQ_NS_GAME + ".SendMePointTopScoreRqDto";
    this.TYPE_SEND_ME_STUFF_RQ_DTO = this.RQ_NS_GAME + ".SendMeStuffRqDto";

    this.TYPE_ON_FINISH_RQ_DTO = this.RQ_NS_GAME + ".OnFinishRqDto";
    this.TYPE_USED_HUMMER_RQ_DTO = this.RQ_NS_GAME + ".UsedHummerRqDto";
    this.TYPE_USED_LIGHTNING_RQ_DTO = this.RQ_NS_GAME + ".UsedLightningRqDto";
    this.TYPE_USED_SHUFFLE_RQ_DTO = this.RQ_NS_GAME + ".UsedShuffleRqDto";
    this.TYPE_EXIT_GAME_RQ_DTO = this.RQ_NS_GAME + ".ExitGameRqDto";
    this.TYPE_LOOSE_GAME_RQ_DTO = this.RQ_NS_GAME + ".LooseGameRqDto";

    this.TYPE_SPEND_COINS_FOR_TURNS_RQ_DTO = this.RQ_NS_GAME + ".SpendCoinsForTurnsRqDto";
    this.TYPE_BUY_HUMMER_RQ_DTO = this.RQ_NS_GAME + ".BuyHummerRqDto";
    this.TYPE_BUY_SHUFFLE_RQ_DTO = this.RQ_NS_GAME + ".BuyShuffleRqDto";
    this.TYPE_BUY_LIGHTNING_RQ_DTO = this.RQ_NS_GAME + ".BuyLightningRqDto";
    this.TYPE_BUY_HEALTH_RQ_DTO = this.RQ_NS_GAME + ".BuyHealthRqDto";

    this.init = function (afterInitCallback) {
        Logs.log("Kafka Init create Pool.", Logs.LEVEL_DEBUG);
        afterInitCallback();
    };

    this.sendToUsers = function (fields, userId, type) {
        fields.userId = userId;
        this.send(this.TOPIC_USERS, fields, type);
    }

    this.sendToCommon = function (fields, userId, type) {
        fields.userId = userId;
        this.send(this.TOPIC_COMMON, fields, type);
    };

    this.sendToGame = function (fields, userId, type) {
        fields.userId = userId;
        this.send(this.TOPIC_GAME, fields, type);
    }

    this.send = function (topic, value, type) {
        console.log("KAFKA." + topic + " < ", type, JSON.stringify(value));
        producer.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(value),
                    headers: {
                        '__TypeId__': type
                    }
                }
            ]
        });
    }
};

Kafka = new Kafka();
Kafka.depends = ['Logs'];
Logs.setKafka(Kafka);
global['Kafka'] = Kafka;
module.exports = { Kafka: Kafka }
