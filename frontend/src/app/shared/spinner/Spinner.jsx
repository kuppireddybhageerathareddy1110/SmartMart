import './Spinner.css'

export default function Spinner({ size = 'medium', color = '#4CAF50' }) {
  const spinnerStyle = {
    width: size === 'small' ? '20px' : size === 'large' ? '50px' : '30px',
    height: size === 'small' ? '20px' : size === 'large' ? '50px' : '30px',
    border: `3px solid ${color}20`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
  }

  return (
    <div className="spinner-container">
      <div className="spinner" style={spinnerStyle}></div>
    </div>
  )
}