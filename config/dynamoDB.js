const AWS = require('aws-sdk')
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})

const dynamoTableName = process.env.DYNAMO_TABLE_NAME
const dynamoClient = new AWS.DynamoDB.DocumentClient()


const insertStoreCache = (user_id, username, phone_number, store_name) => {
    const params = {
        TableName: dynamoTableName,
        Item: { user_id, username, phone_number, store_name }
    }
    dynamoClient.put(params, (err, data) => {
        if (err) {
            console.log(err)
            throw new Error('Couldn\'t insert into cache')
        }
    });
}

const updateStoreCache = (user_id, username, phone_number, store_name) => {
    const params = {
        TableName: dynamoTableName,
        Key: { user_id },
        UpdateExpression: "set username = :username, phone_number=:phone_number, store_name=:store_name",
        ExpressionAttributeValues: {
            ":username": username,
            ":phone_number": phone_number,
            ":store_name": store_name
        },
        ReturnValues: "UPDATED_NEW"
    }
    dynamoClient.update(params, (err, data) => {
        if (err) {
            console.log(err)
            throw new Error('Couldn\'t update cache')
        }
    });
}


const getAllStores = ()=>{
    var params = {
        TableName: dynamoTableName,
        AttributesToGet: [`username`, `store_name`, `phone_number`]
    };
    dynamoClient.scan(params, (err, data) => {
        if (err) {
            console.log(err)
            throw new Error('Couldn\'t read all stores from cache')
        } else {
            return {
                stores: data.Items
            }
        }
    });
}


const getStore = (username) => {
    var params = {
        TableName: dynamoTableName,
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: {
            "#username": "username"
        },
        ExpressionAttributeValues: {
            ":username": username
        }
    };
    dynamoClient.query(params, (err, data) => {
        if (err) {
            console.log(err)
            throw new Error('Couldn\'t read store data from cache')
        } else {
            console.log(data)
            return {
                storeData: data.Items
            }
        }
    });
}
getStore(`dynamo123`)


module.exports = {
    dynamoClient,
    dynamoTableName,
    insertStoreCache,
    updateStoreCache,
    getAllStores
}