import { Image } from "../models/Image"
import { CreateImageRequest } from "../requests/CreateImageRequest"
import { createImage, deleteImage, getAllImages, getImage, getImages, getUploadUrl } from "./../helpers/imagesAccess"
import * as uuid from 'uuid'

const imageBucket = process.env.IMAGES_S3_BUCKET

export async function addImage(
  createImageRequest: CreateImageRequest,
  glaId: string,
  jwtToken: string
): Promise<Image> {

  const imageId = uuid.v4()
  const userId = jwtToken

  return await createImage({
    galleryId: glaId,
    userId: userId,
    timestamp: new Date().toISOString(),
    imageId: imageId,
    title: createImageRequest.title,
    imageUrl: `https://${imageBucket}.s3.amazonaws.com/${imageId}`
  })
}

export async function get_Image_link(imageId: string) {
    return await getUploadUrl(imageId)
  }
  
  
  export async function getGalleryImages(glaId: string): Promise<Image[]> {
    return await getImages(glaId)
  }
  
  export async function getImagebyId(imageId: string): Promise<Image> {
    return getImage(imageId)
  }
  
  export async function deleteImagebyId(image: Image) {
    return deleteImage(image)
  }
  
  export async function getAllImagesReq(): Promise<Image[]> {
    return getAllImages()
  }
  