import { useMemo, useState } from 'react'
import { PageShell } from '@/shared/layout/PageShell'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Pagination } from '@/shared/ui/Pagination'
import { Modal } from '@/shared/ui/Modal'
import { useCreateImportJob } from '../hooks/useCreateImportJob'
import { useJobsHistory } from '../hooks/useJobsHistory'
import { useJobStatus } from '../hooks/useJobStatus'
import { JobsHistoryTable } from '../ui/JobsHistoryTable'
import { JobDetailPanel } from '../ui/JobDetailPanel'
import { getApiErrorMessage } from '@/core/api/apiError'
import { JobStatusResponse } from '../api/jobs.dto'

export function ImportPage() {
  const [file, setFile] = useState<File | null>(null)

  // job seleccionado para ver detalle
  const [jobId, setJobId] = useState<string | null>(null)

  // histórico
  const [historyPage, setHistoryPage] = useState(1)
  const historyPageSize = 10

  const historyQ = useJobsHistory({ page: historyPage, pageSize: historyPageSize })
  const historyItems = historyQ.data?.data?.items ?? []
  const historyTotal = historyQ.data?.data?.total ?? 0

  const create = useCreateImportJob()
  const canUpload = useMemo(() => file != null && !create.isPending, [file, create.isPending])

  // detalle del job (modal)
  const detailQ = useJobStatus(jobId)

  // ✅ tu hook devuelve AxiosResponse, así que el payload real está en .data
  const jobDetail = detailQ.data?.data ?? null

  return (
    <PageShell title='Importar productos (CSV)'>
      <div className='grid gap-6'>
        <Card title='Subir archivo'>
          <div className='grid gap-3'>
            <Input
              type='file'
              accept='.csv,text/csv'
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null
                setFile(f)
              }}
            />

            <div className='flex items-center gap-2'>
              <Button
                disabled={!canUpload}
                onClick={() => {
                  if (file == null) return

                  create.mutate(file, {
                    onSuccess: (r) => {
                      setJobId(r.jobId) // abre el detalle si quieres
                      setHistoryPage(1)
                      void historyQ.refetch()
                    }
                  })
                }}
              >
                {create.isPending ? 'Creando job...' : 'Crear job'}
              </Button>

              {jobId != null && (
                <button
                  type='button'
                  className='text-sm underline text-slate-300 hover:text-white'
                  onClick={() => { setJobId(null) }}
                >
                  Cerrar detalle
                </button>
              )}
            </div>

            {create.isError && (
              <p className='text-sm text-red-400'>{getApiErrorMessage(create.error)}</p>
            )}

            {jobId != null && (
              <p className='text-sm text-slate-300'>
                JobId: <span className='font-mono break-all'>{jobId}</span>
              </p>
            )}
          </div>
        </Card>

        <Card title='Histórico de importaciones'>
          <div className='grid gap-3'>
            {historyQ.isLoading && <p className='text-sm text-slate-300'>Cargando histórico...</p>}
            {historyQ.isError && <p className='text-sm text-red-400'>{getApiErrorMessage(historyQ.error)}</p>}

            {!historyQ.isLoading && historyItems.length === 0 && (
              <p className='text-sm text-slate-300'>No hay jobs todavía.</p>
            )}

            {historyItems.length > 0 && (
              <JobsHistoryTable
                items={historyItems}
                onSelectJob={(id) => { setJobId(id) }}
              />
            )}

            <Pagination
              page={historyPage}
              pageSize={historyPageSize}
              total={historyTotal}
              onPageChange={setHistoryPage}
            />
          </div>
        </Card>
      </div>

      <Modal
        open={jobId != null}
        title='Detalle del job'
        onClose={() => { setJobId(null) }}
      >
        {jobId != null && detailQ.isLoading && (
          <p className='text-sm text-slate-300'>Cargando detalle...</p>
        )}

        {jobId != null && detailQ.isError && (
          <p className='text-sm text-red-400'>{getApiErrorMessage(detailQ.error)}</p>
        )}

        {jobDetail != null && <JobDetailPanel job={jobDetail as unknown as JobStatusResponse} />}
      </Modal>
    </PageShell>
  )
}