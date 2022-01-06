import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { CreateGalleryRequest } from '../../requests/CreateGalleryRequest'
import { createNewGallery } from '../../helpers/galleries'
const logger = createLogger('Albumlogs')

export const handler = middy ( 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const jwtToken = getUserId(event)
  const newGal: CreateGalleryRequest = JSON.parse(event.body)
  logger.info(`Album creating`)
  const newItem = await createNewGallery(newGal, jwtToken)

  return {
    statusCode: 201,
    body: JSON.stringify({
      newItem
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)