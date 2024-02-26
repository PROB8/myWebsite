import { useState } from 'react';

export default function useModal(): [boolean, () => void] {
  const [isOpen, setIsOpen] = useState(false);
  const setModalOpen = () => {
    setIsOpen(!isOpen);
    const body = document.getElementById('body');
    if (!body) {
      return;
    }

    if (body.classList.contains('overflowHidden')) {
      body.classList.remove('overflowHidden');
    } else {
      body.classList.add('overflowHidden');
    }
  };
  return [isOpen, setModalOpen];
}
