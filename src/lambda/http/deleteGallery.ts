import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { getUserId } from '../utils'
import { deleteUserGallery, getGalleryById } from '../../BusinessLogic/galleries'
import { cors } from 'middy/middlewares'

const logger = createLogger('Gallerylogs')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const glaId = event.pathParameters.glaId
    const jwtToken = getUserId(event)
    const gal = await getGalleryById(glaId, jwtToken)

    if (!gal) {
        logger.error(`Gallery not found to delete`)
        return {
            statusCode: 404,
            body: JSON.stringify({
                Error: 'Gallery not found'
            })
        }
    }

    try {
        await deleteUserGallery(glaId, jwtToken)
        logger.info(`Gallery deleted`)
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Gallery Deleted'
            })
        }

    } catch (err) {
        console.log('Failed to delete', err)
        logger.info(`Gallery failed to delete`)
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