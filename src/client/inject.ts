const SEND_VOTE = 'SEND_VOTE'
const SET_AUTH = 'SET_AUTH'

class WebCommunicator {
    _send = (data) => {
        window.postMessage(data, "*")
    }

    submitVote = (vote) => {
        return this._send({
            type: SEND_VOTE,
            payload: vote
    })
    }

    setAuth = (authData) => {
        return this._send({
            type: SET_AUTH,
            payload: authData
        })
        
    }
            

  constructor (injectAuthMethod = false) {
    if (injectAuthMethod) {
      ;(<any>window).yupSetAuth = this.setAuth
    } else {
      ;(<any>window).yupSetAuth = () => Promise.resolve(null)
    }
     ;(<any>window).yupSubmitVote = this.submitVote
  }
}

const allowRegex = /^((http:|https:))?([/][/])?(www.)?[a-zA-Z\-_0-9]{0,}\.?[a-zA-Z\-_0-9]{0,}(yup.info.gf|yup-live.pages.dev|.yup.io|yup-team.vercel.app|localhost\/|localhost:)(.*)/gm
const isAllowed = allowRegex.test(window.location.href)

console.log('isAllowed', isAllowed)

if(isAllowed) {
    new WebCommunicator(true)
} else {
    new WebCommunicator()
}

