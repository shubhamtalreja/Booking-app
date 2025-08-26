import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div className="spinner"></div>
    </div>
  )

}
export default LoadingSpinner;