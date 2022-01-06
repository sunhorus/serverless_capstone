import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { getUserId } from '../utils'
import { deleteUserGallery, getGalleryById } from '../../helpers/galleries'
import { cors } from 'middy/middlewares'

const logger = createLogger('Albumlogs')
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

        const albumId = event.pathParameters.albumId
        const jwtToken = getUserId(event)
        const gal = await getGalleryById(albumId, jwtToken)

        if (!gal) {
            logger.error(`Album not found to delete`)
            // return new ApiResponseHelper().generateErrorResponse(404, 'Album not found')
            return {
                statusCode: 404,
                body: JSON.stringify({
                    Error: 'Gallery not found'
                })
            }
        }

        try {
            await deleteUserGallery(albumId, jwtToken)
            logger.info(`Album deleted`)
            // return new ApiResponseHelper().generateDataSuccessMsgResponse(200, 'Album Deleted')
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Gallery Deleted'
                })
            }

        } catch (err) {
            console.log('Failed to delete', err)
            logger.info(`Album failed to delete`)
            // return new ApiResponseHelper().generateErrorResponse(500, 'Failed to delete')
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