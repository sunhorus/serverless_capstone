import { Gallery } from '../models/gallery'
import { Image } from '../models/Image'

import { createGallery, deleteGallery, galleryExists, getGalleries, getGallery, getUserGalleries, updateGallery, updateImageCounter } from '../helpers/galleriesAccess'
import * as uuid from 'uuid'
import { CreateGalleryRequest } from '../requests/CreateGalleryRequest'
import { saveGalleryRequest } from '../requests/saveGalleryRequest'
import { deleteImage, getImages } from '../helpers/imagesAccess'




export async function getAllGalleries(): Promise<Gallery[]> {
  
  return await getGalleries()
}

export const getAllUserGalleries = async (jwtToken: string) => {
  const userId = jwtToken;
  return await getUserGalleries(userId)
}

export async function createNewGallery(createGalleryRequest: CreateGalleryRequest, jwtToken: string): Promise<Gallery> {
  const itemId = uuid.v4()
  const userId = jwtToken

  return await createGallery({
    id: itemId,
    userId: userId,
    name: createGalleryRequest.name,
    description: createGalleryRequest.description,
    private: true,
    timestamp: new Date().toISOString(),
    imageCount: 0

  })
}


export async function saveGallery(
  saveGalleryRequest: saveGalleryRequest,
  jwtToken: string,
  glaId: string
): Promise<Gallery> {

  const itemId = glaId
  const userId = jwtToken


  return await updateGallery({
    id: itemId,
    userId: userId,
    name: saveGalleryRequest.name,
    description: saveGalleryRequest.description,
    private: saveGalleryRequest.private,
    timestamp: new Date().toISOString()
    // imageCount: saveGalleryRequest.imageCount
  })

}


export async function updateGalleryImageCounter(
  jwtToken: string,
  glaId: string,
  counter: number
): Promise<Gallery> {

  const itemId = glaId
  const userId = jwtToken
  console.log("COUNTER LOG:" + counter)
  return await updateImageCounter({
    id: itemId,
    userId: userId,
    name: "",
    description: "",
    private: false,
    timestamp: new Date().toISOString(),
    imageCount: counter
  }, counter)

}


export async function isGalleryExists(
  glaId: string,
  // jwtToken: string
): Promise<boolean> {
  // const userId = jwtToken
  return await galleryExists(
    // userId,
    glaId
  )
}

export async function getGalleryById(
  glaId: string,
  jwtToken: string
): Promise<Gallery> {
  const userId = jwtToken
  console.log(glaId);
  return await getGallery(
    userId,
    glaId
  )
}

export async function deleteUserGallery(
  glaId: string,
  jwtToken: string
): Promise<void> {
  const userId = jwtToken
  const images = await getImages(glaId);
  console.log('images', images)
  images.map(async (image: Image) => deleteImage(image))

  await deleteGallery(
    userId,
    glaId
  )
}