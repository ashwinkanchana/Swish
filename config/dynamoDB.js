const AWS = require('aws-sdk')
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})

const dynamoTableName = process.env.DYNAMO_TABLE_NAME
const dynamoClient = new AWS.DynamoDB.DocumentClient()


const insertStoreCache = (username, phone_number, store_name, user_id) => {
    const params = {
        TableName: dynamoTableName,
        Item: { username, phone_number, store_name, user_id }
    }
    dynamoClient.put(params, (err, data) => {
        if (err) {
            console.log(err)
            throw new Error('Couldn\'t insert into cache')
        }
    });
}

const updateStoreCache = (username, phone_number, store_name, user_id) => {
    const params = {
        TableName: dynamoTableName,
        Key: { username },
        UpdateExpression: "set phone_number=:phone_number, store_name=:store_name",
        ExpressionAttributeValues: {
            ":phone_number": phone_number,
            ":store_name": store_name
        },
        ReturnValues: "UPDATED_NEW"
    }
    dynamoClient.update(params, (err, data) => {
        if (err) {
            console.log(err)
            throw new Error('Couldn\'t update store cache')
        }
    });
}


const getAllStores = async () => {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: dynamoTableName,
            AttributesToGet: [`username`, `store_name`, `phone_number`]
        };
        dynamoClient.scan(params, (err, data) => {
            if (err) {
                console.log(err)
                reject(null, new Error('Couldn\'t read all stores from cache'))
            } else {
                resolve({ stores: data.Items })
            }
        });
    })
}


const getStore = async (username) => {
    return new Promise((resolve, reject) => {
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
                reject(null, new Error('Couldn\'t read store data from cache'))
            } else {
                resolve({ storeData: data.Items })
            }
        })
    })
}




const insertProductCache = (username, productsArray) => {
    const params = {
        TableName: dynamoTableName,
        Key: { username },
        UpdateExpression: "set products=:productsArray",
        ExpressionAttributeValues: {
            ":productsArray": productsArray
        },
        ReturnValues: "UPDATED_NEW"
    }
    dynamoClient.update(params, (err, data) => {
        if (err) {
            console.log(err)
            throw new Error('Couldn\'t update product cache')
        }
    });
}


module.exports = {
    dynamoClient,
    dynamoTableName,
    insertStoreCache,
    updateStoreCache,
    getAllStores,
    getStore,
    insertProductCache
}