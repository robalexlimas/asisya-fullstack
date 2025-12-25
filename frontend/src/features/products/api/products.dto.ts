export interface ProductListItemDto {
  id: string
  name: string
  sku: string
  price: number
  categoryName: string
}

export interface ProductsPagedResponseDto {
  items: ProductListItemDto[]
  total: number
}
