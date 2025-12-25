import type { ProductListItem, ProductPage } from '../domain/product.types'
import type { ProductListItemDto, ProductsPagedResponseDto } from './products.dto'

export function mapProductListItem (
  dto: ProductListItemDto
): ProductListItem {
  return {
    id: dto.id,
    name: dto.name,
    sku: dto.sku,
    price: dto.price,
    categoryName: dto.categoryName
  }
}

export function mapProductsPage (
  dto: ProductsPagedResponseDto
): ProductPage {
  return {
    items: dto.items.map(mapProductListItem),
    total: dto.total
  }
}
