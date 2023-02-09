import { PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectAuth, projectGitHub, projectGoogle } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
	const navigate = useNavigate()

	const { dispatch } = useAuthContext()

	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)
	const [isFinished, setIsFinished] = useState(false)

	const login = async (email, password) => {
		setError(null)
		setIsPending(true)

		try {
			// Login
			const res = await projectAuth.signInWithEmailAndPassword(email, password)

			// Dispatch login action
			dispatch({ type: 'LOGIN', payload: res.user })

			// Update state
			if (!isCancelled) {
				setIsPending(false)
				setError(null)
			}
		} catch (err) {
			if (!isCancelled) {
				setError(err.message)
				setIsPending(false)
			}
		}
	}

	const loginWithGoogle = async () => {
		setError(null)
		setIsPending(true)

		try {
			// Login
			const res = await projectAuth.signInWithPopup(projectGoogle)

			// Dispatch login action
			dispatch({ type: 'LOGIN', payload: res.user })

			// Update state
			if (!isCancelled) {
				setIsPending(false)
				setError(null)
			}
		} catch (err) {
			if (!isCancelled) {
				setError(err.message)
				setIsPending(false)
			}
		}
	}

	const loginWithGithub = async () => {
		setError(null)
		setIsPending(true)

		try {
			// Login
			const res = await projectAuth.signInWithPopup(projectGitHub)

			// Dispatch login action
			dispatch({ type: 'LOGIN', payload: res.user })

			// Update state
			if (!isCancelled) {
				setIsPending(false)
				setError(null)
			}
		} catch (err) {
			if (!isCancelled) {
				setError(err.message)
				setIsPending(false)
			}
		}
	}

	const sendPasswordReset = async email => {
		setError(null)
		setIsPending(true)
		setIsFinished(false)

		try {
			await projectAuth.sendPasswordResetEmail(email)
			if (!isCancelled) {
				setIsPending(false)
				setError(null)
				setIsFinished(true)

				setTimeout(() => {
					navigate('/login')
				}, 15000)
			}
		} catch (err) {
			if (!isCancelled) {
				setError(err.message)
				setIsPending(false)
				setIsFinished(false)
			}
		}
	}

	const resetPassword = async (code, newPassword) => {
		setError(null)
		setIsPending(true)
		setIsFinished(false)

		try {
			await projectAuth.confirmPasswordReset(code, newPassword)

			if (!isCancelled) {
				setIsPending(false)
				setError(null)
				setIsFinished(true)

				setTimeout(() => {
					navigate('/login')
				}, 1000)
			}
		} catch (err) {
			if (!isCancelled) {
				setError(err.message)
				setIsPending(false)
				setIsFinished(false)
			}
		}
	}

	const setUpRecaptcha = async number => {
		// user.unlink(provider.providerId)

		const provider = new PhoneAuthProvider(projectAuth)
		const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, projectAuth)

		recaptchaVerifier.render()

		const verificationId = await provider.verifyPhoneNumber(number, recaptchaVerifier)

		return verificationId

		// const credential = PhoneAuthProvider.credential(verificationId, OTPCode)
		// return signInWithPhoneNumber(projectAuth, number, recaptchaVerifier)
	}

	useEffect(() => {
		return () => setIsCancelled(true)
	}, [])

	return {
		login,
		loginWithGoogle,
		loginWithGithub,
		sendPasswordReset,
		resetPassword,
		setUpRecaptcha,
		isPending,
		error,
		isFinished
	}
}
