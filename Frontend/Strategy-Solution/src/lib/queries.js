import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './api'

/**
 * --- Public / Shared Queries ---
 */

export function useServicesQuery() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { ok, data } = await apiFetch('/api/get_services')
      if (!ok) throw new Error(data?.message || 'Failed to fetch services')
      return Array.isArray(data) ? data : data?.services || []
    },
  })
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { ok, data } = await apiFetch('/api/get_categories')
      if (!ok) throw new Error(data?.message || 'Failed to fetch categories')
      return Array.isArray(data) ? data : data?.categories || []
    },
  })
}

/**
 * --- Customer Queries ---
 */

export function useUserOrdersQuery() {
  return useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const { ok, data } = await apiFetch('/api/get_user_orders')
      if (!ok) throw new Error(data?.message || 'Failed to fetch your orders')
      return Array.isArray(data) ? data : data?.orders || []
    },
  })
}

/**
 * --- Admin Queries ---
 */

export function useAllOrdersQuery() {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { ok, data } = await apiFetch('/api/get_all_orders')
      if (!ok) throw new Error(data?.message || 'Failed to fetch all orders')
      return Array.isArray(data) ? data : data?.orders || []
    },
  })
}

export function useAllCustomersQuery() {
  return useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const { ok, data } = await apiFetch('/api/get_all_users')
      if (!ok) throw new Error(data?.message || 'Failed to fetch customers')
      return Array.isArray(data) ? data : data?.users || []
    },
  })
}

export function useAdminsQuery() {
  return useQuery({
    queryKey: ['admin-admins'],
    queryFn: async () => {
      const { ok, data } = await apiFetch('/api/get_admins')
      if (!ok) throw new Error(data?.message || 'Failed to fetch admins')
      return Array.isArray(data) ? data : data?.admins || []
    },
  })
}
