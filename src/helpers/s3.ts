import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'



const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
// const XAWS = AWSXRay.captureAWS(AWS)

// const s3: AWS.S3 = new XAWS.S3({
    const s3: AWS.S3 = new AWS.S3({
    signatureVersion: 'v4',
    region: process.env.region,
    params: { Bucket: process.env.IMAGES_S3_BUCKET }

})

export const getPresignedUrl = async (imageId: string): Promise<string> => {
    return await s3.getSignedUrl('putObject', {
        Bucket: process.env.IMAGES_S3_BUCKET,
        Key: imageId,
        Expires: urlExpiration
    }) as string;
}