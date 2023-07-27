const mongoose = require("mongoose");
const Message = require("../models/messageModel");


async function GetMessages(email) {

    const response = await Message.find({}, { _id: 0, userId: 0, __v: 0, reportStatus: 0 });

    const personalMessage = response.filter(message => {
        if (message.to === email) {
            return message;
        }
    })

    if (personalMessage[0] === undefined) {
        console.log(personalMessage[0]);
        return { message: "no message yet", }
    }

    return { personalMessage };
}

async function ReportMessage(id) {

    const message = await Message.findOne({ messageId: id });

    if (!message) {
        return {
            message: "cannot find message with the specified id",
        }
    }
    const reportCount = message.reportStatus.reportCount;

    let status = message.reportStatus.status;
    let newReportCount = reportCount;
    newReportCount++;

    if (newReportCount >= 3) {
        status = "Warnning";
    }

    if (newReportCount >= 5) {
        status = "Message to be deleted";
    }

    if (newReportCount >= 6) {
        const deletedMessage = await Message.deleteOne({ messageId: id });

        return {
            message: "this message was deleted because it was reported multiple times",
            deletedMessage
        }
    }

    const newReportStatus = {
        reportCount: newReportCount,
        status
    }

    await Message.updateOne({ messageId: id }, { reportStatus: newReportStatus });

    const updatedMessage = await Message.findOne({ messageId: id });


    console.log(updatedMessage);

    return updatedMessage;
}

module.exports = {
    GetMessages,
    ReportMessage
}