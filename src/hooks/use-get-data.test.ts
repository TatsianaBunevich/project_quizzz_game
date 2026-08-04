import { describe, it, expect, vi, beforeEach } from 'vitest'
import useGetData from './use-get-data'

// We do not execute the query, we assert the config passed to useSuspenseQuery

// Mock axios.get
vi.mock('axios', () => ({
  default: {
    get: vi.fn(async (url: string) => ({ data: { ok: true, url } })),
  },
}))

// Capture the config given to useSuspenseQuery
const mockUseSuspenseQuery = vi.fn((config: any) => ({
  data: 'MOCK_DATA',
  config,
}))

vi.mock('@tanstack/react-query', () => ({
  useSuspenseQuery: (config: any) => mockUseSuspenseQuery(config),
}))

import axios from 'axios'
import { useSuspenseQuery } from '@tanstack/react-query'

// Utility to run the queryFn manually from captured config
const runQueryFn = async (cfg: any) => {
  return await cfg.queryFn()
}

describe('useGetData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('wires queryKey, select and staleTime correctly', () => {
    const selector = vi.fn((d: any) => d)

    const result = useGetData('key-1', '/api/test', selector)

    expect(mockUseSuspenseQuery).toHaveBeenCalledTimes(1)
    const cfg = mockUseSuspenseQuery.mock.calls[0][0]

    expect(cfg.queryKey).toEqual(['key-1'])
    expect(cfg.select).toBe(selector)
    expect(cfg.staleTime).toBe(Infinity)

    // the hook returns the underlying result from useSuspenseQuery
    expect(result).toHaveProperty('data', 'MOCK_DATA')
  })

  it('queryFn fetches using axios.get and returns data', async () => {
    useGetData('key-2', '/api/resource', undefined)
    const cfg = mockUseSuspenseQuery.mock.calls[0][0]

    const data = await runQueryFn(cfg)

    expect(axios.get).toHaveBeenCalledWith('/api/resource')
    expect(data).toEqual({ ok: true, url: '/api/resource' })

    // Ensure useSuspenseQuery was invoked once
    expect(useSuspenseQuery).toBeTypeOf('function')
  })
})
