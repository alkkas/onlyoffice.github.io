import LoadSvg from 'static/img/load.svg'
import './Load.styles.scss'

interface loadProps {
  width?: string
  height?: string
}

export default function Load({ width, height }: loadProps) {
  return (
    <div
      style={{
        width: width || '25px',
        height: height || width || '25px',
      }}
      className="loader"
    >
      <LoadSvg />
    </div>
  )
}
