import { CustomError } from "../utils/customError"
import { db } from "./db/index"

type TItem = {
  productId: number
  price: number
  quantity: number
}

type TOrderProps = {
  updatedData: TItem[]
  userId: number
  totalPrice: number
}

type cancelOrderProps = {
  id: number
  userId: number
}

type orderStatus = "placed" | "cancelled" | "shipped" | "delivered"

export const getOrderByUser = async (userId: number) => {
  const orders = db.order.findMany({
    where: {
      userId,
      isDeleted: false,
    },
  })
  if (!orders) {
    throw new CustomError("Cant get Orders", 403)
  }
  return orders
}

export const stockUpdate = async (items: TItem[]) => {
  items.forEach(async item => {
    const updatedProduct = await db.product.updateMany({
      where: {
        id: item.productId,
      },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    })
  })
}

export const placeOrder = async ({ userId, updatedData, totalPrice }: TOrderProps) => {
  // Create a new order in the database
  const newOrder = await db.order.create({
    data: {
      userId,
      orderStatus: "placed",
      totalPrice,
      items: {
        createMany: {
          data: updatedData,
        },
      },
    },
    include: {
      items: true,
    },
  })
  await stockUpdate(updatedData)
  // Throw an error if the order creation fails
  if (!newOrder) {
    throw new CustomError("Error creating new order", 403)
  }

  // Return the newly created order
  return newOrder
}

export const updateData = async (items: TItem[]) => {
  try {
    let totalPrice = 0

    // Map over each item and update its price
    const updatedData = await Promise.all(
      items.map(async item => {
        const updatedPrice = await db.product.findUnique({
          where: { id: item.productId },
          select: { price: true },
        })

        const priceByQuantity = Number(updatedPrice?.price) * item.quantity
        totalPrice += priceByQuantity

        return {
          ...item,
          price: priceByQuantity,
        }
      }),
    )

    // Return the updated data and total order price
    return {
      updatedData,
      totalPrice,
    }
  } catch (e) {
    // Propagate any errors that occur during the update process
    throw e
  }
}

export const cancelOrder = async ({ id, userId }: cancelOrderProps) => {
  // Check if the order exists
  const existingOrder = await db.order.findUnique({
    where: { id, userId },
  })

  if (!existingOrder) {
    throw new CustomError("Order doesn't exist", 404)
  }

  if (existingOrder.orderStatus === "shipped") {
    throw new CustomError("Order cant be cancelled, shipped", 401)
  }

  // Update the order status to 'cancelled'
  const order = await db.order.update({
    where: { id, userId },
    data: {
      orderStatus: "cancelled",
    },
  })

  // Throw an error if the order cancellation fails
  if (!order) {
    throw new Error("Error cancelling order")
  }

  // Return the cancelled order
  return order
}

export const changeOrderStatus = async (id: number, status: orderStatus) => {
  // Update the order status based on the provided order ID and new status
  const order = await db.order.update({
    where: { id },
    data: {
      orderStatus: status,
    },
  })

  // Throw an error if the order update fails
  if (!order) {
    throw new Error("Can't update order")
  }
  return order
}
