import { BookingModel } from "@/app/models/booking.model"
import { FacilityModel } from '../models/facility.model'

function sumPrice(differenceInHours: number, hourlyPrice: number, dailyPrice: number): number {
  // TODO: Verify this calculation
  if (differenceInHours >= dailyPrice/hourlyPrice) {
    if (differenceInHours > 24) {
      return dailyPrice + sumPrice(differenceInHours - 24, hourlyPrice, dailyPrice)
    } else {
      return dailyPrice
    }
  } else {
    return differenceInHours * hourlyPrice
  }
}

export const calculatePriceRaw = (
  startedAt: Date,
  stoppedAt = new Date(),
  hourlyPrice: number,
  dailyPrice: number,
): number => {
  if (startedAt) {
    const differenceInHours = Math.trunc(
      Math.abs(startedAt.getTime() - stoppedAt.getTime()) / 3600000 + 1,
    )
    return sumPrice(differenceInHours, hourlyPrice, dailyPrice)
  }
  return 0
}

export const calculatePriceRawByBooking = (booking: BookingModel, facility: FacilityModel) => {
  if (booking) {
    return calculatePriceRaw(
      booking.startedAt as Date,
      booking.stoppedAt as Date,
      facility.pricing.hourly,
      facility.pricing.daily,
    )
  }
  return 0
}

export const calculatePrice = (
  startedAt: Date,
  stoppedAt = new Date(),
  hourlyPrice: number,
  dailyPrice: number,
): string => {
  if (startedAt) {
    return `CHF ${calculatePriceRaw(startedAt, stoppedAt, hourlyPrice, dailyPrice)}.-`
  }
  return "-"
}
