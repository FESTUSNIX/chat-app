import { useDropzone } from 'react-dropzone'
import { useAuthContext } from '../../../../../hooks/useAuthContext'
import { useFirestore } from '../../../../../hooks/useFirestore'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { deleteObject, getDownloadURL, getStorage, list, ref, uploadBytes } from 'firebase/storage'
import { toast } from 'react-toastify'
import { projectStorage } from '../../../../../firebase/config'
import { updateProfile } from 'firebase/auth'
import getCroppedImg from '../CropImg'

// Components
import Modal from '../../../../../components/Modal/Modal'
import Cropper from 'react-easy-crop'

const AvatarField = ({ setAvatarState, userDoc, setShowAvatarModal, showAvatarModal }) => {
	const { user } = useAuthContext()

	const { updateDocument } = useFirestore('users')
	const { acceptedFiles, getRootProps, getInputProps, isDragAccept, isDragReject, open } = useDropzone({
		noClick: true,
		multiple: false,
		accept: {
			'image/*': [],
		},
		onDrop: acceptedFiles => {
			setFiles(
				Object.assign(acceptedFiles[0], {
					preview: URL.createObjectURL(acceptedFiles[0]),
				})
			)
		},
	})

	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)

	const [files, setFiles] = useState(null)

	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
	const [croppedImage, setCroppedImage] = useState(null)

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels)
	}, [])

	const showCroppedImage = useCallback(async () => {
		try {
			const croppedImage = await getCroppedImg(files.preview, croppedAreaPixels, 0)
			setCroppedImage(croppedImage)
			updateAvatar(croppedImage, true)
		} catch (e) {
			console.error(e)
		}
	}, [croppedAreaPixels, files])

	const Undo = ({ onUndo, closeToast }) => {
		const handleClick = () => {
			onUndo()
			closeToast()
		}

		return (
			<div className='reset-toast'>
				Avatar Deleted <button onClick={handleClick}>UNDO</button>
			</div>
		)
	}

	const deletePhotoURLFromStorage = () => {
		const storageRef = ref(projectStorage, `thumbnails/${user.uid}/`)

		list(storageRef)
			.then(res => {
				const deleteRef = ref(projectStorage, res.items[0].fullPath)
				deleteObject(deleteRef)
			})
			.catch(error => {
				setError(error.message)
				console.log(error.message)
			})
	}

	const removePhotoURLs = async () => {
		setError(null)
		setIsPending(true)

		try {
			await updateProfile(user, {
				photoURL: '',
			})
			await updateDocument(user.uid, {
				photoURL: '',
			})
			deletePhotoURLFromStorage()
			setIsPending(false)
			setError(null)
		} catch (error) {
			setError(error.message)
			console.log(error.message)
			setIsPending(false)
		}
	}

	function reducer(state, action) {
		switch (action.type) {
			case 'QUEUE_FOR_REMOVAL':
				return {
					url: state.url,
					remove: true,
				}
			case 'CLEAN_COLLECTION':
				if (state.remove) {
					removePhotoURLs()
				}
				return {
					url: state.remove ? '' : state.url,
					remove: false,
				}
			case 'UNDO':
				return {
					url: state.url,
					remove: false,
				}
			default:
				return state
		}
	}

	const [state, dispatch] = useReducer(reducer, {
		url: null,
		remove: false,
	})

	useEffect(() => {
		setAvatarState(state)
	}, [state])

	const handleRemoveAvatar = () => {
		dispatch({
			type: 'QUEUE_FOR_REMOVAL',
		})
		toast.info(<Undo onUndo={() => dispatch({ type: 'UNDO' })} />, {
			position: 'bottom-right',
			autoClose: 15000,
			hideProgressBar: false,
			// closeButton: false,
			closeOnClick: false,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'dark',
			onClose: () => dispatch({ type: 'CLEAN_COLLECTION' }),
		})
	}

	const updateAvatar = async image => {
		const storage = getStorage()
		const uploadPath = `thumbnails/${user.uid}/${image.name}`
		const storageRef = ref(storage, uploadPath)

		await uploadBytes(storageRef, image)
			.then(snapshot => {
				getDownloadURL(snapshot.ref).then(async downloadURL => {
					try {
						await updateDocument(user.uid, {
							photoURL: downloadURL,
						})
						await user.updateProfile({ photoURL: downloadURL })

						setShowAvatarModal(false)
						setFiles(null)
						setCrop({ x: 0, y: 0 })
						setZoom(1)
						setCroppedAreaPixels(null)
						setCroppedImage(null)
						toast.success('Succesfully updated your avatar', {
							position: 'bottom-right',
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: 'dark',
						})
					} catch (error) {
						console.log(error.message)
					}
				})
			})
			.catch(error => {
				console.log(error.message)
			})
	}

	return (
		userDoc && (
			<div className='profile-settings__fields-field'>
				<h3 className='field-title'>avatar</h3>

				<div className='btn-group'>
					<>
						<button className='btn' onClick={() => setShowAvatarModal(true)}>
							change avatar
						</button>

						<Modal show={showAvatarModal} setShow={() => setShowAvatarModal(false)}>
							{!files && (
								<section
									{...getRootProps({
										className: `dropzone-container ${isDragAccept ? 'accepted' : ''} ${isDragReject ? 'rejected' : ''}`,
									})}>
									<input {...getInputProps()} />
									<button className='btn' onClick={open}>
										browse files
									</button>
									<p>...or drag and drop image</p>
								</section>
							)}

							{files && (
								<div className='crop-container'>
									<div className='modal__content-padding'>
										<section>
											<h3>Edit Image</h3>

											<Cropper
												image={files.preview}
												crop={crop}
												zoom={zoom}
												aspect={1 / 1}
												cropShape='round'
												onCropChange={setCrop}
												onCropComplete={onCropComplete}
												onZoomChange={setZoom}
												maxZoom={3}
											/>

											<div className='controls'>
												<input
													type='range'
													value={zoom}
													min={1}
													max={3}
													step={0.01}
													aria-labelledby='Zoom'
													onChange={e => {
														setZoom(e.target.value)
													}}
													className='zoom-range'
												/>
											</div>
										</section>
									</div>
									<div className='btn-group'>
										<button className='btn btn--secondary' onClick={() => updateAvatar(files)}>
											Skip
										</button>
										<div className='flex-row gap1'>
											<button
												className='btn btn--secondary'
												onClick={() => {
													setFiles(null)
													setCrop({ x: 0, y: 0 })
													setZoom(1)
												}}>
												Cancel
											</button>
											<button className='btn' onClick={showCroppedImage}>
												Apply
											</button>
										</div>
									</div>
								</div>
							)}
						</Modal>
					</>

					{userDoc.photoURL && !state.remove && (
						<button className='btn btn--secondary' onClick={handleRemoveAvatar}>
							remove avatar
						</button>

						// notifyAvatar(() => (
						// 	<div className='reset-toast'>
						// 		Removed avatar <span>reset</span>
						// 	</div>
						// ))
					)}
				</div>
				{error && <div className='error'>{error}</div>}
			</div>
		)
	)
}

export default AvatarField
