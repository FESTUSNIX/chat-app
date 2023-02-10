import { useEffect, useState } from 'react'
import { Avatar, Field, Modal } from '../../../components'
import { useCollection } from '../../../hooks/useCollection'
import { useFirestore } from '../../../hooks/useFirestore'

export default function ChangeNicknames({ chat, setShowNicknameModal, showNicknameModal, sendMessage }) {
	const { documents: users } = useCollection('users')
	const { updateDocument } = useFirestore('projects')

	const [showNicknameInput, setShowNicknameInput] = useState(null)
	const [newNickname, setNewNickname] = useState('')

	useEffect(() => setShowNicknameModal(false), [chat.id])

	const changeNickname = user => {
		if (newNickname.trim() !== '' && newNickname.trim().length < 80) {
			chat.assignedUsers.forEach(u => {
				u.id === user.id
					? sendMessage(`Set nickname of user ${getDoc(u.id).displayName} to ${newNickname.trim()}`, newNickname.trim())
					: updateDocument(chat.id, {
							assignedUsers: [
								u,
								{
									id: user.id,
									nickname: newNickname.trim()
								}
							]
					  })
				setShowNicknameModal(false)
			})
		}
	}

	const getDoc = id => users?.filter(doc => doc.id === id)?.[0] ?? null

	return (
		<Modal
			show={showNicknameModal}
			setShow={() => setShowNicknameModal(false)}
			onClose={() => {
				setNewNickname('')
				setShowNicknameInput(null)
			}}>
			{chat.assignedUsers.map(u => (
				<div
					key={u.id}
					className='user'
					onClick={() => {
						if (showNicknameInput !== u.id) setNewNickname('')
						setShowNicknameInput(u.id)
					}}>
					<div className='author'>
						<Avatar src={getDoc(u.id) !== null ? getDoc(u.id).photoURL : ''} />
						{showNicknameInput !== u.id && (
							<div className='flex-column'>
								<p className='user__display-name'>{u.nickname}</p>
								<p>Set nickname</p>
							</div>
						)}

						{showNicknameInput === u.id && (
							<Field value={newNickname} setValue={setNewNickname} placeholder={u.nickname} type='text' />
						)}
					</div>

					{showNicknameInput !== u.id && <i className='fa-solid fa-pen-to-square'></i>}
					{showNicknameInput === u.id && (
						<i
							className='fa-solid fa-check'
							onClick={() => {
								changeNickname(u)
							}}></i>
					)}
				</div>
			))}
		</Modal>
	)
}
