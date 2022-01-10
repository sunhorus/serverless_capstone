import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
// import { getUserId } from '../utils'
import { getAllUserGalleries } from '../../BusinessLogic/galleries'
import { getUserId } from '../utils'

const logger = createLogger('Gallerieslogs')
export const handler = middy(
    async (event : APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const jwtToken = getUserId(event)
        const gla = await getAllUserGalleries(jwtToken);
        logger.info(`Listing all Galleries`)

        return {
            statusCode: 200,
            body: JSON.stringify({
                items: gla,
            }),
        }
    })

handler.use(
    cors({
        credentials: true
    })
)