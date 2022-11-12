import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { projectAuth, projectFirestore, projectGitHub, projectGoogle } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)
	const { dispatch } = useAuthContext()
	const [isFinished, setIsFinished] = useState(false)

	let history = useHistory()

	const login = async (email, password) => {
		setError(null)
		setIsPending(true)

		try {
			// Login
			const res = await projectAuth.signInWithEmailAndPassword(email, password)

			// Update online status

			await projectFirestore.collection('users').doc(res.user.uid).update({
				online: true,
			})

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

			// Update online status

			await projectFirestore.collection('users').doc(res.user.uid).update({
				online: true,
			})

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
			// Update online status

			await projectFirestore.collection('users').doc(res.user.uid).update({
				online: true,
			})

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
					history.push('/login')
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
			}
		} catch (err) {
			if (!isCancelled) {
				setError(err.message)
				setIsPending(false)
				setIsFinished(false)
			}
		}
	}

	useEffect(() => {
		return () => setIsCancelled(true)
	}, [])

	return { login, loginWithGoogle, loginWithGithub, sendPasswordReset, resetPassword, isPending, error, isFinished }
}
