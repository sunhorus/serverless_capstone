// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import 'source-map-support/register'
// import { createLogger } from '../../utils/logger'
// import * as middy from 'middy'
// import { getUserId } from '../utils'
// import { updateGalleryImageCounter } from '../../helpers/galleries'
// import { cors } from 'middy/middlewares'


// const logger = createLogger('Gallerylogs')
// export const handler = middy(
//     async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//         logger.info('image counter updated start')
//         const galId = event.pathParameters.galId
//         // const authHeader = event.headers['Authorization']

//         const count: number = JSON.parse(event.body)
//         console.log('Count Recieved from UI' + event.body)
//         const jwtToken = getUserId(event)
//         logger.info('image counter updated')
//         const newItem = await updateGalleryImageCounter(jwtToken, galId, count)
//         // return new ApiResponseHelper().generateDataSuccessResponse(201, 'item', newItem)
//         return {
//             statusCode: 201,
//             body: JSON.stringify({
//                 items: newItem
//             })
//           }

//     })

// handler.use(
//     cors({
//         credentials: true
//     })
// )