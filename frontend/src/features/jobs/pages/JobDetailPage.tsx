import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageShell } from '@/shared/layout/PageShell'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { getApiErrorMessage } from '@/core/api/apiError'
import { useJobStatus } from '../hooks/useJobStatus'

function fmtDate(v: string | null | undefined): string {
    if (v == null || v.trim().length === 0) return '-'
    const d = new Date(v)
    if (Number.isNaN(d.getTime())) return '-'
    return d.toLocaleString()
}

export default function JobDetailPage() {
    const { id } = useParams()
    const jobId = useMemo(() => (id ?? '').trim(), [id])

    const q = useJobStatus(jobId, { enabled: jobId.length > 0 })
    const j = q.data

    console.log({ q, j });

    return (
        <PageShell title='Detalle del job'>
            <div className='grid gap-4'>
                <div className='flex items-center justify-between'>
                    <Link to='/import'>
                        <Button type='button' className='bg-slate-800 hover:bg-slate-700'>
                            Volver
                        </Button>
                    </Link>
                </div>

                <Card title='Estado'>
                    {q.isLoading && <p className='text-sm text-slate-300'>Cargando...</p>}

                    {q.isError && (
                        <p className='text-sm text-red-400'>
                            {getApiErrorMessage(q.error)}
                        </p>
                    )}

                    {j != null && (
                        <div className='grid gap-2 text-sm text-slate-200'>
                            <div><span className='text-slate-400'>Id:</span> {j.jobId}</div>
                            <div><span className='text-slate-400'>Status:</span> {j.status}</div>

                            <div className='pt-2 grid gap-1'>
                                <div><span className='text-slate-400'>Total:</span> {j.totalRows}</div>
                                <div><span className='text-slate-400'>Procesadas:</span> {j.processedRows}</div>
                                <div><span className='text-slate-400'>Insertadas:</span> {j.insertedRows}</div>
                                <div><span className='text-slate-400'>Fallidas:</span> {j.failedRows}</div>
                            </div>

                            <div className='pt-2 grid gap-1'>
                                <div><span className='text-slate-400'>Creado:</span> {fmtDate(j.createdAt)}</div>
                                <div><span className='text-slate-400'>Finalizado:</span> {fmtDate(j.finishedAt)}</div>
                            </div>

                            {j.error != null && j.error.trim().length > 0 && (
                                <div className='mt-2 rounded border border-red-500/30 bg-red-500/10 p-3 text-red-200'>
                                    {j.error}
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </PageShell>
    )
}