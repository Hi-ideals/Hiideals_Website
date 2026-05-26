import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useFirestoreCollection(collectionName, orderField = null) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = collection(db, collectionName)
        const q = orderField ? query(ref, orderBy(orderField)) : ref
        const snapshot = await getDocs(q)
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setData(docs)
      } catch (err) {
        console.warn(`Firestore collection "${collectionName}" unavailable:`, err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [collectionName, orderField])

  return { data, loading, error }
}
