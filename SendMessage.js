const fast2sms = require('fast-two-sms')
const sendMessage = async (buyer, bid, title, paymentid) => {
    try {
        console.log("sms")
        const options = {
            authorization: Vm5TRAvKDb0SXnuZ4EhW2rgL8ywNJkO6sixzeq9d7BpIfUlPCQW15JCQXbyNncUmgluHD4AePRzSrZqf,
            // message: `Dear ${buyer},\n\nYou have successfully purchased ${title} for ${bid} rs.\n\n payment id : ${paymentid}`,
            message:"Hello ganpat",
            numbers: ['9179373806']
        }
        const response = await fast2sms.sendMessage(options)
        console.log(response)
    }
    catch (error) {
        console.log(error);
    }

}
module.exports = sendMessage;