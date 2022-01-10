import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { deleteImagebyId, getImagebyId } from '../../helpers/Images'
import { cors } from 'middy/middlewares'
import * as middy from 'middy'
import { getGalleryById } from '../../helpers/galleries'
import { Image } from '../../models/Image'
import { updateImageCounter } from '../../helpers/galleriesAccess'

const logger = createLogger('Imagelogs')


export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        console.log('Caller event', event)
        const imageId = event.pathParameters.imageId

        const jwtToken = getUserId(event)
        const userId = jwtToken

        const image: Image = await getImagebyId(imageId)

        if (!image || image.userId !== userId) {
            logger.error(`Image not found`)
            return {
                statusCode: 404,
                body: JSON.stringify({
                    Error: 'Image not found'
                })
            }

        }

        try {
            logger.info(`Deleting Image`)
            await deleteImagebyId(image)
            const TempGallery = await getGalleryById(image.galleryId, jwtToken)
            const tempCount = TempGallery.imageCount - 1
            console.log(`updateing gallery ${JSON.stringify(TempGallery)} New Count = ${tempCount}`)
            await updateImageCounter(TempGallery, tempCount)
            return {
                statusCode: 200,
                body: JSON.stringify({
                    Message: 'Image Deleted'
                })
            }

        } catch (err) {
            logger.error(`Image Deletion failed`)
            return {
                statusCode: 500,
                body: JSON.stringify({
                    Error: 'Failed to delete'
                })
            }

        }
    })

handler.use(
    cors({
        credentials: true
    })
)