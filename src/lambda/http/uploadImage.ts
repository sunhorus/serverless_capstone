import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import 'source-map-support/register'
import { getGalleryById, isGalleryExists } from '../../helpers/galleries'
import { updateImageCounter } from '../../helpers/galleriesAccess'
import { addImage, get_Image_link } from '../../helpers/Images'
import { CreateImageRequest } from '../../requests/CreateImageRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('ImgUpdlogs')

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

        logger.info('Processing event Upload Image: ', event)
        const jwtToken = getUserId(event)
        const glaId = event.pathParameters.glaId
        const validGlaId = await isGalleryExists(glaId/*, jwtToken*/)

        if (!validGlaId) {
            logger.error(`Gallery not found`)
            return {
                statusCode: 404,
                body: JSON.stringify({
                    Error: 'Gallery not found'
                })
            }

        }
        const TempGallery = await getGalleryById(glaId, jwtToken)
        logger.info(`Gallery Found ${validGlaId} ID: ${glaId}`)
        const newImage: CreateImageRequest = JSON.parse(event.body)
        logger.info(`Req BODY  ${JSON.stringify(newImage)}`)
        const newItem = await addImage(newImage, glaId, jwtToken)

        const url = await get_Image_link(newItem.imageId)
        const tempCount = TempGallery.imageCount + 1
        console.log(`updateing gallery ${JSON.stringify(TempGallery)} New Count = ${tempCount}`)
        await updateImageCounter(TempGallery, tempCount)
        logger.info(`Image Link Sent Successfully`)

        return {
            statusCode: 201,
            body: JSON.stringify({
                newItem: newItem,
                uploadUrl: url
            })
        }
    })
handler.use(
    cors({
        credentials: true
    })
)