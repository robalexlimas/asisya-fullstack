import { http } from '@/api/http'
import type { ProductListItem, ProductPage } from '../domain/product.types'
import { mapProductListItem } from './products.mapper'
import type { ProductListItemDto, CreateProductRequestDto, CreateProductResponseDto } from './products.dto'

interface GetProductsParams {
  page: number
  pageSize: number
  search?: string
  categoryId?: string
}

export async function getProducts(params: GetProductsParams): Promise<ProductPage> {
  const res = await http.get('/product', { params })
  const data = res.data as { items: ProductListItemDto[], total: number }

  const items: ProductListItem[] = data.items.map(mapProductListItem)

  return { items, total: data.total }
}

export async function createProduct(payload: CreateProductRequestDto): Promise<CreateProductResponseDto> {
  const { data } = await http.post<CreateProductResponseDto>('/product/create', payload)
  return data
}
