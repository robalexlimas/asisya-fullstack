export type Category = {
    id: string
    name: string
    photoUrl: string | null
    createdAt: string
}

export type CategoryCreate = {
    name: string
    photoUrl?: string | null
}