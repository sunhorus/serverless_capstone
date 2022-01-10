import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { getGalleryById } from '../../BusinessLogic/galleries'
import { cors } from 'middy/middlewares'

const logger = createLogger('Albumlogs')
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const jwtToken = getUserId(event)
  const galId = event.pathParameters.glaId
  const gal = await getGalleryById(galId, jwtToken)

  if (!gal) {
    logger.error(`Gallery not found`)
    return {
        statusCode: 404,
        body: JSON.stringify({
            Error: 'Gallery not found'
        })
      }

  }
  logger.error(`Gallery Found`)

  return {
    statusCode: 200,
    body: JSON.stringify({
        gal
    })
  }
})

handler.use(
    cors({
        credentials: true
    })
)