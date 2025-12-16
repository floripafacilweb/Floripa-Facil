
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
// import prisma from './prisma' // Assuming prisma client is exported here

// --- TYPES ---
// Defined based on your Prisma Schema

// --- SERVER ACTIONS ---

/**
 * Update an existing package price or details
 */
export async function updatePackage(formData: FormData) {
  const id = formData.get('id') as string
  const price = parseFloat(formData.get('price') as string)
  const isBestSeller = formData.get('isBestSeller') === 'on'
  
  // In a real app, use Zod for validation here
  
  /*
  await prisma.package.update({
    where: { id },
    data: {
      price,
      isBestSeller,
      title: formData.get('title') as string,
      updatedAt: new Date()
    }
  })
  */

  revalidatePath('/')
  revalidatePath('/admin')
}

/**
 * Create a new Package
 */
export async function createPackage(formData: FormData) {
  /*
  await prisma.package.create({
    data: {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      price: parseFloat(formData.get('price') as string),
      destinationId: formData.get('destinationId') as string,
      image: formData.get('image') as string,
      features: (formData.get('features') as string).split(','),
      isFeatured: true
    }
  })
  */
 
  revalidatePath('/')
}

/**
 * Create a Reservation
 */
export async function createReservation(data: any) {
  const total = data.price * data.pax
  const deposit = total * 0.4
  
  /*
  const reservation = await prisma.reservation.create({
    data: {
      packageId: data.packageId,
      name: data.name,
      email: data.email,
      whatsapp: data.phone,
      travelDate: new Date(data.date),
      people: data.pax,
      totalPrice: total,
      depositAmount: deposit,
      status: 'PENDING'
    }
  })
  
  // Return ID to redirect to Mercado Pago
  return reservation.id
  */
}
