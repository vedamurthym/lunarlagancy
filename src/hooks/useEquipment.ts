import { useState, useEffect } from 'react';
import type { EquipmentRecord } from '@/types';
import { getEquipmentById, getEquipmentList } from '@/services/equipmentService';

export function useEquipment(id?: string) {
  const [data, setData] = useState<EquipmentRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(id));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);

    getEquipmentById(id).then(({ data: eq, error: err }) => {
      if (isMounted) {
        setData(eq);
        setError(err);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { equipment: data, loading, error };
}

export function useEquipmentList() {
  const [equipmentList, setEquipmentList] = useState<EquipmentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getEquipmentList().then(({ data: list, error: err }) => {
      if (isMounted) {
        setEquipmentList(list || []);
        setError(err);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { equipmentList, loading, error };
}
