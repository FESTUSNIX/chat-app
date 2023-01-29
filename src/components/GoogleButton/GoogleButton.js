import { useLogin } from '../../hooks/useLogin'

// Styles && Assets
import './GoogleButton.scss'
import googleLogo from '../../assets/btn_google_dark_normal_ios.svg'

const GoogleButton = () => {
	const { loginWithGoogle, isPending, error } = useLogin()

	const handleSubmitWithGoogle = () => {
		loginWithGoogle()
	}

	return (
		<>
			<button className='google-btn' onClick={() => handleSubmitWithGoogle()}>
				<img src={googleLogo} alt='google logo' />
				{!isPending && <span>Sign in with google</span>}
				{isPending && <span>Signing in with google</span>}
			</button>
			{error && <div className='error'>{error}</div>}
		</>
	)
}

export default GoogleButton
