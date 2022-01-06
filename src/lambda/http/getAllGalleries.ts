import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { getAllGalleries } from '../../helpers/galleries'

const logger = createLogger('Albumlogs')
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const jwtToken = getUserId(event)
        const albums = await getAllGalleries(jwtToken);
        logger.info(`Listing all albums`)

        return {
            statusCode: 200,
            body: JSON.stringify({
                items: albums,
            }),
        }
    })

handler.use(
    cors({
        credentials: true
    })
)