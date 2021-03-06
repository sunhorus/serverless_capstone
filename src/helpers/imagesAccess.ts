import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { getPresignedUrl } from './s3'
import { Image } from '../models/Image'
import { createLogger } from '../utils/logger'


const XAWS = AWSXRay.captureAWS(AWS)
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
// const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient({ endpoint: 'http://localhost:8089' })
const imagesTable = process.env.IMAGES_TABLE
const imageIdIndex = process.env.IMAGE_ID_INDEX
const logger = createLogger('ImageAccessLogger')

export const createImage = async (image: Image): Promise<Image> => {

    const params = {
        TableName: imagesTable,
        Item: image,
    };

    await docClient.put(params).promise()
    return image;
}

export const getUploadUrl = async (imageId: string) => {
    logger.info(`Trying to get image URL`)
    const url = await getPresignedUrl(imageId)
    logger.info(`New Image URL = ${url}`)
    return url
}


export const getImages = async (glaId: string): Promise<Image[]> => {

    const params = {
        TableName: imagesTable,
        KeyConditionExpression: "#id = :galleryId",
        ExpressionAttributeNames: {
            "#id": "galleryId"
        },
        ExpressionAttributeValues: {
            ":galleryId": glaId
        }
    };

    const result = await docClient.query(params).promise()
    const items = result.Items
    return items as Image[]
}

export const getImage = async (imageId: string): Promise<Image> => {

    const params = {
        TableName: imagesTable,
        IndexName: imageIdIndex,
        KeyConditionExpression: "#id = :imageId",
        ExpressionAttributeNames: {
            "#id": "imageId"
        },
        ExpressionAttributeValues: {
            ":imageId": imageId
        }
    };

    const result = await docClient.query(params).promise()
    if (result.Count !== 0) {
        return result.Items[0] as Image
    }
}

export const deleteImage = async (image: Image): Promise<void> => {

    const params = {
        TableName: imagesTable,
        Key: {
            galleryId: image.galleryId,
            timestamp: image.timestamp
        }
    }
    await docClient.delete(params).promise()
}

export const getAllImages = async (): Promise<Image[]> => {
    const params = {
        TableName: imagesTable,
    }
    const result = await docClient.query(params).promise()
    const items = result.Items
    return items as Image[]
}