import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuthContext } from '../../../../../hooks/useAuthContext'
import { useFirestore } from '../../../../../hooks/useFirestore'

export default function AboutField({ about, setAbout }) {
	const { user } = useAuthContext()
	const { updateDocument } = useFirestore('users')

	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)

	const notify = message =>
		toast.success(message, {
			position: 'bottom-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'dark',
		})

	const updateBio = async () => {
		setError(null)

		if (about.length < 71) {
			try {
				await updateDocument(user.uid, {
					bio: about,
				})

				setIsPending(false)
				setError(null)
				notify('Updated about me')
			} catch (error) {
				setError(error.message)
				console.log(error.message)
				setIsPending(false)
			}
		} else {
			setError('About me must be less than 169 character long')
		}
	}

	return (
		<div className='profile-settings__fields-field'>
			<h3 className='field-title'>about me</h3>

			<div className='textarea-container'>
				<textarea value={about} onChange={e => setAbout(e.target.value)}></textarea>

				<div className={`textarea-container__char-counter ${about.length > 70 ? 'limit' : ''}`}>
					{70 - about.length}
				</div>
			</div>
			{error && <div className='error'>{error}</div>}
			<button className='btn btn--secondary text-capitalize' onClick={() => updateBio()}>
				update about me
			</button>
		</div>
	)
}
