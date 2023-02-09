import { useSignup } from '../../hooks/useSignup'

// Styles && Assets
import './GithubButton.scss'
import githubLogo from '../../assets/GitHub-Mark-Light-32px.png'

const GithubButton = () => {
	const { signInWithGithub, isPending, error } = useSignup()

	const handleSubmitWithGithub = () => {
		signInWithGithub()
	}

	return (
		<>
			<button className='github-btn' onClick={() => handleSubmitWithGithub()}>
				<img src={githubLogo} alt='github logo' />
				{!isPending && <span>Sign in with GitHub</span>}
				{isPending && <span>Signing in with GitHub</span>}
			</button>
			{error && <div className='error'>{error}</div>}
		</>
	)
}

export default GithubButton
