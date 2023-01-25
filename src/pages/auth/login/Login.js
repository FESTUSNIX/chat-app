import { useState } from 'react'
import { useLogin } from '../../../hooks/useLogin'
import { Link } from 'react-router-dom'

// Components
import AuthTemplate from '../AuthTemplate'
import Field from '../../../components/Inputs/Field/Field'
import GoogleButton from '../../../components/GoogleButton/GoogleButton'
import GithubButton from '../../../components/GithubButton/GithubButton'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { login, isPending, error } = useLogin()

	const handleSubmit = () => {
		// Validation

		if (!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
			setFormErrors(existing => ({
				...existing,
				email: 'Enter a valid email',
			}))
			return
		}
		if (password.trim().length < 6) {
			setFormErrors(existing => ({
				...existing,
				password: 'Password must be at least 6 characters long',
			}))
			return
		}

		login(email, password)
	}

	const [formErrors, setFormErrors] = useState({
		username: '',
		email: '',
		password: '',
	})

	return (
		<AuthTemplate>
			<div className='auth__form-title'>
				<h2>Welcome back!</h2>

				<p className='auth__change-page'>
					Don't have an account? <Link to='/signup'>Sign up</Link>
				</p>
			</div>

			<Field
				type='email'
				value={email}
				setValue={setEmail}
				label='Email'
				error={formErrors.email}
				resetError={() =>
					setFormErrors(existing => ({
						...existing,
						email: '',
					}))
				}
				onLostFocus={() => {
					if (email !== '' && !email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
						setFormErrors(existing => ({
							...existing,
							email: 'Please enter a valid email address',
						}))
					}
				}}
				helpText='Eg. icecream@gmail.com'
			/>

			<Field
				type='password'
				value={password}
				setValue={setPassword}
				label='Password'
				error={formErrors.password}
				resetError={() =>
					setFormErrors(existing => ({
						...existing,
						password: '',
					}))
				}
				onLostFocus={() => {
					if (password !== '' && password.trim().length < 6) {
						setFormErrors(existing => ({
							...existing,
							password: 'Password must be at least 6 characters long',
						}))
					}
				}}
			/>

			<Link to={'/recover-password'} className='auth__form-reset-password'>
				Forgot password?
			</Link>

			{!isPending && (
				<button className='btn' onClick={() => handleSubmit()}>
					Login
				</button>
			)}
			{isPending && (
				<button className='btn' disabled>
					Loading
				</button>
			)}

			<div className='separator mt2 mb2'>
				<span>or</span>
			</div>

			<GoogleButton />
			<GithubButton />

			{error && <div className='error'>{error}</div>}
		</AuthTemplate>
	)
}
