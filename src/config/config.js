const config = {
    appwrite_url : String(import.meta.env.VITE_APPWRITE_URL),
    appwrite_project_id : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwrite_db_id : String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwrite_collection_id : String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwrite_bucket_id : String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}

export default config