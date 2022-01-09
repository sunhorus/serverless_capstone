import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Gallery } from '../models/gallery'

const XAWS = AWSXRay.captureAWS(AWS)
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
// const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient({ endpoint: 'http://localhost:8089' })
const galleriesTable = process.env.GALLERIES_TABLE

// const s3Bucket: Types = new XAWS.S3({ signatureVersion: 'v4' })
// const bucketName = process.env.GALLERIES_S3_BUCKET
// const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)

const logger = createLogger('GalleriesAccess')


export const getGalleries = async (): Promise<Gallery[]> => {
  logger.info(`Getting all Public Galleries`)

  //Scan operation used in this function to be able to get 
  // all shared galleries without the need to provide partition key
  // which will act as fillter and the desired output will not be possible
  const result = await docClient.scan({
    TableName: galleriesTable,
    FilterExpression: '#private = :private',
    ExpressionAttributeNames: {
      '#private' : 'private'
    },
    // KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      // ':userId': userId,
      ':private' : false
    }
  }).promise()
  const items = result.Items
  return items as Gallery[]
}

export const getUserGalleries = async (userId: string): Promise<Gallery[]> => {
  logger.info(`Getting Galleries for user ${userId}`)

  const result = await docClient.query({
    TableName: galleriesTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()
  const items = result.Items
  return items as Gallery[]
}

export const galleryExists = async (/*userId: string,*/ galleryId: string): Promise<boolean> => {
  const params = {
    TableName: galleriesTable,
    FilterExpression : '#id = :id',
    ExpressionAttributeNames: {
      '#id' : 'id'
    },
    ExpressionAttributeValues : {
      ':id' : galleryId
    }
    // Key: {
    //   id: galleryId,
    //   // userId: userId
    // }
  }
  //Scan operation used in this function to be able to get 
  // all shared galleries without the need to provide partition key
  // which will act as fillter and the desired output will not be possible
  const result = await docClient.scan(params).promise()

  return !!result.Items.length
}

export const getGallery = async (userId: string, galleryId: string): Promise<Gallery> => {
  const params = {
    TableName: galleriesTable,
    Key: {
      id: galleryId,
      userId: userId
    }
  }
  const result = await docClient.get(params).promise()
  console.log('Galleries :', result.Item.imageCount)
  return result.Item as Gallery
}


export const createGallery = async (gal: Gallery): Promise<Gallery> => {

  const params = {
    TableName: galleriesTable,
    Item: gal
  }
  await docClient.put(params).promise()
  return gal
}

export const updateGallery = async (gal: Gallery): Promise<Gallery> => {

  console.log('Name:' + gal.name)
  console.log('Description:' + gal.description)
  await docClient.update({
    TableName: galleriesTable,
    Key: { userId: gal.userId, id: gal.id },
    UpdateExpression: "SET #desc = :r, #nmz = :p, #pri = :pri",
    ExpressionAttributeNames: { "#desc": "description", "#nmz": "name", "#pri": "private" },
    ExpressionAttributeValues: { ":r": gal.description, ":p": gal.name, ":pri": gal.private },
    ReturnValues: "UPDATED_NEW"
  }).promise()

  return gal
}

export const updateImageCounter = async (gal: Gallery, counter: number): Promise<Gallery> => {

  await docClient.update({
    TableName: galleriesTable,
    Key: { "userId": gal.userId, "id": gal.id },
    UpdateExpression: "set #icn=:r",
    ExpressionAttributeNames: { "#icn": "imageCount" },
    ExpressionAttributeValues: { ":r": counter },
    ReturnValues: "UPDATED_NEW"
  }).promise()

  return gal
}


export const deleteGallery = async (userId: string, galId: string): Promise<void> => {


  const params = {
    TableName: galleriesTable,
    Key: {
      id: galId,
      userId: userId
    }
  }
  await docClient.delete(params).promise()
}