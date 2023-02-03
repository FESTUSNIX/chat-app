import React, { useEffect, useState } from 'react'
import { useFirestore } from '../../hooks/useFirestore'
import { useDocument } from '../../hooks/useDocument'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'

// Styles
import './Pinned.scss'

// Components
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Link } from 'react-router-dom'
import Modal from '../Modal/Modal'
import Avatar from '../Avatar/Avatar'

const Pinned = ({ orientation }) => {
	const { user } = useAuthContext()
	const { documents: chats } = useCollection(
		'projects',
		['assignedUsersId', 'array-contains', user.uid],
		['updatedAt', 'desc']
	)
	const { updateDocument } = useFirestore('users')
	const { documents: users } = useCollection('users')
	const { document: userDoc } = useDocument('users', user.uid)

	const [favs, setFavs] = useState([])
	const [showFavs, setShowFavs] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const [favsCopy, setFavsCopy] = useState(favs)

	useEffect(() => {
		if (chats && chats !== null && chats.length !== 0) {
			if (userDoc && userDoc.pinned) {
				setFavs(userDoc.pinned)
			} else {
				setFavs([null, null, null, null])
			}
		}
	}, [chats, userDoc])

	useEffect(() => {
		if (userDoc && userDoc.pinned !== null) {
			setFavs(userDoc.pinned)
		}
	}, [userDoc])

	const getDoc = id => {
		let res = null

		if (users) {
			res = users.filter(doc => {
				if (doc.id === id) {
					return true
				}
				return false
			})[0]
		}

		return res
	}

	const filterChats = chat => {
		let result = false
		if (favsCopy) {
			favsCopy.forEach(fav => {
				if (fav !== null) {
					if (fav.id === chat.id) {
						result = true
					}
				}
			})
		}
		return result
	}

	const handleOnDragEnd = async result => {
		if (!result.destination) return
		const items = Array.from(favs)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)

		setFavs(items)
		await updateDocument(user.uid, {
			pinned: items,
		})
	}

	const handleOnDragEndCopy = result => {
		if (!result.destination) return

		if (result.source.droppableId === result.destination.droppableId && result.source.droppableId === 'manage-favs') {
			const items = Array.from(favsCopy)
			const [reorderedItem] = items.splice(result.source.index, 1)
			items.splice(result.destination.index, 0, reorderedItem)
			setFavsCopy(items)
		}

		if (result.destination.droppableId === 'empty-slots') {
			const favs = Array.from(favsCopy)
			const items = Array.from(chats.filter(chat => !filterChats(chat)))

			const chatToAdd = items[result.source.index]
			let userToAdd
			let index

			if (!chatToAdd.isGroup) {
				chatToAdd.assignedUsers.forEach(u => {
					if (u.id !== user.uid) {
						userToAdd = {
							id: chatToAdd.id,
							uid: u.id,
						}
					}
				})
			}

			favs.forEach(item => {
				if (item === null) {
					index = favsCopy.indexOf(item)
				}
			})

			favs.splice(index, 1, userToAdd)

			setFavsCopy(favs)
		}
	}

	const handleRemoveFav = fav => {
		const items = Array.from(favsCopy)
		// const [reorderedItem] = items.splice(favs.indexOf(fav), 1)
		items.splice(favsCopy.indexOf(fav), 1)
		items.push(null)

		setFavsCopy(items)
	}

	const addFav = chat => {
		const items = Array.from(favsCopy)
		let index
		let userToAdd

		if (!chat.isGroup) {
			chat.assignedUsers.forEach(u => {
				if (u.id !== user.uid) {
					userToAdd = {
						id: chat.id,
						uid: u.id,
					}
				}
			})
		}

		items.forEach(item => {
			if (item === null) {
				index = favsCopy.indexOf(item)
			}
		})

		items.splice(index, 1, userToAdd)
		setFavsCopy(items)
	}
	return (
		<>
			<DragDropContext onDragEnd={handleOnDragEnd}>
				<Droppable droppableId='favourites' direction={orientation === 'horizontal' ? 'horizontal' : 'vertical'}>
					{provided => (
						<div
							className={`pinned ${orientation} ${favs && favs.filter(f => f !== null).length === 4 ? 'full' : ''}`}
							{...provided.droppableProps}
							ref={provided.innerRef}>
							{favs &&
								favs.map(
									(f, index) =>
										f !== null && (
											<Draggable key={f.id} draggableId={f.id} index={index}>
												{provided => (
													<Link
														to={`/u/${f.id}`}
														draggable='true'
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														ref={provided.innerRef}>
														<Avatar src={getDoc(f.uid) ? getDoc(f.uid).photoURL : ''} />
													</Link>
												)}
											</Draggable>
										)
								)}
							{provided.placeholder}
							<div
								className='pinned__add'
								onClick={() => {
									setShowFavs(true)
									setFavsCopy(favs)
								}}>
								<i className='fa-regular fa-star'></i>
							</div>
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<Modal show={showFavs} setShow={() => setShowFavs(false)}>
				<div className='pinned__modal'>
					<DragDropContext onDragEnd={handleOnDragEndCopy}>
						<Droppable droppableId='manage-favs' direction='horizontal' type='manage-favs'>
							{provided => (
								<div className='pinned__modal-current-favs' {...provided.droppableProps} ref={provided.innerRef}>
									{favsCopy &&
										favsCopy.map(
											(f, index) =>
												f !== null && (
													<Draggable key={f.id} draggableId={f.id} index={index} type='FAVS-LIST'>
														{provided => (
															<div
																className='fav'
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																draggable='true'
																ref={provided.innerRef}>
																<Avatar src={getDoc(f.uid) ? getDoc(f.uid).photoURL : ''} />
																<div
																	className='fav__remove'
																	onClick={() => {
																		handleRemoveFav(f)
																	}}>
																	<i className='fa-solid fa-xmark'></i>
																</div>
															</div>
														)}
													</Draggable>
												)
										)}

									{provided.placeholder}

									{favsCopy && favsCopy.includes(null) && (
										<Droppable droppableId='empty-slots' direction='horizontal'>
											{provided => (
												<div className='flex-row' {...provided.droppableProps} ref={provided.innerRef}>
													{favsCopy.map(
														(f, index) =>
															f === null && (
																<React.Fragment key={index}>
																	<div className='fav fav--empty'>
																		<i className='fa-regular fa-star'></i>
																		{provided.placeholder}
																	</div>
																</React.Fragment>
															)
													)}
												</div>
											)}
										</Droppable>
									)}
								</div>
							)}
						</Droppable>

						<div>
							<input
								type='text'
								placeholder='Find a user'
								value={searchValue}
								onChange={e => setSearchValue(e.target.value)}
								className='mb1'
							/>
							<Droppable droppableId='chats-list' isDropDisabled={true}>
								{provided => (
									<ul
										className='pinned__modal-chats-list custom-scrollbar'
										{...provided.droppableProps}
										ref={provided.innerRef}>
										{chats &&
											chats
												.filter(chat => !filterChats(chat))
												.map((chat, index) => (
													<React.Fragment key={chat.id}>
														{/* Code for groups */}
														{/* {chat.isGroup &&
                                                    chat.groupName
                                                        .toLowerCase()
                                                        .trim()
                                                        .replace(/\s+/g, '')
                                                        .includes(searchValue.toLowerCase()) && (
                                                        <li key={chat.id}>
                                                            <Avatar src={chat.photoURL} />
                                                            <p>{chat.displayName}</p>
                                                        </li>
                                                    )} */}
														{!chat.isGroup &&
															chat.assignedUsers.map(
																u =>
																	u.id !== user.uid &&
																	getDoc(u.id) !== null &&
																	getDoc(u.id)
																		.displayName.toLowerCase()
																		.trim()
																		.replace(/\s+/g, '')
																		.includes(searchValue.toLowerCase()) && (
																		<Draggable key={u.id} draggableId={u.id} index={index}>
																			{(provided, snapshot) => (
																				<li
																					key={chat.id}
																					className={`${snapshot.isDragging ? 'dragged' : ''} ${
																						snapshot.draggingOver === 'empty-slots' ? 'hover-over-slot' : ''
																					}`}
																					onClick={() => addFav(chat)}
																					style={{ width: '10px !important' }}
																					{...provided.draggableProps}
																					ref={provided.innerRef}>
																					<div className='flex-row'>
																						{!snapshot.isDragging && (
																							<Avatar src={getDoc(u.id) ? getDoc(u.id).photoURL : ''} />
																						)}
																						{!snapshot.isDragging && (
																							<p>{getDoc(u.id) ? getDoc(u.id).displayName : ''}</p>
																						)}
																					</div>
																					<div className='handle' {...provided.dragHandleProps}>
																						{!snapshot.isDragging && <i className='fa-solid fa-grip-vertical'></i>}
																						{snapshot.isDragging && (
																							<Avatar src={getDoc(u.id) ? getDoc(u.id).photoURL : ''} />
																						)}
																					</div>
																				</li>
																			)}
																		</Draggable>
																	)
															)}
													</React.Fragment>
												))}
										{provided.placeholder}
									</ul>
								)}
							</Droppable>
						</div>
					</DragDropContext>

					<div className='btn-group'>
						<div className='btn btn--secondary' onClick={() => setShowFavs(false)}>
							cancel
						</div>
						<div
							className='btn'
							onClick={() => {
								updateDocument(user.uid, {
									pinned: favsCopy,
								})
								setShowFavs(false)
							}}>
							finish
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default Pinned
