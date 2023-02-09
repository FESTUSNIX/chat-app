import { useSignup } from '../../hooks/useSignup'

// Styles && Assets
import './GoogleButton.scss'
import googleLogo from '../../assets/btn_google_dark_normal_ios.svg'

const GoogleButton = () => {
	const { signInWithGoogle, isPending, error } = useSignup()

	const handleSubmitWithGoogle = () => {
		signInWithGoogle()
	}

	return (
		<>
			<button
				className='google-btn'
				onClick={() => {
					handleSubmitWithGoogle()
				}}>
				<img src={googleLogo} alt='google logo' />
				{!isPending && <span>Sign in with google</span>}
				{isPending && <span>Signing in with google</span>}
			</button>
			{error && <div className='error'>{error}</div>}
		</>
	)
}

export default GoogleButton
