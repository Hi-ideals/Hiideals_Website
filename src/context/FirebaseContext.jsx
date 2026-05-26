import { createContext, useContext } from 'react'
import { db, storage, auth } from '../firebase/config'

const FirebaseContext = createContext()

export function FirebaseProvider({ children }) {
  return (
    <FirebaseContext.Provider value={{ db, storage, auth }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) throw new Error('useFirebase must be used within FirebaseProvider')
  return context
}
