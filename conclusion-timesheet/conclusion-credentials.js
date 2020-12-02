const { decrypt } = require("./crypt");

const CONCLUSION_TIMESHEET_URL = "https://somenumber.somesite.nl/"

const conclusionEncryptedCredentials =  {
  username : {
    iv: 'c3cec8d604bd1b31dd6de5ac1a78ef13',
    content: 'ca28bd313fd75bb917261ad8f6e2ab78efb8aca0'
  },
  password : {
    iv: 'f80cd70114d4b85e2cee4f7fdadfe6fc',
    content: '718agbcc9fa1727'
  },
  
}    

const getConclusionCredentials = function (secretKey) {
    const conclusionCredentials = {
        username : decrypt(secretKey, conclusionEncryptedCredentials.username),
        password : decrypt(secretKey, conclusionEncryptedCredentials.password),
        CONCLUSION_TIMESHEET_URL: CONCLUSION_TIMESHEET_URL       
    }
    return conclusionCredentials    

}
exports.retrieveConclusionCredentials = getConclusionCredentials



