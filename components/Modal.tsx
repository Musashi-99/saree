'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
export default function Modal({open,onClose,title,children,className=''}:{open:boolean;onClose:()=>void;title:string;children:React.ReactNode;className?:string}) {
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  const dialog=ref.current;
  if(!dialog || !open)return;
  const previous=document.activeElement as HTMLElement|null;
  dialog.showModal();
  const old=document.body.style.overflow;document.body.style.overflow='hidden';
  return ()=>{dialog.close();document.body.style.overflow=old;previous?.focus();};
 },[open]);
 return <dialog ref={ref} className={`modal ${className}`} aria-label={title} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
  <div className="modal-shell"><button className="modal-close" aria-label={`Close ${title}`} onClick={onClose}><X size={21}/></button>{children}</div>
 </dialog>;
}
