import type { JobStatusResponse } from '../api/jobs.dto'
import { Button } from '@/shared/ui/Button'

type Props = {
    items: JobStatusResponse[]
    onSelectJob: (id: string) => void
}

const badge = (status: string): string => {
    switch (status) {
        case 'Completed': return 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30'
        case 'Failed': return 'bg-red-500/15 text-red-200 border-red-500/30'
        case 'Processing': return 'bg-blue-500/15 text-blue-200 border-blue-500/30'
        default: return 'bg-slate-500/15 text-slate-200 border-slate-500/30'
    }
}

export function JobsHistoryTable({ items, onSelectJob }: Props) {
    return (
        <div className='overflow-auto rounded-lg border border-slate-800'>
            <table className='w-full text-sm'>
                <thead className='bg-slate-900/60 text-slate-300'>
                    <tr>
                        <th className='text-left p-3'>Job</th>
                        <th className='text-left p-3'>Estado</th>
                        <th className='text-right p-3'>Procesadas</th>
                        <th className='text-right p-3'>Insertadas</th>
                        <th className='text-right p-3'>Fallidas</th>
                        <th className='text-right p-3'>Total</th>
                        <th className='text-right p-3'>Acción</th>
                    </tr>
                </thead>

                <tbody className='divide-y divide-slate-800'>
                    {items.map((j) => (
                        <tr key={j.jobId} className='hover:bg-slate-900/40'>
                            <td className='p-3'>
                                <div className='font-mono text-slate-100'>{j.jobId.slice(0, 8)}…</div>
                                <div className='text-xs text-slate-400 mt-1'>{new Date(j.finishedAt || "").toLocaleString()}</div>
                            </td>

                            <td className='p-3'>
                                <span className={`inline-flex items-center px-2 py-1 rounded border ${badge(j.status)}`}>
                                    {j.status}
                                </span>
                            </td>

                            <td className='p-3 text-right text-slate-200'>{j.processedRows}</td>
                            <td className='p-3 text-right text-slate-200'>{j.insertedRows}</td>
                            <td className='p-3 text-right text-slate-200'>{j.failedRows}</td>
                            <td className='p-3 text-right text-slate-200'>{j.totalRows}</td>

                            <td className='p-3 text-right'>
                                <Button
                                    type='button'
                                    className='px-3 py-1.5'
                                    onClick={() => { onSelectJob(j.jobId) }}
                                >
                                    Ver
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
