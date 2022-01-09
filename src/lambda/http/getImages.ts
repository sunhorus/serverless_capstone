import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { getUserId } from '../utils'
import { isGalleryExists } from '../../helpers/galleries'
import { getGalleryImages } from '../../helpers/Images'
import { cors } from 'middy/middlewares'
const logger = createLogger('Gallerylogs')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    // logger.info(`event Logging ${JSON.stringify(event)}`)
    const jwtToken = getUserId(event)
    const galId = event.pathParameters.glaId
    logger.info(`Getting Images for gallery ID ${galId}`)
    const validGlaId = await isGalleryExists(galId, jwtToken)

    if (!validGlaId) {
      logger.error(`not a valid Gallery`)
      return {
        statusCode: 404,
        body: JSON.stringify({
          Error: 'Gallery not found'
        })
      }

    }
    logger.info(`Gallery Found: ${galId}`)
    const images = await getGalleryImages(galId)
    logger.info(`Listing images for Gallery: ${galId}`)
    return {
      statusCode: 200,
      body: JSON.stringify({
        images
      })
    }

  })
handler.use(
  cors({
  })
)
