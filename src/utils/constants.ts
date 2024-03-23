export const mandatoryFields = {
  productCreate: [
    'name',
    'description',
    'sellerId',
    'price',
    'imageUrl',
    'category',
  ],
  productById: ['id'],
}

export const constants = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
}
