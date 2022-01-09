# Udacity Serverless Capstone Project

This project created as Images Gallery Sharing between Authenticated Apllication users.
The project is only a backend API and Postman Collection is provided
- Generate Authntication Token
-  Do all the Required, Implemented  Resources


## Usage

Download the Postman collection, To generate a JWT tokken to be used with the Application
**Access_Token Generator** endpoint a popup will prompet for goole account login
JWT tokken is added to Collection Variables to be able to use all Endpoints.

## Deployment output

```
Service Information
service: capstone-final-project
stage: dev
region: us-east-1
stack: capstone-final-project-dev
resources: 95
api keys:
  None
endpoints:
  POST - https://1n3fuexhwk.execute-api.us-east-1.amazonaws.com/dev/galleries
  GET - https://1n3fuexhwk.execute-api.us-east-1.amazonaws.com/dev/galleries
  GET - https://1n3fuexhwk.execute-api.us-east-1.amazonaws.com/dev/galleries/myGalleries
  POST - https://1n3fuexhwk.execute-api.us-east-1.amazonaws.com/dev/galleries/{glaId}/images
  POST - https://1n3fuexhwk.execute-api.us-east-1.amazonaws.com/dev/galleries/{glaId}/save
  GET - https://1n3fuexhwk.execute-api.us-east-1.amazonaws.com/dev/galleries/{glaId}/images
  DELETE - https://1n3fuexhwk.execute-api.us-east-1.amazonaws.com/dev/galleries/{glaId}
  DELETE - https://1n3fuexhwk.execute-api.us-east-1.amazonaws.com/dev/images/{imageId}
functions:
  Auth: capstone-final-project-dev-Auth
  CreateGallery: capstone-final-project-dev-CreateGallery
  GetGalleries: capstone-final-project-dev-GetGalleries
  GetUserGalleries: capstone-final-project-dev-GetUserGalleries
  UploadImage: capstone-final-project-dev-UploadImage
  EditGallery: capstone-final-project-dev-EditGallery
  GetImages: capstone-final-project-dev-GetImages
  DeleteGallery: capstone-final-project-dev-DeleteGallery
  DeleteImage: capstone-final-project-dev-DeleteImage
layers:
  None

Stack Outputs
AuthLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:253015982248:function:capstone-final-project-dev-Auth:26
GetUserGalleriesLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:253015982248:function:capstone-final-project-dev-GetUserGalleries:3
DeleteImageLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:253015982248:function:capstone-final-project-dev-DeleteImage:3
UploadImageLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:253015982248:function:capstone-final-project-dev-UploadImage:24
CreateGalleryLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:253015982248:function:capstone-final-project-dev-CreateGallery:30
GetGalleriesLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:253015982248:function:capstone-final-project-dev-GetGalleries:30
ServerlessDeploymentBucketName: capstone-final-project-d-serverlessdeploymentbuck-1xu8njlrqlk4i
GetImagesLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:253015982248:function:capstone-final-project-dev-GetImages:10
DeleteGalleryLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:253015982248:function:capstone-final-project-dev-DeleteGallery:3
AwsDocApiId: 1n3fuexhwk
EnterpriseLogAccessIamRole: arn:aws:iam::253015982248:role/capstone-final-project-de-EnterpriseLogAccessIamRo-TAXG7RZC942Z
EditGalleryLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:253015982248:function:capstone-final-project-dev-EditGallery:9
ServiceEndpoint: https://1n3fuexhwk.execute-api.us-east-1.amazonaws.com/dev
```