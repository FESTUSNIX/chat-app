// Styles && Assets
import './Avatar.scss'
import appLogo from '../../assets/logo-default.png'

export default function Avatar({ src }) {
	return (
		<div className='avatar'>
			<img src={src ? src : appLogo} alt='' />
		</div>
	)
}
