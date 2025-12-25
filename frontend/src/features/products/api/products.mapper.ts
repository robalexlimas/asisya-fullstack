import type { ProductListItem, ProductPage, ProductCreate, ProductCreated } from '../domain/product.types'
import type { ProductListItemDto, ProductsPagedResponseDto, CreateProductRequestDto, CreateProductResponseDto } from './products.dto'

export function mapProductListItem(
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

export function mapProductsPage(
  dto: ProductsPagedResponseDto
): ProductPage {
  return {
    items: dto.items.map(mapProductListItem),
    total: dto.total
  }
}

export function toCreateProductRequestDto(p: ProductCreate): CreateProductRequestDto {
  return {
    name: p.name.trim(),
    sku: p.sku.trim(),
    price: p.price,
    categoryId: p.categoryId
  }
}

export function toProductCreated(dto: CreateProductResponseDto): ProductCreated {
  return { id: dto.id }
}
