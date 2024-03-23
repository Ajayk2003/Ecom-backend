import { Request } from 'express'
import { mandatoryFields } from '../utils/constants'

export const checkMandatoryFields = (
  request: Request,
  bodyType: string,
): {
  isValid: boolean
  missingFields?: string[]
} => {
  const missingFields = mandatoryFields[
    bodyType as keyof typeof mandatoryFields
  ].filter((field) => !(field in request))

  if (missingFields.length == 0) {
    return {
      isValid: true,
    }
  } else {
    return {
      isValid: false,
      missingFields,
    }
  }
}
