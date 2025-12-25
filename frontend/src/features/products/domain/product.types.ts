export type ProductId = string

export interface ProductListItem {
  id: ProductId
  name: string
  sku: string
  price: number
  categoryName: string
}

export interface ProductPage {
  items: ProductListItem[]
  total: number
}

export type ProductCreate = {
  name: string
  sku: string
  price: number
  categoryId: string
}

export type ProductCreated = {
  id: string
}

export type ProductListResponse = {
  page: number
  pageSize: number
  total: number
  items: ProductListItem[]
}

export type ProductDetail = {
  id: string
  name: string
  sku: string
  price: number
  categoryId: string
  categoryName: string
  categoryPhotoUrl?: string | null
}

export type CreateProductPayload = {
  name: string
  sku: string
  price: number
  categoryId: string
}

export type UpdateProductPayload = {
  name: string
  price: number
  categoryId: string
}
