import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import 'source-map-support/register'
import { saveGallery } from '../../helpers/galleries'
import { saveGalleryRequest } from '../../requests/saveGalleryRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'



const logger = createLogger('Gallerylogs')
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        console.log('Processing event: ', event)
        logger.info('path:', event.path)
        logger.info('Path Gallery id:', event.pathParameters.galId)
        const galId = event.pathParameters.galId
        const jwtToken = getUserId(event)
        const newGla: saveGalleryRequest = JSON.parse(event.body)
        logger.info(`Gallery updating`)
        const newItem = await saveGallery(newGla, jwtToken, galId)
        // return new ApiResponseHelper().generateDataSuccessResponse(201, 'item', newItem)
        return {
            statusCode: 201,
            body: JSON.stringify({
                items: newItem
            })
          }

    })

handler.use(
    cors({
        credentials: true
    })
)