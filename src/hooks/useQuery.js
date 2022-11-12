import { useLocation } from 'react-router-dom'

export const useQuery = queryName => {
	const location = useLocation()
	const query = new URLSearchParams(location.search).get(queryName)
	return query
}
