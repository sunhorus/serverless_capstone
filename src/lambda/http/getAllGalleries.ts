import 'source-map-support/register'
import { APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
// import { getUserId } from '../utils'
import { getAllGalleries } from '../../BusinessLogic/galleries'

const logger = createLogger('Gallerieslogs')
export const handler = middy(
    async (): Promise<APIGatewayProxyResult> => {
        // const jwtToken = getUserId(event)
        const gla = await getAllGalleries();
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
        // credentials: true
    })
)