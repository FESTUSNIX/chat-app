import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

// Styles & Images
import './Navbar.scss'
import Temple from '../assets/temple.svg'

export default function Navbar() {
	const { user } = useAuthContext()

	return (
		<nav className='navbar'>
			<div className='container'>
				<Link to='/' className='logo'>
					<img src={Temple} alt='autismChat logo' />
					<span>The Better Messenger</span>
				</Link>

				{!user && (
					<>
						<Link to='/login'>Login</Link>
						<Link to='/signup'>Signup</Link>
					</>
				)}
			</div>
		</nav>
	)
}
