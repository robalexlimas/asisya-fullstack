import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'

type Props = {
    open: boolean
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    confirmVariant?: 'primary' | 'secondary' | 'danger'
    isLoading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmDialog({
    open,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmVariant = 'primary',
    isLoading = false,
    onConfirm,
    onCancel
}: Props) {
    return (
        <Modal
            open={open}
            title={title}
            description={description}
            onClose={onCancel}
            footer={
                <>
                    <Button
                        type='button'
                        variant='secondary'
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        type='button'
                        variant={confirmVariant}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Procesando...' : confirmText}
                    </Button>
                </>
            }
        />
    )
}
