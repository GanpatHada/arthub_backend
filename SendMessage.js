const fast2sms = require('fast-two-sms')
const sendMessage = async(name, phone, email) => {
                   try{ const options = {
                        authorization: 'BX7STrEsfpHAx9c5Caewl36zZOVdIWFM2u4LQDtPYv1kigyq0JJmtfjqaYk25NKceUFZgLWlw6MCxBIr',
                        message: `your name is ${name} and mobile is ${phone} and email is ${email}`,
                        numbers: ['8349375304']
                                    }
                    const response = await fast2sms.sendMessage(options)
                    console.log(response)
                                }
                                catch(error)
                                {
                                    console.log(error);
                                }
                              
}
module.exports = sendMessage;