import { http } from '@/core/api/http'
import type {
    ProductDetail,
    ProductListResponse,
    CreateProductPayload,
    UpdateProductPayload
} from '../domain/product.types'

export const productApi = {
    // listado paginado
    getPaged: async (params: {
        page: number
        pageSize: number
        search?: string
        categoryId?: string
    }): Promise<ProductListResponse> => {
        const { data } = await http.get('/product', { params })
        return data
    },

    // detalle
    getById: async (id: string): Promise<ProductDetail> => {
        const { data } = await http.get(`/product/${id}`)
        return data
    },

    // crear uno a uno
    create: async (payload: CreateProductPayload): Promise<{ id: string }> => {
        const { data } = await http.post('/product/create', payload)
        return data
    },

    // actualizar
    update: async (
        id: string,
        payload: UpdateProductPayload
    ): Promise<void> => {
        await http.put(`/product/${id}`, payload)
    },

    // eliminar
    delete: async (id: string): Promise<void> => {
        await http.delete(`/product/${id}`)
    }
}
