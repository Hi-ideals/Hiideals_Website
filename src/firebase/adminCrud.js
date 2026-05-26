import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, Timestamp,
} from 'firebase/firestore'
import {
  ref, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage'
import { db, storage } from './config'

/**
 * Fetch all docs from a collection, sorted by 'order' or 'createdAt'.
 */
export async function fetchCollection(collectionName, sortField = 'order') {
  const q = query(collection(db, collectionName))
  const snap = await getDocs(q)
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

  // Sort client-side (avoids needing composite indexes for every collection)
  return items.sort((a, b) => {
    const aVal = a[sortField] ?? 0
    const bVal = b[sortField] ?? 0
    if (typeof aVal === 'number' && typeof bVal === 'number') return aVal - bVal
    // For timestamps
    const aTime = aVal?.seconds || aVal?.getTime?.() || 0
    const bTime = bVal?.seconds || bVal?.getTime?.() || 0
    return bTime - aTime
  })
}

/**
 * Fetch a single doc.
 */
export async function fetchDoc(collectionName, docId) {
  const snap = await getDoc(doc(db, collectionName, docId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/**
 * Create or update a doc. If no docId given, auto-generate slug from name/title.
 */
export async function saveDoc(collectionName, data, docId) {
  const id = docId || slugify(data.name || data.title || `item-${Date.now()}`)
  const docRef = doc(db, collectionName, id)
  const exists = (await getDoc(docRef)).exists()

  if (exists) {
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() })
  } else {
    await setDoc(docRef, { ...data, createdAt: serverTimestamp() })
  }
  return id
}

/**
 * Delete a doc.
 */
export async function removeDoc(collectionName, docId) {
  await deleteDoc(doc(db, collectionName, docId))
}

/**
 * Upload a file to Firebase Storage. Returns the download URL.
 */
export async function uploadFile(file, path) {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

/**
 * Delete a file from Firebase Storage.
 */
export async function deleteFile(path) {
  try {
    await deleteObject(ref(storage, path))
  } catch (e) {
    // Ignore if already deleted
    console.warn('Delete file error:', e.message)
  }
}

/**
 * Utility: slugify a string.
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/**
 * Export data as Excel file.
 */
export async function exportToExcel(data, filename = 'export') {
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(data.map((item) => {
    const flat = {}
    for (const [k, v] of Object.entries(item)) {
      if (v instanceof Timestamp) flat[k] = v.toDate().toLocaleString()
      else if (v?.seconds) flat[k] = new Date(v.seconds * 1000).toLocaleString()
      else if (Array.isArray(v)) flat[k] = v.join(', ')
      else flat[k] = v
    }
    return flat
  }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}
