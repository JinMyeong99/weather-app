import { useState, useRef, useEffect } from 'react';

/**
 * 인라인 별칭 편집 로직을 캡슐화하는 훅.
 *
 * isEditing, alias 상태와 키보드 핸들러를 한 곳에서 관리한다.
 * 편집 모드 진입 시 input을 자동으로 select()한다.
 */
export function useAliasEditor(initialAlias: string, onConfirm: (alias: string) => void) {
  const [isEditing, setIsEditing] = useState(false);
  const [alias, setAlias] = useState(initialAlias);
  const inputRef = useRef<HTMLInputElement>(null);

  // 편집 모드가 켜지면 렌더 완료 후 input 텍스트 전체 선택
  useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

  const startEditing = () => setIsEditing(true);

  const confirmAlias = () => {
    const trimmed = alias.trim();
    if (trimmed) {
      onConfirm(trimmed);
    } else {
      setAlias(initialAlias);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') confirmAlias();
    if (e.key === 'Escape') {
      setAlias(initialAlias);
      setIsEditing(false);
    }
  };

  return { isEditing, alias, setAlias, inputRef, startEditing, confirmAlias, handleKeyDown };
}
