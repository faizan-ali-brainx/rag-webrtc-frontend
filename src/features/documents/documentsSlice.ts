import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Document } from '../../types/api'
import * as documentsApi from '../../api/documents.api'

type LoadStatus = 'idle' | 'loading' | 'error'
type UploadStatus = 'idle' | 'uploading' | 'error'

interface DocumentsState {
  items: Document[]
  listStatus: LoadStatus
  uploadStatus: UploadStatus
}

const initialState: DocumentsState = {
  items: [],
  listStatus: 'idle',
  uploadStatus: 'idle',
}

/** Fetches all of the user's documents. */
export const fetchDocuments = createAsyncThunk('documents/fetchAll', () =>
  documentsApi.listDocuments(),
)

/** Uploads a file and returns the created document. */
export const uploadDocument = createAsyncThunk(
  'documents/upload',
  (file: File) => documentsApi.uploadDocument(file),
)

/** Deletes a document and returns its id. */
export const deleteDocument = createAsyncThunk(
  'documents/delete',
  async (id: string) => {
    await documentsApi.deleteDocument(id)
    return id
  },
)

function setDocuments(state: DocumentsState, action: PayloadAction<Document[]>) {
  state.items = action.payload
  state.listStatus = 'idle'
}

function addDocument(state: DocumentsState, action: PayloadAction<Document>) {
  state.items.unshift(action.payload)
  state.uploadStatus = 'idle'
}

function removeDocument(state: DocumentsState, action: PayloadAction<string>) {
  state.items = state.items.filter((doc) => doc.id !== action.payload)
}

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.listStatus = 'loading'
      })
      .addCase(fetchDocuments.fulfilled, setDocuments)
      .addCase(fetchDocuments.rejected, (state) => {
        state.listStatus = 'error'
      })
      .addCase(uploadDocument.pending, (state) => {
        state.uploadStatus = 'uploading'
      })
      .addCase(uploadDocument.fulfilled, addDocument)
      .addCase(uploadDocument.rejected, (state) => {
        state.uploadStatus = 'error'
      })
      .addCase(deleteDocument.fulfilled, removeDocument)
  },
})

export default documentsSlice.reducer
