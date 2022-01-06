import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { getUserId } from '../utils'
import { isGalleryExists } from '../../helpers/galleries'
import { getGalleryImages } from '../../helpers/Images'
const logger = createLogger('Albumlogs')
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

//   const authHeader = event.headers['Authorization']
  const jwtToken = getUserId(event)
  const galId = event.pathParameters.galId

  const validAlbumId = await isGalleryExists(galId, jwtToken)

  if (!validAlbumId) {
    logger.error(`not a valid album`)
    // return new ApiResponseHelper().generateErrorResponse(404,'Album not found')
    return {
        statusCode: 404,
        body: JSON.stringify({
            Error: 'Gallery not found'
        })
      }

  }

  const images = await getGalleryImages(galId)
  logger.info(`Listing images for album: ${galId}`)
//   return new ApiResponseHelper().generateImagesDataSuccessResponse(200,images)
  return {
    statusCode: 200,
    body: JSON.stringify({
        images
    })
  }

})
