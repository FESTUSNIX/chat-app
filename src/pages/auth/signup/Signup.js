import { useState } from 'react'
import { useSignup } from '../../../hooks/useSignup'
import { Link } from 'react-router-dom'

// Components
import AuthTemplate from '../AuthTemplate'
import { Field, GoogleButton, GithubButton } from '../../../components'

export default function Signup() {
	const { signup, isPending, error } = useSignup()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [displayName, setDisplayName] = useState('')

	const [formErrors, setFormErrors] = useState({
		displayName: '',
		email: '',
		password: ''
	})

	const handleSubmit = () => {
		if (!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
			return setFormErrors(existing => ({
				...existing,
				email: 'Enter a valid email'
			}))
		}
		if (password.trim().length < 6) {
			return setFormErrors(existing => ({
				...existing,
				password: 'Password must be at least 6 characters long'
			}))
		}
		if (displayName.trim().length < 3) {
			return setFormErrors(existing => ({
				...existing,
				displayName: 'Username must be at least 3 characters long'
			}))
		}

		signup(email, password, displayName, '')
	}

	return (
		<AuthTemplate>
			<div className='auth__form-title'>
				<h2>
					Create an account<span style={{ color: 'var(--text-accent)' }}>.</span>
				</h2>

				<p className='auth__change-page'>
					Already a member? <Link to='/login'>Log in</Link>
				</p>

				<div className='mb05 mt2'>
					<p style={{ fontSize: '1.6rem' }}>Example user:</p>
					<p style={{ fontSize: '1.5rem' }}>Email: test@dev.pl</p>
					<p style={{ fontSize: '1.5rem' }}>Pass: password</p>
				</div>
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
						email: ''
					}))
				}
				onLostFocus={() => {
					if (email !== '' && !email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
						setFormErrors(existing => ({
							...existing,
							email: 'Please enter a valid email address'
						}))
					}
				}}
				helpText='Eg. icecream@gmail.com'
			/>

			<Field
				type='text'
				value={displayName}
				setValue={setDisplayName}
				label='Username'
				error={formErrors.displayName}
				resetError={() =>
					setFormErrors(existing => ({
						...existing,
						displayName: ''
					}))
				}
				onLostFocus={() => {
					if (displayName !== '' && displayName.trim().length < 3) {
						setFormErrors(existing => ({
							...existing,
							displayName: 'Username must be at least 3 characters long'
						}))
					}
				}}
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
						password: ''
					}))
				}
				onLostFocus={() => {
					if (password !== '' && password.trim().length < 6) {
						setFormErrors(existing => ({
							...existing,
							password: 'Password must be at least 6 characters long'
						}))
					}
				}}
			/>

			{!isPending && (
				<button className='btn' onClick={() => handleSubmit()}>
					Create account
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
