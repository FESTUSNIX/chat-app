import { useState, useEffect } from 'react'
import { projectAuth, projectFirestore, projectGitHub, projectGoogle } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)
	const { dispatch } = useAuthContext()

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

	useEffect(() => {
		return () => setIsCancelled(true)
	}, [])

	return { login, loginWithGoogle, loginWithGithub, isPending, error }
}
