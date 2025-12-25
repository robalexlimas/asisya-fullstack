import type { JobStatusResponse } from '../api/jobs.dto'

function fmt(v: string | null | undefined): string {
    if (v == null || v.trim().length === 0) return '-'
    try {
        return new Date(v).toLocaleString()
    } catch {
        return v
    }
}

type Props = {
    job: JobStatusResponse
}

export function JobDetailPanel({ job }: Props) {
    return (
        <div className='grid gap-3 text-sm text-slate-200'>
            <div className='grid gap-1'>
                <div><span className='text-slate-400'>Id:</span> <span className='font-mono break-all'>{job.jobId}</span></div>
                <div><span className='text-slate-400'>Status:</span> {job.status}</div>
                <div><span className='text-slate-400'>Creado:</span> {fmt(job.createdAt)}</div>
                <div><span className='text-slate-400'>Iniciado:</span> {fmt(job.startedAt)}</div>
                <div><span className='text-slate-400'>Finalizado:</span> {fmt(job.finishedAt)}</div>
            </div>

            <div className='grid grid-cols-2 gap-2'>
                <div className='rounded border border-slate-800 p-3'>
                    <div className='text-slate-400'>Total</div>
                    <div className='text-lg font-semibold'>{job.totalRows}</div>
                </div>
                <div className='rounded border border-slate-800 p-3'>
                    <div className='text-slate-400'>Procesadas</div>
                    <div className='text-lg font-semibold'>{job.processedRows}</div>
                </div>
                <div className='rounded border border-slate-800 p-3'>
                    <div className='text-slate-400'>Insertadas</div>
                    <div className='text-lg font-semibold'>{job.insertedRows}</div>
                </div>
                <div className='rounded border border-slate-800 p-3'>
                    <div className='text-slate-400'>Fallidas</div>
                    <div className='text-lg font-semibold'>{job.failedRows}</div>
                </div>
            </div>

            {job.error != null && job.error.trim().length > 0 && (
                <div className='rounded border border-red-500/30 bg-red-500/10 p-3 text-red-200 whitespace-pre-wrap'>
                    {job.error}
                </div>
            )}
        </div>
    )
}
