import { useMemo } from 'react';
import { useDrive } from '../context/DriveContext.jsx';

export function useFilteredFiles(files) {
  const { activeFilters, sortBy, sortDir } = useDrive();

  return useMemo(() => {
    let result = [...files];
    if (activeFilters.length > 0) {
      result = result.filter((f) => activeFilters.includes(f.type));
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'size') cmp = a.size - b.size;
      else cmp = new Date(a[sortBy]) - new Date(b[sortBy]);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [files, activeFilters, sortBy, sortDir]);
}
