import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useFirestoreDoc(collectionName, docId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!docId) return
    const fetchDoc = async () => {
      try {
        const docRef = doc(db, collectionName, docId)
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() })
        }
      } catch (err) {
        console.warn(`Firestore doc "${collectionName}/${docId}" unavailable:`, err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()
  }, [collectionName, docId])

  return { data, loading, error }
}
