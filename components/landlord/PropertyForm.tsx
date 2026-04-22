'use client'

import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Input, 
  Textarea, 
  Select, 
  SelectItem, 
  Button, 
  Card, 
  CardBody, 
  Checkbox, 
  Divider 
} from '@heroui/react'
import { 
  Plus, 
  Trash2, 
  Save, 
  Home, 
  MapPin, 
  List, 
  DollarSign, 
  Image as ImageIcon 
} from 'lucide-react'
import { PropertyCreateSchema } from '@/lib/validations/property'
import { useProperties } from '@/hooks/use-properties'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

type PropertyFormValues = z.infer<typeof PropertyCreateSchema>

interface PropertyFormProps {
  initialData?: any
  isEditing?: boolean
}

const propertyTypes = [
  { label: "Self Contain", value: "SELF_CONTAIN" },
  { label: "One Bedroom", value: "ONE_BEDROOM" },
  { label: "Two Bedroom", value: "TWO_BEDROOM" },
  { label: "Three Bedroom", value: "THREE_BEDROOM" },
  { label: "Duplex", value: "DUPLEX" },
  { label: "Bungalow", value: "BUNGALOW" },
  { label: "Mini Flat", value: "MINI_FLAT" },
  { label: "Penthouse", value: "PENTHOUSE" }
]

const districts = [
  { label: "Maitama", value: "MAITAMA" },
  { label: "Asokoro", value: "ASOKORO" },
  { label: "Wuse", value: "WUSE" },
  { label: "Wuse 2", value: "WUSE_2" },
  { label: "Gwarinpa", value: "GWARINPA" },
  { label: "Kubwa", value: "KUBWA" },
  { label: "Lugbe", value: "LUGBE" },
  { label: "Lokogoma", value: "LOKOGOMA" },
  { label: "Utako", value: "UTAKO" },
  { label: "Jahi", value: "JAHI" },
  { label: "Karmo", value: "KARMO" },
  { label: "Garki", value: "GARKI" },
  { label: "Apo", value: "APO" },
  { label: "Life Camp", value: "LIFE_CAMP" },
  { label: "Durumi", value: "DURUMI" },
  { label: "Gudu", value: "GUDU" },
  { label: "Kado", value: "KADO" },
  { label: "Katampe", value: "KATAMPE" },
  { label: "Mabushi", value: "MABUSHI" }
]

export default function PropertyForm({ initialData, isEditing = false }: PropertyFormProps) {
  const router = useRouter()
  const { createProperty, updateProperty, loading } = useProperties()
  
  const { 
    register, 
    handleSubmit, 
    control, 
    reset,
    formState: { errors } 
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(PropertyCreateSchema) as any,
    defaultValues: initialData || {
      isFurnished: false,
      isNewlyBuilt: false,
      serviceCharge: 0,
      cautionFee: 0,
      bedrooms: 1,
      bathrooms: 1,
      parkingSpaces: 1,
      amenities: [],
      images: [
        { url: '', publicId: 'initial-1', isCover: true, order: 0 },
        { url: '', publicId: 'initial-2', isCover: false, order: 1 },
        { url: '', publicId: 'initial-3', isCover: false, order: 2 }
      ]
    }
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
      setAmenities(initialData.amenities || [])
    }
  }, [initialData, reset])

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images"
  })

  const [inputAmenity, setInputAmenity] = useState('')
  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || [])

  const addAmenity = () => {
    if (inputAmenity.trim() && !amenities.includes(inputAmenity.trim())) {
      setAmenities([...amenities, inputAmenity.trim()])
      setInputAmenity('')
    }
  }

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      const finalData = { ...data, amenities }
      if (isEditing && initialData?.id) {
        await updateProperty(initialData.id, finalData)
      } else {
        await createProperty(finalData)
      }
      router.push('/landlord/dashboard')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Basic Info Section */}
      <Card className="rounded-[2.5rem] shadow-xl border-none">
        <CardBody className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Home className="text-emerald-400" size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{isEditing ? 'Update Property' : 'Basic Information'}</h3>
          </div>
          <Divider className="bg-slate-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Property Title"
              placeholder="e.g. Modern Duplex in Maitama"
              variant="flat"
              radius="lg"
              {...register('title')}
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
            />
            <Select
              label="Property Type"
              placeholder="Select property type"
              variant="flat"
              radius="lg"
              {...register('type')}
              isInvalid={!!errors.type}
              errorMessage={errors.type?.message}
            >
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
            <Textarea
              className="md:col-span-2"
              label="Description"
              placeholder="Describe your property in detail..."
              variant="flat"
              radius="lg"
              {...register('description')}
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
            />
          </div>
        </CardBody>
      </Card>

      {/* Location Section */}
      <Card className="rounded-[2.5rem] shadow-xl border-none">
        <CardBody className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <MapPin className="text-emerald-400" size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Location Details</h3>
          </div>
          <Divider className="bg-slate-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="District"
              placeholder="Select district"
              variant="flat"
              radius="lg"
              {...register('district')}
              isInvalid={!!errors.district}
              errorMessage={errors.district?.message}
            >
              {districts.map((district) => (
                <SelectItem key={district.value} value={district.value}>
                  {district.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Estate Name"
              placeholder="e.g. Sunrise Estate"
              variant="flat"
              radius="lg"
              {...register('estate')}
              isInvalid={!!errors.estate}
              errorMessage={errors.estate?.message}
            />
            <Input
              className="md:col-span-2"
              label="Street Name / Number"
              placeholder="e.g. 123 Crescent Road"
              variant="flat"
              radius="lg"
              {...register('street')}
              isInvalid={!!errors.street}
              errorMessage={errors.street?.message}
            />
          </div>
        </CardBody>
      </Card>

      {/* Pricing & Features Section */}
      <Card className="rounded-[2.5rem] shadow-xl border-none">
        <CardBody className="p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <DollarSign className="text-emerald-400" size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Pricing & Features</h3>
          </div>
          <Divider className="bg-slate-100" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Price (₦)"
              type="number"
              placeholder="Yearly rent"
              variant="flat"
              radius="lg"
              {...register('price', { valueAsNumber: true })}
              isInvalid={!!errors.price}
              errorMessage={errors.price?.message}
            />
            <Input
              label="Service Charge (₦)"
              type="number"
              placeholder="Annual fee"
              variant="flat"
              radius="lg"
              {...register('serviceCharge', { valueAsNumber: true })}
              isInvalid={!!errors.serviceCharge}
              errorMessage={errors.serviceCharge?.message}
            />
            <Input
              label="Caution Fee (₦)"
              type="number"
              placeholder="Refundable deposit"
              variant="flat"
              radius="lg"
              {...register('cautionFee', { valueAsNumber: true })}
              isInvalid={!!errors.cautionFee}
              errorMessage={errors.cautionFee?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Bedrooms"
              type="number"
              variant="flat"
              radius="lg"
              {...register('bedrooms', { valueAsNumber: true })}
              isInvalid={!!errors.bedrooms}
              errorMessage={errors.bedrooms?.message}
            />
            <Input
              label="Bathrooms"
              type="number"
              variant="flat"
              radius="lg"
              {...register('bathrooms', { valueAsNumber: true })}
              isInvalid={!!errors.bathrooms}
              errorMessage={errors.bathrooms?.message}
            />
            <Input
              label="Parking Spaces"
              type="number"
              variant="flat"
              radius="lg"
              {...register('parkingSpaces', { valueAsNumber: true })}
              isInvalid={!!errors.parkingSpaces}
              errorMessage={errors.parkingSpaces?.message}
            />
          </div>

          <div className="flex flex-wrap gap-8 px-2">
            <Checkbox {...register('isFurnished')} color="primary" classNames={{ label: "font-bold text-slate-700" }}>
              Fully Furnished
            </Checkbox>
            <Checkbox {...register('isNewlyBuilt')} color="primary" classNames={{ label: "font-bold text-slate-700" }}>
              Newly Built
            </Checkbox>
          </div>
        </CardBody>
      </Card>

      {/* Amenities Section */}
      <Card className="rounded-[2.5rem] shadow-xl border-none">
        <CardBody className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <List className="text-emerald-400" size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Amenities</h3>
          </div>
          <Divider className="bg-slate-100" />
          
          <div className="flex gap-4">
            <Input
              placeholder="Add amenity (e.g. WiFi, Pool, Gym)"
              value={inputAmenity}
              onChange={(e) => setInputAmenity(e.target.value)}
              variant="flat"
              radius="lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAmenity();
                }
              }}
            />
            <Button 
                onPress={addAmenity} 
                className="bg-slate-900 text-white font-black px-8 rounded-2xl h-14"
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {amenities.map((item, index) => (
              <div 
                  key={index} 
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
              >
                {item}
                <Trash2 
                    size={14} 
                    className="text-slate-400 cursor-pointer hover:text-red-500" 
                    onClick={() => removeAmenity(index)} 
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Media Section */}
      <Card className="rounded-[2.5rem] shadow-xl border-none">
        <CardBody className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <ImageIcon className="text-emerald-400" size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Property Media</h3>
          </div>
          <Divider className="bg-slate-100" />
          <p className="text-sm font-bold text-slate-500 italic">Minimum 3 images required (URLs for now)</p>
          
          <div className="space-y-4">
            {imageFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start">
                <Input
                  label={`Image URL ${index + 1}`}
                  placeholder="https://..."
                  variant="flat"
                  radius="lg"
                  {...register(`images.${index}.url`)}
                  isInvalid={!!errors.images?.[index]?.url}
                  errorMessage={errors.images?.[index]?.url?.message}
                />
                {imageFields.length > 3 && (
                  <Button 
                      isIconOnly 
                      color="danger" 
                      variant="light" 
                      onPress={() => removeImage(index)}
                      className="mt-6"
                  >
                    <Trash2 size={20} />
                  </Button>
                )}
              </div>
            ))}
            <Button 
                onPress={() => appendImage({ url: '', publicId: `new-${Date.now()}`, isCover: false, order: imageFields.length })} 
                variant="flat" 
                className="font-bold rounded-xl"
                startContent={<Plus size={18} />}
            >
              Add more images
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end pt-8">
        <Button 
            type="submit" 
            className="bg-slate-900 text-white font-black h-16 px-12 rounded-3xl text-lg shadow-2xl hover:scale-105 transition-transform"
            isLoading={loading}
            startContent={!loading && <Save size={20} />}
        >
          {loading ? (isEditing ? 'Updating...' : 'Listing Property...') : (isEditing ? 'Update Property' : 'Save and List Property')}
        </Button>
      </div>
    </form>
  )
}
