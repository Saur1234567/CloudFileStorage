import {
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  FileArchive,
  FileType2,
  File as FileGeneric
} from 'lucide-react';

export const FILE_TYPE_META = {
  pdf: { icon: FileText, color: '#fa7c9c', label: 'PDF' },
  image: { icon: ImageIcon, color: '#43d9c8', label: 'Image' },
  video: { icon: Video, color: '#8b7cfa', label: 'Video' },
  audio: { icon: Music, color: '#ffb86b', label: 'Audio' },
  document: { icon: FileType2, color: '#5b9dfa', label: 'Document' },
  zip: { icon: FileArchive, color: '#9aa0ac', label: 'Archive' },
  text: { icon: FileText, color: '#9aa0ac', label: 'Text' }
};

export function getFileMeta(type) {
  return FILE_TYPE_META[type] || { icon: FileGeneric, color: '#9aa0ac', label: 'File' };
}

export const FOLDER_COLOR_HEX = {
  violet: '#8b7cfa',
  teal: '#43d9c8',
  amber: '#ffb86b',
  rose: '#fa7c9c',
  sky: '#5b9dfa'
};
