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
