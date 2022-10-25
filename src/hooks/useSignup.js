import { useState, useEffect } from 'react'
import { projectAuth, projectFirestore, projectStorage, projectGoogle } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)
	const { dispatch } = useAuthContext()

	const signup = async (email, password, displayName, thumbnail) => {
		setError(null)
		setIsPending(true)

		try {
			// Signup
			const res = await projectAuth.createUserWithEmailAndPassword(email, password)

			if (!res) {
				throw new Error('Could not complete signup')
			}

			// Upload thumbnail

			const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
			const img = await projectStorage.ref(uploadPath).put(thumbnail)
			const imgUrl = await img.ref.getDownloadURL()

			// Add display name to user
			await res.user.updateProfile({ displayName, photoURL: imgUrl })

			// Create a user document
			await projectFirestore.collection('users').doc(res.user.uid).set({
				online: true,
				displayName: displayName,
				photoURL: imgUrl,
			})

			// Dispatch login action
			dispatch({ type: 'LOGIN', payload: res.user })

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

	const signInWithGoogle = async () => {
		setError(null)
		setIsPending(true)

		try {
			// Signup
			const res = await projectAuth.signInWithPopup(projectGoogle)

			if (!res) {
				throw new Error('Could not complete signup')
			}

			// Add display name to user
			await res.user.updateProfile({ displayName: res.user.displayName, photoURL: res.user.photoURL })

			// Create a user document
			await projectFirestore.collection('users').doc(res.user.uid).set({
				online: true,
				displayName: res.user.displayName,
				photoURL: res.user.photoURL,
			})

			// Dispatch login action
			dispatch({ type: 'LOGIN', payload: res.user })

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

	return { signup, signInWithGoogle, error, isPending }
}
