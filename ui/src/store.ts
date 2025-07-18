import { configureStore } from '@reduxjs/toolkit'
import summaryReducer from './features/point-of-sale/slices/summary.ts'

export const store = configureStore({
    reducer: {
        "pos": summaryReducer
        // posts: postsReducer,
        // comments: commentsReducer,
        // users: usersReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch