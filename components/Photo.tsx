import assets from './assets.json';
type Props = { name: string; alt: string; className?: string; priority?: boolean; sizes?: string; parallax?: boolean };
export default function Photo({name, alt, className='', priority=false, parallax=false, sizes='(max-width: 700px) 100vw, 50vw'}: Props) {
  const info=assets[name as keyof typeof assets];
  return <img className={className} data-parallax={parallax?'':undefined} src={`/assets/${name}-1600.webp`} srcSet={info.variants.map(v=>`${v.src} ${v.width}w`).join(', ')} sizes={sizes} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" width={info.width} height={info.height} />;
}
