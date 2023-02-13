var SEND_VOTE = 'SEND_VOTE';
var SET_AUTH = 'SET_AUTH';
var WebCommunicator = /** @class */ (function () {
    function WebCommunicator(injectAuthMethod) {
        if (injectAuthMethod === void 0) { injectAuthMethod = false; }
        var _this = this;
        this._send = function (data) {
            window.postMessage(data, "*");
        };
        this.submitVote = function (vote) {
            return _this._send({
                type: SEND_VOTE,
                payload: vote
            });
        };
        this.setAuth = function (authData) {
            return _this._send({
                type: SET_AUTH,
                payload: authData
            });
        };
        if (injectAuthMethod) {
            ;
            window.yupSetAuth = this.setAuth;
        }
        else {
            ;
            window.yupSetAuth = function () { return Promise.resolve(null); };
        }
        ;
        window.yupSubmitVote = this.submitVote;
    }
    return WebCommunicator;
}());
var allowRegex = /^((http:|https:))?([/][/])?(www.)?[a-zA-Z\-_0-9]{0,}\.?[a-zA-Z\-_0-9]{0,}(yup.info.gf|yup-live.pages.dev|.yup.io|yup-team.vercel.app|localhost\/|localhost:)(.*)/gm;
var isAllowed = allowRegex.test(window.location.href);
if (isAllowed) {
    new WebCommunicator(true);
}
else {
    new WebCommunicator();
}
