import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import 'source-map-support/register'
import { isGalleryExists } from '../../helpers/galleries'
import { addImage, get_Image_link } from '../../helpers/Images'
import { CreateImageRequest } from '../../requests/CreateImageRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
const logger = createLogger('Albumlogs')
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

        console.log('Processing event Upload Image: ', event)
        const jwtToken = getUserId(event)
        const albumId = event.pathParameters.albumId
        const validAlbumId = await isGalleryExists(albumId, jwtToken)

        if (!validAlbumId) {
            logger.error(`Album not found`)
            // return new ApiResponseHelper().generateErrorResponse(404,'Album not found')
            return {
                statusCode: 404,
                body: JSON.stringify({
                    Error: 'Gallery not found'
                })
            }

        }
        const newImage: CreateImageRequest = JSON.parse(event.body)
        const newItem = await addImage(newImage, albumId, jwtToken)

        const url = get_Image_link(newItem.imageId)
        logger.info(`Image Uploaded`)

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