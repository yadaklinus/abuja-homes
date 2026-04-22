'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface PropertyData {
  title?: string
  description?: string
  type?: string
  district?: string
  estate?: string
  street?: string
  price?: number
  serviceCharge?: number
  cautionFee?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpaces?: number
  isFurnished?: boolean
  isNewlyBuilt?: boolean
  availableFrom?: Date | string
  amenities?: string[]
  images?: {
    url: string
    publicId: string
    isCover: boolean
    order: number
  }[]
}

export function useProperties() {
  const [loading, setLoading] = useState(false)

  const createProperty = async (data: PropertyData) => {
    setLoading(true)
    try {
      const response = await axios.post('/api/properties', data)
      toast.success('Property listed successfully!')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to list property'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getProperty = async (id: string) => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/properties/${id}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch property'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProperty = async (id: string, data: PropertyData) => {
    setLoading(true)
    try {
      const response = await axios.patch(`/api/properties/${id}`, data)
      toast.success('Property updated successfully!')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update property'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteProperty = async (id: string) => {
    setLoading(true)
    try {
      const response = await axios.delete(`/api/properties/${id}`)
      toast.success('Property deleted successfully!')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete property'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    createProperty,
    getProperty,
    updateProperty,
    deleteProperty
  }
}
